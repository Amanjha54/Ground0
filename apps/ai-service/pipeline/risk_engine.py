from typing import Dict, Any, List

def calculate_risk_and_recommendation(
    integrity_result: Dict[str, Any],
    location_result: Dict[str, Any],
    scene_result: Dict[str, Any],
    change_result: Dict[str, Any],
    requirement_result: Dict[str, Any],
    cctv_result: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Stage 7 & Stage 8: Risk Analysis & Recommendation Synthesis.
    Combines all pipeline stages to produce objective confidence metrics and recommendations.
    Never uses accusatory language (e.g. 'Fraudster' or 'Criminal').
    Uses objective terms: 'Evidence Conflict', 'Duplicate Evidence', 'Location Mismatch', 'Human Review Required'.
    """
    all_flags: List[Dict[str, Any]] = []

    # 1. Integrity Flags
    if not integrity_result.get("passed", False):
        for f in integrity_result.get("flags", []):
            all_flags.append({
                "flag_code": "DUPLICATE_EVIDENCE" if "REPLAY" in f else "INTEGRITY_CONFLICT",
                "severity": "CRITICAL",
                "description": f
            })

    # 2. Location Flags
    if not location_result.get("passed", False):
        for f in location_result.get("flags", []):
            all_flags.append({
                "flag_code": "LOCATION_MISMATCH",
                "severity": "HIGH",
                "description": f
            })

    # 3. Scene Flags
    if not scene_result.get("passed", False):
        for f in scene_result.get("flags", []):
            all_flags.append({
                "flag_code": "SCENE_MISMATCH",
                "severity": "HIGH",
                "description": f
            })

    # 4. Change Flags
    if not change_result.get("passed", False):
        for f in change_result.get("flags", []):
            all_flags.append({
                "flag_code": "INSUFFICIENT_EVIDENCE",
                "severity": "MEDIUM",
                "description": f
            })

    # Weighted confidence calculation
    # Weights: Integrity 0.25, Location 0.20, Scene Match 0.25, Change Detection 0.15, Requirement 0.15
    w_int = integrity_result.get("score", 0.0) * 0.25
    w_loc = location_result.get("score", 0.0) * 0.20
    w_scn = scene_result.get("score", 0.0) * 0.25
    w_chg = change_result.get("score", 0.0) * 0.15
    w_req = requirement_result.get("requirement_score", 0.90) * 0.15

    raw_conf = w_int + w_loc + w_scn + w_chg + w_req

    # Hard rules: If replay detected or scene mismatch, cap confidence severely
    if integrity_result.get("is_replay_attack", False):
        raw_conf = min(raw_conf, 0.15)
    if not scene_result.get("passed", False):
        raw_conf = min(raw_conf, 0.40)

    # Rule: Never display 100% certainty (cap at 0.98)
    overall_confidence = min(0.98, max(0.05, raw_conf))
    risk_score = 1.0 - overall_confidence

    # Determine risk level
    if risk_score <= 0.20:
        risk_level = "LOW"
    elif risk_score <= 0.40:
        risk_level = "MEDIUM"
    elif risk_score <= 0.65:
        risk_level = "HIGH"
    else:
        risk_level = "CRITICAL"

    # Determine AI recommendation
    if risk_level == "LOW" and overall_confidence >= 0.80:
        ai_recommendation = "READY_FOR_APPROVAL"
        summary = (
            f"Ground0 Verification: Location verified ({location_result.get('distance_meters', 0):.1f}m), "
            f"Scene Match {scene_result.get('scene_match_percentage', 0)}%, Fresh Evidence confirmed, "
            f"Physical Change {change_result.get('physical_change_percentage', 0)}%, Requirements satisfied. "
            f"Risk Level: LOW. Ready for human inspector sign-off."
        )
    elif risk_level in ["MEDIUM", "HIGH"]:
        ai_recommendation = "HUMAN_REVIEW_REQUIRED"
        summary = (
            f"Ground0 Verification: Human review required. Anomalies detected: "
            f"{', '.join([f['flag_code'] for f in all_flags])}. "
            f"Confidence: {overall_confidence:.1%}. Officer inspection recommended before authorization."
        )
    else:
        ai_recommendation = "EVIDENCE_CONFLICT"
        summary = (
            f"Ground0 Verification: Evidence conflict detected. "
            f"Severe mismatch or duplicate replay signature found. "
            f"Submission rejected pending field re-inspection."
        )

    return {
        "overall_confidence": round(overall_confidence, 3),
        "risk_score": round(risk_score, 3),
        "risk_level": risk_level,
        "ai_recommendation": ai_recommendation,
        "explanation_summary": summary,
        "risk_flags": all_flags
    }
