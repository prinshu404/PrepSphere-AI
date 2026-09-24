from django.urls import path
from .views import home, login, register, dashboard, interviews


urlpatterns = [
    path("", home),
    path("auth/login", login),
    path("auth/register", register),
    path("dashboard", dashboard),
    path("interviews", interviews),
]