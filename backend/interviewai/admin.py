from django.contrib import admin
from .models import Interview, LoginHistory


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "interview_type",
        "status",
        "score",
        "created_at",
    )

    list_filter = (
        "interview_type",
        "status",
    )

    search_fields = (
        "title",
    )

    ordering = (
        "-created_at",
    )


@admin.register(LoginHistory)
class LoginHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "email",
        "user",
        "success",
        "created_at",
    )

    list_filter = (
        "success",
        "created_at",
    )

    search_fields = (
        "email",
    )

    ordering = (
        "-created_at",
    )