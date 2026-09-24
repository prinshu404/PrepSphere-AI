from functools import wraps
import jwt
from django.conf import settings
from django.http import JsonResponse
from .models import User


def auth_required(view):
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return JsonResponse({"message": "Authentication required."}, status=401)
        token = header.split(" ", 1)[1].strip()
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
            user = User.objects.get(pk=int(payload["userId"]))
            request.user = user
            request.user_id = user.id
            return view(request, *args, **kwargs)
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, ValueError, User.DoesNotExist, KeyError, TypeError):
            return JsonResponse({"message": "Invalid or expired token."}, status=401)
    return wrapped
