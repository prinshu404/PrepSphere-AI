from django.urls import include, path

from .views import home, login, register, dashboard, interviews


urlpatterns = [
    # Main application routes
    path("", home),
    path("auth/login", login),
    path("auth/register", register),
    path("dashboard", dashboard),
    path("interviews", interviews),

    # All PrepSphere AI API routes
    path("api/", include("interviewai.urls")),
]