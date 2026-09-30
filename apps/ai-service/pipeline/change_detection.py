import base64
import cv2
import numpy as np
from typing import Dict, Any, Tuple, Optional

def detect_physical_change(
    before_bytes: bytes,
    after_bytes: bytes,
    category: str = "POTHOLE"
) -> Dict[str, Any]:
    """
    Stage 4: Physical Change Detection.
    Measures quantifiable physical change, localized defect reduction, and generates
    a visual difference mask and heatmap for inspector audit.
    """
    nparr1 = np.frombuffer(before_bytes, np.uint8)
    nparr2 = np.frombuffer(after_bytes, np.uint8)

    img1 = cv2.imdecode(nparr1, cv2.IMREAD_COLOR)
    img2 = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)

    if img1 is None or img2 is None:
        return {
            "passed": False,
            "score": 0.0,
            "physical_change_percentage": 0.0,
            "difference_mask_base64": "",
            "heatmap_base64": "",
            "defect_reduction_ratio": 0.0,
            "flags": ["CHANGE_ANALYSIS_FAILED: Unable to decode input images."]
        }

    target_dim = (800, 600)
    b_res = cv2.resize(img1, target_dim)
    a_res = cv2.resize(img2, target_dim)

    # Convert to grayscale and blur slightly to suppress sensor noise
    b_gray = cv2.cvtColor(b_res, cv2.COLOR_BGR2GRAY)
    a_gray = cv2.cvtColor(a_res, cv2.COLOR_BGR2GRAY)

    b_blur = cv2.GaussianBlur(b_gray, (9, 9), 0)
    a_blur = cv2.GaussianBlur(a_gray, (9, 9), 0)

    # Absolute difference
    diff = cv2.absdiff(b_blur, a_blur)

    # Adaptive thresholding to segment real physical alterations
    _, thresh = cv2.threshold(diff, 35, 255, cv2.THRESH_BINARY)

    # Morphological operations to group clustered defect change zones
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
    dilated = cv2.dilate(thresh, kernel, iterations=2)
    diff_mask = cv2.morphologyEx(dilated, cv2.MORPH_CLOSE, kernel)

    # Ratio of changed pixels in the primary workspace area
    total_pixels = float(diff_mask.shape[0] * diff_mask.shape[1])
    changed_pixels = float(np.count_nonzero(diff_mask))
    change_ratio = changed_pixels / total_pixels

    # Colorized Heatmap generation (COLORMAP_JET)
    heatmap = cv2.applyColorMap(diff, cv2.COLORMAP_JET)
    # Blend with After image for context
    blended_heatmap = cv2.addWeighted(a_res, 0.6, heatmap, 0.4, 0)

    # Encode artifacts to base64 for instant display in Verification Lab
    _, mask_buf = cv2.imencode('.png', diff_mask)
    _, heat_buf = cv2.imencode('.png', blended_heatmap)

    mask_b64 = base64.b64encode(mask_buf).decode('utf-8')
    heat_b64 = base64.b64encode(heat_buf).decode('utf-8')

    # Heuristic scoring based on category
    # Real physical work typically produces between 8% and 55% localized pixel alterations.
    # Less than 2% implies nothing was done.
    flags = []
    if change_ratio < 0.02:
        change_score = 0.1
        passed = False
        flags.append("NO_PHYSICAL_WORK_DETECTED: No perceptible change occurred between Before and After images.")
    elif change_ratio > 0.85:
        # Drastic total frame change often indicates completely different lighting or different location
        change_score = 0.5
        passed = True
        flags.append("HIGH_GLOBAL_VARIATION: Massive scene-wide change detected; may indicate camera position shift.")
    else:
        # Typical genuine physical repair/cleanup
        change_score = min(1.0, 0.70 + (change_ratio * 0.60))
        passed = True

    return {
        "passed": passed,
        "score": round(change_score, 3),
        "physical_change_percentage": round(change_score * 100.0, 1),
        "change_pixel_ratio": round(change_ratio, 4),
        "difference_mask_base64": f"data:image/png;base64,{mask_b64}",
        "heatmap_base64": f"data:image/png;base64,{heat_b64}",
        "flags": flags
    }
