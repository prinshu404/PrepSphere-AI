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
    score = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    CATEGORY_CHOICES = [
        ("Technical", "Technical"),
        ("Aptitude", "Aptitude"),
        ("HR", "HR"),
        ("Coding", "Coding"),
        ("Database", "Database"),
        ("Web Development", "Web Development"),
        ("Python", "Python"),
        ("Java", "Java"),
        ("JavaScript", "JavaScript"),
        ("Other", "Other"),
    ]

    DIFFICULTY_CHOICES = [
        ("Easy", "Easy"),
        ("Medium", "Medium"),
        ("Hard", "Hard"),
    ]

    question_text = models.TextField()
    category = models.CharField(
        max_length=100,
        choices=CATEGORY_CHOICES,
        default="Technical",
    )
    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default="Medium",
    )

    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)

    correct_option = models.CharField(
        max_length=1,
        choices=[
            ("A", "A"),
            ("B", "B"),
            ("C", "C"),
            ("D", "D"),
        ],
    )

    explanation = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question_text[:100]


class InterviewQuestion(models.Model):
    interview = models.ForeignKey(
        Interview,
        on_delete=models.CASCADE,
        related_name="questions",
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="interview_questions",
    )
    question_number = models.PositiveIntegerField()

    class Meta:
        ordering = ["question_number"]
        unique_together = [
            ("interview", "question"),
            ("interview", "question_number"),
        ]

    def __str__(self):
        return (
            f"{self.interview.title} - "
            f"Question {self.question_number}"
        )


class InterviewAnswer(models.Model):
    interview_question = models.ForeignKey(
        InterviewQuestion,
        on_delete=models.CASCADE,
        related_name="answers",
    )
    selected_option = models.CharField(
        max_length=1,
        blank=True,
        default="",
    )
    is_correct = models.BooleanField(default=False)
    marks = models.FloatField(default=0)

    answered_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"Answer - "
            f"{self.interview_question.interview.title} - "
            f"Q{self.interview_question.question_number}"
        )


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