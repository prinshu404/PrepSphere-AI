from django.db import models
from django.utils import timezone


class User(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True, db_index=True)
    password = models.CharField(max_length=255)
    college = models.CharField(max_length=255, blank=True, default="")
    branch = models.CharField(max_length=255, blank=True, default="")
    technical = models.PositiveSmallIntegerField(default=0)
    communication = models.PositiveSmallIntegerField(default=0)
    problem_solving = models.PositiveSmallIntegerField(default=0)
    confidence = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users"

    @property
    def skills(self):
        return {
            "technical": self.technical,
            "communication": self.communication,
            "problemSolving": self.problem_solving,
            "confidence": self.confidence,
        }


class Interview(models.Model):
    STATUS_CHOICES = [("Completed", "Completed"), ("Scheduled", "Scheduled"), ("In Progress", "In Progress")]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="interviews")
    role = models.CharField(max_length=255, default="Mock Interview")
    company = models.CharField(max_length=255, default="General Practice")
    type = models.CharField(max_length=100, default="Mock Interview")
    score = models.PositiveSmallIntegerField(default=0)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Completed")
    duration = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "interviews"
        ordering = ["-completed_at"]


class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reports")
    interview = models.ForeignKey(Interview, on_delete=models.SET_NULL, null=True, blank=True, related_name="reports")
    overall_score = models.PositiveSmallIntegerField(default=0)
    technical = models.PositiveSmallIntegerField(default=0)
    communication = models.PositiveSmallIntegerField(default=0)
    problem_solving = models.PositiveSmallIntegerField(default=0)
    confidence = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reports"
        ordering = ["-created_at"]
