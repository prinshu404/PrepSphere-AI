from django.contrib import admin
from .models import (
    Interview,
    Question,
    InterviewQuestion,
    InterviewAnswer,
    LoginHistory,
)


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
        "user__username",
        "user__email",
    )

    ordering = (
        "-created_at",
    )


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "question_text",
        "category",
        "difficulty",
        "correct_option",
        "is_active",
        "created_at",
    )

    list_filter = (
        "category",
        "difficulty",
        "is_active",
    )

    search_fields = (
        "question_text",
        "category",
    )

    ordering = (
        "-created_at",
    )


@admin.register(InterviewQuestion)
class InterviewQuestionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "interview",
        "question",
        "question_number",
    )

    list_filter = (
        "question__category",
        "question__difficulty",
    )

    search_fields = (
        "interview__title",
        "question__question_text",
    )

    ordering = (
        "interview",
        "question_number",
    )


@admin.register(InterviewAnswer)
class InterviewAnswerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "interview_question",
        "selected_option",
        "is_correct",
        "marks",
        "answered_at",
    )

    list_filter = (
        "is_correct",
        "answered_at",
    )

    search_fields = (
        "interview_question__interview__title",
        "interview_question__question__question_text",
    )

    ordering = (
        "-answered_at",
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