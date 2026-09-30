import cv2
import numpy as np
from typing import Dict, Any, Tuple, Optional

def decode_image_from_bytes(data: bytes) -> Optional[np.ndarray]:
    """Decodes raw image bytes into a BGR OpenCV NumPy array."""
    try:
        nparr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception:
        return None

def compute_ssim_approx(img1_gray: np.ndarray, img2_gray: np.ndarray) -> float:
    """
    Computes an approximate Structural Similarity Index (SSIM) between two grayscale images.
    """
    if img1_gray.shape != img2_gray.shape:
        img2_gray = cv2.resize(img2_gray, (img1_gray.shape[1], img1_gray.shape[0]))

    c1 = (0.01 * 255) ** 2
    c2 = (0.03 * 255) ** 2

    img1 = img1_gray.astype(np.float64)
    img2 = img2_gray.astype(np.float64)

    mu1 = cv2.GaussianBlur(img1, (11, 11), 1.5)
    mu2 = cv2.GaussianBlur(img2, (11, 11), 1.5)

    mu1_sq = mu1 ** 2
    mu2_sq = mu2 ** 2
    mu1_mu2 = mu1 * mu2

    sigma1_sq = cv2.GaussianBlur(img1 ** 2, (11, 11), 1.5) - mu1_sq
    sigma2_sq = cv2.GaussianBlur(img2 ** 2, (11, 11), 1.5) - mu2_sq
    sigma12 = cv2.GaussianBlur(img1 * img2, (11, 11), 1.5) - mu1_mu2

    ssim_map = ((2 * mu1_mu2 + c1) * (2 * sigma12 + c2)) / ((mu1_sq + mu2_sq + c1) * (sigma1_sq + sigma2_sq + c2))
    return float(np.mean(ssim_map))

def verify_scene_match(
    before_bytes: bytes,
    after_bytes: bytes,
    min_match_threshold: float = 0.65
) -> Dict[str, Any]:
    """
    Stage 3: Scene Identity Matching.
    Uses ORB keypoints, Lowe's ratio test, and RANSAC homography to determine
    if Before and After depict the exact same physical scene and static landmarks.
    """
    img_before = decode_image_from_bytes(before_bytes)
    img_after = decode_image_from_bytes(after_bytes)

    if img_before is None or img_after is None:
        return {
            "passed": False,
            "score": 0.0,
            "scene_match_percentage": 0.0,
            "inlier_ratio": 0.0,
            "ssim_score": 0.0,
            "flags": ["CORRUPTED_IMAGE_PAYLOAD: Failed to decode visual evidence into bitmap."]
        }

    # Normalize resolution for consistent feature scale
    target_dim = (800, 600)
    resized_before = cv2.resize(img_before, target_dim)
    resized_after = cv2.resize(img_after, target_dim)

    gray_before = cv2.cvtColor(resized_before, cv2.COLOR_BGR2GRAY)
    gray_after = cv2.cvtColor(resized_after, cv2.COLOR_BGR2GRAY)

    # Initialize ORB detector
    orb = cv2.ORB_create(nfeatures=1500, fastThreshold=12)
    kp1, des1 = orb.detectAndCompute(gray_before, None)
    kp2, des2 = orb.detectAndCompute(gray_after, None)

    inlier_ratio = 0.0
    num_inliers = 0
    num_good_matches = 0

    if des1 is not None and des2 is not None and len(des1) >= 10 and len(des2) >= 10:
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)
        try:
            matches = bf.knnMatch(des1, des2, k=2)
            good_matches = []
            for match_pair in matches:
                if len(match_pair) == 2:
                    m, n = match_pair
                    if m.distance < 0.75 * n.distance:
                        good_matches.append(m)

            num_good_matches = len(good_matches)

            if len(good_matches) >= 10:
                src_pts = np.float32([kp1[m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
                dst_pts = np.float32([kp2[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)

                _, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
                if mask is not None:
                    num_inliers = int(np.sum(mask))
                    inlier_ratio = float(num_inliers) / float(len(good_matches))
        except Exception:
            pass

    ssim_val = compute_ssim_approx(gray_before, gray_after)

    # Combined scene score (weighted blend of inlier homography consistency and baseline structural anchor)
    # If inliers are strong (>= 20 inliers or inlier_ratio >= 0.4), high confidence in same scene
    if num_inliers >= 30:
        scene_score = min(1.0, 0.75 + (inlier_ratio * 0.25))
    elif num_inliers >= 12:
        scene_score = 0.60 + (inlier_ratio * 0.30)
    else:
        # Fallback structural correlation
        scene_score = max(0.1, min(0.60, ssim_val))

    passed = (scene_score >= min_match_threshold)
    flags = []
    if not passed:
        flags.append(
            f"SCENE_MISMATCH: Scene match score {scene_score:.1%} below threshold ({min_match_threshold:.1%}). Background features do not align."
        )

    return {
        "passed": passed,
        "score": round(scene_score, 3),
        "scene_match_percentage": round(scene_score * 100.0, 1),
        "inliers_count": num_inliers,
        "good_matches_count": num_good_matches,
        "inlier_ratio": round(inlier_ratio, 3),
        "ssim_score": round(ssim_val, 3),
        "flags": flags
    }
