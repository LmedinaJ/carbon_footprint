"""
Export Supabase carbon footprint data to CSV for Google Sheets import.

Usage:
    python export_to_csv.py

Outputs:
    carbon_footprint_export.csv
"""

import csv
import json
import os
import urllib.request

# Load from .env.local
SUPABASE_URL = ""
SUPABASE_KEY = ""

env_path = os.path.join(os.path.dirname(__file__), ".env.local")
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if line.startswith("NEXT_PUBLIC_SUPABASE_URL="):
            SUPABASE_URL = line.split("=", 1)[1]
        elif line.startswith("NEXT_PUBLIC_SUPABASE_ANON_KEY="):
            SUPABASE_KEY = line.split("=", 1)[1]

if not SUPABASE_URL or not SUPABASE_KEY:
    raise SystemExit("Error: Could not read Supabase credentials from .env.local")


def fetch_table(table: str, query: str = "") -> list:
    """Fetch all rows from a Supabase table."""
    url = f"{SUPABASE_URL}/rest/v1/{table}?select=*{query}"
    req = urllib.request.Request(
        url,
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
        },
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())


def main():
    print("Fetching data from Supabase...")

    submissions = fetch_table("submissions", "&order=created_at.asc")
    categories = fetch_table("submission_categories")
    answers = fetch_table("submission_answers")

    print(f"  {len(submissions)} submissions")
    print(f"  {len(categories)} category rows")
    print(f"  {len(answers)} answer rows")

    if not submissions:
        print("No submissions found. Nothing to export.")
        return

    # Index categories by submission_id
    cat_by_sub = {}
    for c in categories:
        cat_by_sub.setdefault(c["submission_id"], {})[c["category"]] = c["co2_kg"]

    # Collect all category names
    all_categories = sorted({c["category"] for c in categories})

    # Index answers by submission_id
    ans_by_sub = {}
    for a in answers:
        ans_by_sub.setdefault(a["submission_id"], {})[a["question_id"]] = a["answer_value"]

    # Collect all question IDs
    all_questions = sorted({a["question_id"] for a in answers})

    # Build CSV
    header = (
        ["session_id", "student_name", "student_email", "total_co2_kg", "created_at"]
        + [f"category_{cat}_kg" for cat in all_categories]
        + [f"q_{qid}" for qid in all_questions]
    )

    output_file = os.path.join(os.path.dirname(__file__), "exports", "carbon_footprint_export.csv")
    with open(output_file, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(header)

        for sub in submissions:
            sid = sub["id"]
            row = [
                sub["session_id"],
                sub.get("student_name", ""),
                sub.get("student_email", ""),
                sub["total_co2_kg"],
                sub["created_at"],
            ]
            # Category columns
            sub_cats = cat_by_sub.get(sid, {})
            row += [sub_cats.get(cat, 0) for cat in all_categories]

            # Answer columns
            sub_ans = ans_by_sub.get(sid, {})
            row += [sub_ans.get(qid, "") for qid in all_questions]

            writer.writerow(row)

    print(f"\nExported to: {output_file}")
    print("You can import this CSV into Google Sheets via File > Import.")


if __name__ == "__main__":
    main()
