import os
import jwt
from typing import Dict, Optional


def verify_token(token: str) -> Dict:
    """
    Verify a JWT token and return the payload.
    """
    try:
        secret = os.getenv("JWT_SECRET")
        if not secret:
            raise ValueError("JWT_SECRET not configured")

        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")

