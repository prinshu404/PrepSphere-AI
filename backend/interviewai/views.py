from .models import Interview, LoginHistory
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response


def get_demo_user(request):
    authorization = request.headers.get("Authorization", "")

    if not authorization.startswith("Bearer "):
        return None

    token = authorization.replace("Bearer ", "", 1)

    prefix = "prepsphere-demo-token-"

    if not token.startswith(prefix):
        return None

    user_id = token.replace(prefix, "", 1)

    try:
        return User.objects.get(
            id=int(user_id),
            is_active=True,
        )
    except (User.DoesNotExist, ValueError):
        return None


@api_view(["GET"])
def home(request):
    total_students = User.objects.filter(is_active=True).count()

    return Response({
        "platform": {
            "name": "PrepSphere AI",
            "tagline": "Prepare smarter. Perform better.",
            "description": (
                "AI-powered interview and placement preparation "
                "for students."
            ),
        },
        "stats": {
            "students": total_students,
            "interviews": Interview.objects.count(),
            "questions": 0,
            "reports": 0,
        },
        "features": [
            {
                "title": "AI Mock Interviews",
                "description": (
                    "Practice interview questions and improve "
                    "your confidence with guided AI feedback."
                ),
            },
            {
                "title": "Resume Analyzer",
                "description": (
                    "Find gaps in your resume and get practical "
                    "suggestions to make it stronger."
                ),
            },
            {
                "title": "Coding Practice",
                "description": (
                    "Practice coding problems based on common "
                    "technical interview patterns."
                ),
            },
            {
                "title": "Performance Reports",
                "description": (
                    "Track your preparation and understand "
                    "where you need more practice."
                ),
            },
            {
                "title": "Career Roadmap",
                "description": (
                    "Follow a structured preparation path based "
                    "on your skills and career goals."
                ),
            },
            {
                "title": "Company Preparation",
                "description": (
                    "Prepare with company-focused topics and "
                    "common interview patterns."
                ),
            },
        ],
    })


@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({
            "message": "Email and password are required."
        }, status=400)

    user = authenticate(username=email, password=password)

    if user is None:
        LoginHistory.objects.create(
            email=email,
            success=False,
        )

        return Response({
            "message": "Invalid email or password."
        }, status=401)

    LoginHistory.objects.create(
        user=user,
        email=email,
        success=True,
    )

    return Response({
        "token": f"prepsphere-demo-token-{user.id}",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.first_name,
        }
    })


@api_view(["POST"])
def register(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not name or not email or not password:
        return Response({
            "message": "Name, email and password are required."
        }, status=400)

    if User.objects.filter(username=email).exists():
        return Response({
            "message": "An account with this email already exists."
        }, status=400)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name,
    )

    return Response({
        "token": f"prepsphere-demo-token-{user.id}",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.first_name,
        }
    }, status=201)


@api_view(["GET"])
def dashboard(request):
    total_students = User.objects.filter(is_active=True).count()
    total_logins = LoginHistory.objects.filter(success=True).count()
    failed_logins = LoginHistory.objects.filter(success=False).count()

    return Response({
        "message": "Welcome to PrepSphere AI!",
        "stats": {
            "students": total_students,
            "logins": total_logins,
            "failed_logins": failed_logins,
            "interviews": Interview.objects.count(),
            "completed": Interview.objects.filter(
                status="Completed"
            ).count(),
            "reports": 0,
        }
    })


@api_view(["GET", "POST"])
def interviews(request):
    user = get_demo_user(request)

    if user is None:
        return Response({
            "message": "Please log in again to continue."
        }, status=401)

    if request.method == "GET":
        interviews = Interview.objects.filter(
            user=user
        ).order_by("-created_at")

        data = []

        for interview in interviews:
            data.append({
                "id": interview.id,
                "title": interview.title,
                "interview_type": interview.interview_type,
                "status": interview.status,
                "score": interview.score,
                "created_at": interview.created_at,
            })

        return Response(data)

    title = request.data.get("title")
    interview_type = request.data.get(
        "interview_type",
        "Technical"
    )

    if not title:
        return Response({
            "message": "Interview title is required."
        }, status=400)

    interview = Interview.objects.create(
        user=user,
        title=title,
        interview_type=interview_type,
    )

    return Response({
        "id": interview.id,
        "title": interview.title,
        "interview_type": interview.interview_type,
        "status": interview.status,
        "score": interview.score,
        "created_at": interview.created_at,
    }, status=201)