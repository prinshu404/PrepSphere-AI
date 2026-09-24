import json
from datetime import datetime, timedelta, timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from .models import User, Interview, Report
from .auth import auth_required
from .utils import create_token, hash_password, verify_password, user_json

def parse_body(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}

def average(values):
    nums = [float(v or 0) for v in values]
    return round(sum(nums) / len(nums)) if nums else 0

def percent_change(current, previous):
    if not previous:
        return 100 if current else 0
    return round(((current - previous) / previous) * 1000) / 10

def dt(value):
    return value.isoformat() if value else None

@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed."}, status=405)
    data = parse_body(request)
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    college = str(data.get("college", "")).strip()
    branch = str(data.get("branch", "")).strip()
    if not name or not email or not password:
        return JsonResponse({"message": "Name, email and password are required."}, status=400)
    if len(password) < 6:
        return JsonResponse({"message": "Password must contain at least 6 characters."}, status=400)
    if User.objects.filter(email=email).first():
        return JsonResponse({"message": "An account with this email already exists."}, status=409)
    try:
        user = User.objects.create(name=name, email=email, password=hash_password(password),
                    college=college, branch=branch)
        return JsonResponse({"token": create_token(user.id), "user": user_json(user)}, status=201)
    except Exception:
        return JsonResponse({"message": "Unable to create account."}, status=500)

@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed."}, status=405)
    data = parse_body(request)
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    if not email or not password:
        return JsonResponse({"message": "Email and password are required."}, status=400)
    user = User.objects.filter(email=email).first()
    if not user or not verify_password(password, user.password):
        return JsonResponse({"message": "Invalid email or password."}, status=401)
    return JsonResponse({"token": create_token(user.id), "user": user_json(user)})

@auth_required
def dashboard(request):
    user = request.user
    interviews = list(Interview.objects.filter(user=user).order_by("-completed_at"))
    reports = list(Report.objects.filter(user=user).order_by("-created_at"))
    completed = [x for x in interviews if x.status == "Completed"]
    report_scores = [x.overall_score for x in reports if x.overall_score is not None]
    overall_score = report_scores[0] if report_scores else average([x.score for x in completed])
    skills = {
        "technical": int((user.skills or {}).get("technical", 0) or 0),
        "communication": int((user.skills or {}).get("communication", 0) or 0),
        "problemSolving": int((user.skills or {}).get("problemSolving", 0) or 0),
        "confidence": int((user.skills or {}).get("confidence", 0) or 0),
    }
    readiness = average(list(skills.values()))
    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)
    two_weeks_ago = now - timedelta(days=14)
    def aware(d):
        return d.replace(tzinfo=timezone.utc) if d and d.tzinfo is None else d
    this_week = [x for x in completed if aware(x.completed_at) >= week_ago]
    previous_week = [x for x in completed if two_weeks_ago <= aware(x.completed_at) < week_ago]
    performance_change = percent_change(average([x.score for x in this_week]), average([x.score for x in previous_week]))
    performance = []
    for index in range(7):
        date = (now - timedelta(days=6-index)).date()
        day_items = [x for x in completed if aware(x.completed_at).date() == date]
        performance.append({"day": date.strftime("%a"), "score": average([x.score for x in day_items])})
    current_month = now.date().replace(day=1)
    previous_month = (current_month - timedelta(days=1)).replace(day=1)
    interviews_this_month = sum(1 for x in completed if aware(x.completed_at).date() >= current_month)
    interviews_last_month = sum(1 for x in completed if previous_month <= aware(x.completed_at).date() < current_month)
    lowest = min(skills.items(), key=lambda item: item[1]) if skills else None
    labels = {
        "technical": "technical answers",
        "communication": "communication confidence",
        "problemSolving": "problem solving",
        "confidence": "interview confidence",
    }
    if lowest and lowest[1] < 90:
        recommendations = [
            {"id": 1, "title": f"Practice {labels[lowest[0]]}",
             "description": f"Your current score is {lowest[1]}%. Focus on this area in your next mock interview.", "type": lowest[0]},
            {"id": 2, "title": "Review your latest report",
             "description": "Use AI feedback to turn weak areas into focused practice tasks.", "type": "insights"},
            {"id": 3, "title": "Build consistency",
             "description": "Complete two more mock interviews this week to track improvement.", "type": "consistency"},
        ]
    else:
        recommendations = [{"id": 1, "title": "Maintain your momentum",
            "description": "Your skill scores are strong. Keep practicing to stay interview-ready.", "type": "momentum"}]
    improved = set()
    report_fields = {
        "technical": "technical",
        "communication": "communication",
        "problemSolving": "problem_solving",
        "confidence": "confidence",
    }
    for report in reports:
        for key, field in report_fields.items():
            if getattr(report, field, 0) > skills[key]:
                improved.add(key)
    recent = [{
        "id": str(x.id), "role": x.role, "company": x.company, "type": x.type,
        "score": x.score, "status": x.status, "completedAt": dt(x.completed_at)
    } for x in completed[:5]]
    return JsonResponse({
        "user": user_json(user),
        "stats": {"overallScore": overall_score, "interviewsCompleted": len(completed),
                  "skillsImproved": len(improved), "readiness": readiness,
                  "interviewsThisMonth": interviews_this_month,
                  "interviewsLastMonth": interviews_last_month,
                  "performanceChange": performance_change},
        "skills": skills, "performance": performance,
        "recentInterviews": recent, "recommendations": recommendations,
    })

@csrf_exempt
@auth_required
def interviews(request):
    if request.method == "GET":
        items = Interview.objects.filter(user=request.user).order_by("-completed_at")
        return JsonResponse([{"id": str(x.id), "role": x.role, "company": x.company, "type": x.type,
                             "score": x.score, "status": x.status, "duration": x.duration,
                             "completedAt": dt(x.completed_at)} for x in items], safe=False)
    if request.method == "POST":
        data = parse_body(request)
        item = Interview(user=request.user, role=data.get("role") or "Mock Interview",
                         company=data.get("company") or "General Practice",
                         type=data.get("type") or "Mock Interview",
                         score=int(data.get("score", 0) or 0), status=data.get("status") or "Completed",
                         duration=int(data.get("duration", 0) or 0))
        item.save()
        return JsonResponse({"id": str(item.id), "message": "Interview created."}, status=201)
    return JsonResponse({"message": "Method not allowed."}, status=405)

@auth_required
def reports(request):
    if request.method != "GET":
        return JsonResponse({"message": "Method not allowed."}, status=405)
    items = Report.objects.filter(user=request.user).order_by("-created_at")
    return JsonResponse([{"id": str(x.id), "interview": str(x.interview.id) if x.interview else None,
                          "overallScore": x.overall_score, "technical": x.technical,
                          "communication": x.communication, "problemSolving": x.problem_solving,
                          "confidence": x.confidence, "createdAt": dt(x.created_at)} for x in items], safe=False)

@csrf_exempt
@auth_required
def resume_analyze(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed."}, status=405)
    return JsonResponse({"message": "Resume analysis endpoint ready.", "status": "ready"})

@auth_required
def placeholder(request, module):
    return JsonResponse({"message": f"{module} endpoint ready"})
