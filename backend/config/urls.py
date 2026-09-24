from django.urls import include, path


urlpatterns = [
    path("", include("interviewai.urls")),
    path("api/", include("interviewai.urls")),
]