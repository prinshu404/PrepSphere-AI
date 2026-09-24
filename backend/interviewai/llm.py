import json
import os

from dotenv import load_dotenv
from google import genai


load_dotenv(
    os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        ".env",
    ),
    override=True,
)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not configured.")

client = genai.Client(api_key=api_key)


def generate_mcq_questions(
    interview_type,
    subject,
    difficulty="Medium",
    count=50,
    previous_questions=None,
):
    previous_questions = previous_questions or []

    previous_text = "\n".join(
        f"- {question}"
        for question in previous_questions[:100]
    )

    prompt = f"""
Generate exactly {count} multiple-choice questions for a mock interview/test.

Interview type: {interview_type}
Subject: {subject}
Difficulty: {difficulty}

Requirements:
- Generate exactly {count} questions.
- Every question must have exactly 4 options.
- Options must be labeled A, B, C, and D.
- Exactly one option must be correct.
- Questions must be relevant to the selected subject.
- Questions should be clear and unambiguous.
- Do not generate duplicate questions.
- Do not generate questions very similar to the previous questions.
- Do not include explanations outside the JSON.
- Return only valid JSON.
- Use English only.

Previous questions from this user's history are listed below.
Avoid repeating these questions:

{previous_text}

Return this exact JSON structure:

{{
    "questions": [
        {{
            "question": "Question text",
            "option_a": "Option A",
            "option_b": "Option B",
            "option_c": "Option C",
            "option_d": "Option D",
            "correct_option": "A",
            "explanation": "Short explanation"
        }}
    ]
}}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",,
        contents=prompt,
    )

    output_text = response.text.strip()

    if output_text.startswith("```"):
        output_text = output_text.replace("```json", "", 1)
        output_text = output_text.replace("```", "", 1)
        output_text = output_text.strip()

    try:
        data = json.loads(output_text)
    except json.JSONDecodeError as exc:
        raise ValueError(
            "The AI returned an invalid question format."
        ) from exc

    questions = data.get("questions")

    if not isinstance(questions, list):
        raise ValueError(
            "The AI response does not contain a valid question list."
        )

    if len(questions) != count:
        raise ValueError(
            f"Expected {count} questions, but received {len(questions)}."
        )

    validated_questions = []

    for item in questions:
        required_fields = [
            "question",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
            "correct_option",
        ]

        if not all(field in item for field in required_fields):
            raise ValueError(
                "One or more generated questions are missing required fields."
            )

        correct_option = str(item["correct_option"]).upper()

        if correct_option not in {"A", "B", "C", "D"}:
            raise ValueError(
                "A generated question contains an invalid correct option."
            )

        validated_questions.append(
            {
                "question": str(item["question"]).strip(),
                "option_a": str(item["option_a"]).strip(),
                "option_b": str(item["option_b"]).strip(),
                "option_c": str(item["option_c"]).strip(),
                "option_d": str(item["option_d"]).strip(),
                "correct_option": correct_option,
                "explanation": str(
                    item.get("explanation", "")
                ).strip(),
            }
        )

    return validated_questions