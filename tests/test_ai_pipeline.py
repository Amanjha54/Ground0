import unittest
import io
import numpy as np
from PIL import Image, ImageDraw

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps', 'ai-service')))

from pipeline.integrity import compute_sha256, compute_phash, hamming_distance, verify_evidence_integrity
from pipeline.location import haversine_distance_meters, verify_location
from pipeline.scene_match import verify_scene_match
from pipeline.change_detection import detect_physical_change
from pipeline.risk_engine import calculate_risk_and_recommendation

def create_synthetic_image(fill_color=(100, 100, 100), defect_box=None) -> bytes:
    """Creates synthetic RGB image bytes with optional simulated cavity defect."""
    img = Image.new('RGB', (400, 300), color=fill_color)
    draw = ImageDraw.Draw(img)
    if defect_box:
        # Draw simulated dark pothole cavity
        draw.ellipse(defect_box, fill=(20, 20, 20), outline=(10, 10, 10))
    # Add static background landmarks (e.g. sidewalk curb)
    draw.rectangle([0, 260, 400, 300], fill=(160, 160, 160))
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    return buf.getvalue()

class TestGround0AIPipeline(unittest.TestCase):

    def setUp(self):
        # Before image: pavement with dark hole cavity
        self.before_bytes = create_synthetic_image(defect_box=[150, 100, 250, 180])
        # After image: same pavement with repaired flush surface (defect filled)
        self.after_bytes = create_synthetic_image(defect_box=None)
        # Random different scene (e.g. grass field)
        self.mismatch_bytes = create_synthetic_image(fill_color=(40, 120, 40), defect_box=None)

    def test_sha256_computation(self):
        sha1 = compute_sha256(self.before_bytes)
        sha2 = compute_sha256(self.before_bytes)
        self.assertEqual(sha1, sha2)
        self.assertEqual(len(sha1), 64)

    def test_phash_computation(self):
        ph1 = compute_phash(self.before_bytes)
        ph2 = compute_phash(self.after_bytes)
        self.assertTrue(len(ph1) > 0)
        self.assertTrue(len(ph2) > 0)

    def test_replay_fraud_detection(self):
        # Submitting the EXACT same image as After evidence
        result = verify_evidence_integrity(
            before_bytes=self.before_bytes,
            after_bytes=self.before_bytes # Replay attack!
        )
        self.assertFalse(result["passed"])
        self.assertTrue(result["is_replay_attack"])
        self.assertLessEqual(result["score"], 0.1)

    def test_location_geofence(self):
        # Expected coordinates: SF Market St
        exp_lat, exp_lon = 37.775100, -122.419200

        # Close coordinate: 4.5 meters away
        res_near = verify_location(37.775130, -122.419220, exp_lat, exp_lon, max_geofence_meters=50.0)
        self.assertTrue(res_near["passed"])
        self.assertLess(res_near["distance_meters"], 10.0)

        # Far coordinate: 500 meters away (spoofed)
        res_far = verify_location(37.780000, -122.415000, exp_lat, exp_lon, max_geofence_meters=50.0)
        self.assertFalse(res_far["passed"])
        self.assertTrue(len(res_far["flags"]) > 0)

    def test_physical_change_detection(self):
        res = detect_physical_change(self.before_bytes, self.after_bytes, category="POTHOLE")
        self.assertTrue(res["passed"])
        self.assertGreater(res["physical_change_percentage"], 50.0)
        self.assertTrue(res["difference_mask_base64"].startswith("data:image/png;base64,"))

    def test_risk_synthesis(self):
        integ = {"passed": True, "score": 1.0, "is_replay_attack": False}
        loc = {"passed": True, "score": 0.98, "distance_meters": 3.8}
        scene = {"passed": True, "score": 0.94, "scene_match_percentage": 94.1}
        chg = {"passed": True, "score": 0.91, "physical_change_percentage": 91.4}
        req = {"requirement_score": 0.95}

        risk = calculate_risk_and_recommendation(integ, loc, scene, chg, req)
        self.assertEqual(risk["risk_level"], "LOW")
        self.assertEqual(risk["ai_recommendation"], "READY_FOR_APPROVAL")
        self.assertGreater(risk["overall_confidence"], 0.85)

if __name__ == '__main__':
    unittest.main()
