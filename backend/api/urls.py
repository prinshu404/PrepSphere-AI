from django.http import JsonResponse
from django.urls import path

from . import views


def health(request):
    from django.db import connection

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

        return JsonResponse({
            "ok": True,
            "database": "connected",
        })

    except Exception:
        return JsonResponse({
            "ok": False,
            "database": "disconnected",
        }, status=503)


urlpatterns = [
    path("health", health),

    path("auth/register", views.register),
    path("auth/login", views.login),

    path("dashboard", views.dashboard),
    path("interviews", views.interviews),
    path("reports", views.reports),

    path("resume/analyze", views.resume_analyze),

    path("coding", lambda request: views.placeholder(request, "coding")),
    path("company", lambda request: views.placeholder(request, "company")),
    path("roadmap", lambda request: views.placeholder(request, "roadmap")),
    path("users", lambda request: views.placeholder(request, "users")),
]