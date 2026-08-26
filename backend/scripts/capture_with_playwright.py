import subprocess
import time

routes = [
    ("http://localhost:3000", "screen_home.png"),
    ("http://localhost:3000/learning/pyqs", "screen_pyqs.png"),
    ("http://localhost:3000/learning/quizzes", "screen_quizzes.png"),
    ("http://localhost:3000/learning/theory", "screen_theory.png"),
    ("http://localhost:3000/learning/lectures", "screen_lectures.png"),
    ("http://localhost:3000/upload", "screen_ai_grader.png"),
    ("http://localhost:3000/forum", "screen_forum.png"),
    ("http://localhost:3000/about", "screen_about.png"),
]

for url, out in routes:
    print(f"Capturing {url} -> {out}...")
    subprocess.run(
        f'npx playwright screenshot --wait-for-timeout=2000 --viewport-size="1280,800" {url} {out}',
        shell=True
    )

print("All screenshots captured!")
