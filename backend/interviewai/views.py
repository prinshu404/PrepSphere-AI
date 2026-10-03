```python
@api_view(["POST"])
def submit_interview(request, interview_id):
    user = get_demo_user(request)

    if user is None:
        return Response({
            "message": "Please log in again to continue."
        }, status=401)

    try:
        interview = Interview.objects.get(
            id=int(interview_id),
            user=user,
        )
    except (Interview.DoesNotExist, ValueError):
        return Response({
            "message": "Interview not found."
        }, status=404)

    if interview.status == "Completed":
        return Response({
            "message": "This interview has already been submitted."
        }, status=400)

    submitted_answers = request.data.get("answers")

    if not isinstance(submitted_answers, dict):
        return Response({
            "message": "Invalid answer data."
        }, status=400)

    interview_questions = list(
        InterviewQuestion.objects
        .filter(interview=interview)
        .select_related("question")
        .order_by("question_number")
    )

    if not interview_questions:
        return Response({
            "message": "No questions found for this interview."
        }, status=400)

    correct_count = 0
    wrong_count = 0
    unanswered_count = 0
    total_score = 0
    analysis = []

    try:
        with transaction.atomic():

            InterviewAnswer.objects.filter(
                interview_question__interview=interview
            ).delete()

            for interview_question in interview_questions:
                question = interview_question.question

                question_number = str(
                    interview_question.question_number
                )

                selected_option = submitted_answers.get(
                    question_number,
                    "",
                )

                if selected_option is None:
                    selected_option = ""

                selected_option = str(
                    selected_option
                ).strip().upper()

                if selected_option not in {
                    "",
                    "A",
                    "B",
                    "C",
                    "D",
                }:
                    selected_option = ""

                if selected_option == "":
                    is_correct = False
                    marks = 0
                    unanswered_count += 1

                elif selected_option == question.correct_option:
                    is_correct = True
                    marks = 1
                    correct_count += 1
                    total_score += 1

                else:
                    is_correct = False
                    marks = -0.5
                    wrong_count += 1
                    total_score -= 0.5

                InterviewAnswer.objects.create(
                    interview_question=interview_question,
                    selected_option=selected_option,
                    is_correct=is_correct,
                    marks=marks,
                )

                selected_text = ""

                if selected_option == "A":
                    selected_text = question.option_a
                elif selected_option == "B":
                    selected_text = question.option_b
                elif selected_option == "C":
                    selected_text = question.option_c
                elif selected_option == "D":
                    selected_text = question.option_d

                correct_text = ""

                if question.correct_option == "A":
                    correct_text = question.option_a
                elif question.correct_option == "B":
                    correct_text = question.option_b
                elif question.correct_option == "C":
                    correct_text = question.option_c
                elif question.correct_option == "D":
                    correct_text = question.option_d

                analysis.append({
                    "question_number": (
                        interview_question.question_number
                    ),
                    "question": question.question_text,
                    "selected_option": selected_option,
                    "selected_answer": selected_text,
                    "correct_option": question.correct_option,
                    "correct_answer": correct_text,
                    "is_correct": is_correct,
                    "marks": marks,
                    "explanation": question.explanation,
                })

            total_questions = len(interview_questions)

            percentage = (
                round(
                    (total_score / total_questions) * 100,
                    2,
                )
                if total_questions > 0
                else 0
            )

            interview.score = total_score
            interview.status = "Completed"

            interview.save(
                update_fields=[
                    "score",
                    "status",
                ]
            )

    except Exception as exc:
        print("INTERVIEW SUBMIT ERROR:", repr(exc))

        return Response({
            "message": (
                "Unable to save the interview result. "
                "Please make sure the database is up to date."
            ),
            "error": str(exc),
        }, status=500)

    return Response({
        "message": "Interview submitted successfully.",
        "interview_id": interview.id,
        "score": total_score,
        "percentage": percentage,
        "total_questions": len(interview_questions),
        "correct": correct_count,
        "wrong": wrong_count,
        "unanswered": unanswered_count,
        "analysis": analysis,
    })

