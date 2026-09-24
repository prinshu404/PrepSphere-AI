from django.db import models
from django.contrib.auth.models import User


class Interview(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="interviews"
    )
    title = models.CharField(max_length=200)
    interview_type = models.CharField(max_length=100, default="Technical")
    status = models.CharField(max_length=50, default="Pending")
    score = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class LoginHistory(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="login_history"
    )
    email = models.EmailField()
    success = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = "Success" if self.success else "Failed"
        return f"{self.email} - {status}"