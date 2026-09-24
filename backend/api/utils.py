from datetime import datetime, timedelta, timezone
import jwt
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password


def create_token(user_id):
    now = datetime.now(timezone.utc)
    payload = {
        "userId": str(user_id),
        "iat": now,
        "exp": now + timedelta(days=settings.JWT_EXPIRES_DAYS),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def hash_password(password):
    return make_password(password)


def verify_password(password, hashed):
    return check_password(password, hashed)


def user_json(user):
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "college": user.college,
        "branch": user.branch,
    }
