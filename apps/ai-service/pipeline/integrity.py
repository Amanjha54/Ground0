import hashlib
import io
import time
from typing import Dict, Any, List, Optional
from PIL import Image
import imagehash

def compute_sha256(data: bytes) -> str:
    """Computes the cryptographic SHA-256 hash of raw byte buffers."""
    hasher = hashlib.sha256()
    hasher.update(data)
    return hasher.hexdigest()

def compute_phash(data: bytes) -> str:
    """Computes 64-bit perceptual hash (pHash) for image structural fingerprinting."""
    try:
        image = Image.open(io.BytesIO(data))
        ph = imagehash.phash(image)
        return str(ph)
    except Exception:
        # Fallback if corrupted or not an image
        return "0000000000000000"

def hamming_distance(hash1: str, hash2: str) -> int:
    """Calculates the bitwise Hamming distance between two hex perceptual hashes."""
    try:
        h1 = imagehash.hex_to_hash(hash1)
        h2 = imagehash.hex_to_hash(hash2)
        return int(h1 - h2)
    except Exception:
        return 64

def verify_evidence_integrity(
    before_bytes: bytes,
    after_bytes: bytes,
    server_nonce: Optional[str] = None,
    nonce_issued_at: Optional[float] = None,
    max_nonce_age_seconds: int = 7200,
    historical_hashes: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Stage 1: Evidence Integrity Check.
    Validates SHA-256, pHash, replay attacks (Before == After), and historical reuse.
    """
    before_sha = compute_sha256(before_bytes)
    after_sha = compute_sha256(after_bytes)

    before_phash = compute_phash(before_bytes)
    after_phash = compute_phash(after_bytes)

    dist = hamming_distance(before_phash, after_phash)

    is_identical_sha = (before_sha == after_sha)
    is_replay_attack = is_identical_sha or (dist <= 4)

    is_historical_reused = False
    if historical_hashes:
        for hist_h in historical_hashes:
            if hamming_distance(after_phash, hist_h) <= 4:
                is_historical_reused = True
                break

    # Nonce validity check
    nonce_valid = True
    nonce_error = None
    if nonce_issued_at is not None:
        elapsed = time.time() - nonce_issued_at
        if elapsed > max_nonce_age_seconds:
            nonce_valid = False
            nonce_error = f"Nonce expired ({int(elapsed)}s > {max_nonce_age_seconds}s limit)"

    # Stage score: 1.0 if clean, 0.0 if replay/tampered
    integrity_score = 1.0
    passed = True
    flags = []

    if is_identical_sha:
        integrity_score = 0.0
        passed = False
        flags.append("IDENTICAL_FILE_REPLAY: After evidence is byte-for-byte identical to Before evidence.")
    elif is_replay_attack:
        integrity_score = 0.1
        passed = False
        flags.append(f"PERCEPTUAL_REPLAY_DETECTED: Hamming distance {dist} indicates reused image with minor edits.")

    if is_historical_reused:
        integrity_score = 0.1
        passed = False
        flags.append("HISTORICAL_DUPLICATE_REUSE: Evidence matches a previously completed work order.")

    if not nonce_valid:
        integrity_score = min(integrity_score, 0.4)
        flags.append(f"NONCE_EXPIRED: {nonce_error}")

    return {
        "passed": passed,
        "score": integrity_score,
        "before_sha256": before_sha,
        "after_sha256": after_sha,
        "before_phash": before_phash,
        "after_phash": after_phash,
        "phash_hamming_distance": dist,
        "is_replay_attack": is_replay_attack,
        "is_historical_reused": is_historical_reused,
        "nonce_valid": nonce_valid,
        "flags": flags
    }
