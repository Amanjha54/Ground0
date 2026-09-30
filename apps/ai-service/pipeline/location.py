import math
from typing import Dict, Any, List

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes great-circle distance between two GPS coordinates using Haversine formula.
    Returns distance in meters.
    """
    R = 6371000.0 # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    return R * c

def verify_location(
    captured_lat: float,
    captured_lon: float,
    expected_lat: float,
    expected_lon: float,
    max_geofence_meters: float = 50.0
) -> Dict[str, Any]:
    """
    Stage 2: Location Verification.
    Validates that the evidence capture occurred physically within the work order geofence.
    """
    distance = haversine_distance_meters(captured_lat, captured_lon, expected_lat, expected_lon)

    flags: List[str] = []
    if distance <= max_geofence_meters:
        score = 1.0 - (0.3 * (distance / max_geofence_meters))
        passed = True
    else:
        # Distance exceeded allowable geofence radius
        excess = distance - max_geofence_meters
        score = max(0.0, 1.0 - (excess / 100.0))
        passed = False
        flags.append(
            f"GEOFENCE_DRIFT: Captured {distance:.1f}m away from work site (limit: {max_geofence_meters}m)."
        )

    return {
        "passed": passed,
        "score": round(score, 3),
        "distance_meters": round(distance, 2),
        "geofence_limit_meters": max_geofence_meters,
        "captured_coords": {"lat": captured_lat, "lon": captured_lon},
        "expected_coords": {"lat": expected_lat, "lon": expected_lon},
        "flags": flags
    }
