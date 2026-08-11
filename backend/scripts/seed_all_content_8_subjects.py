import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "e_learning_project.settings")
django.setup()

from core.models import Category, Lecture, Article, PYQ, Quiz, QuizQuestion, QuizOption

OFFICIAL_SUBJECTS = [
    {
        "name": "LINEAR ALGEBRA",
        "description": "Matrices, vector spaces, eigenvalues, eigenvectors, SVD, and linear transformations.",
        "lectures": [
            {
                "title": "Eigenvalues, Eigenvectors & Characteristic Equations",
                "description": "Comprehensive tutorial on matrix diagonalizability, trace, determinant, and spectral decomposition.",
                "video_url": "https://www.youtube.com/watch?v=PFDu9oVAE-g",
                "order": 1
            },
            {
                "title": "Matrix Rank & Systems of Linear Equations",
                "description": "Row reduction, echelon forms, homogeneous and non-homogeneous system solving.",
                "video_url": "https://www.youtube.com/watch?v=uQhTuRlWMXY",
                "order": 2
            }
        ],
        "articles": [
            {
                "title": "Eigenvalues & Eigenvectors: Comprehensive Guide",
                "summary": "Master characteristic polynomials, trace properties, and diagonalizability.",
                "content": "# Eigenvalues & Eigenvectors\n\nFor a matrix $A \\in \\mathbb{R}^{n \\times n}$, an eigenvector $v$ and eigenvalue $\\lambda$ satisfy:\n$$Av = \\lambda v$$\n\n### Key Properties:\n- **Trace**: $\\sum \\lambda_i = \\text{Trace}(A)$\n- **Determinant**: $\\prod \\lambda_i = \\det(A)$\n- **Symmetric Matrix**: Real symmetric matrices always have real eigenvalues."
            }
        ],
        "pyqs": [
            {
                "year": 2024,
                "is_pyq": True,
                "question_text": "Let A be a 3x3 matrix with eigenvalues lambda_1 = 1, lambda_2 = 2, and lambda_3 = -3. Find the determinant of matrix A^2 + 2I.",
                "option_a": "198",
                "option_b": "108",
                "option_c": "64",
                "option_d": "32",
                "correct_option": "A",
                "answer_text": "Eigenvalues of A^2 + 2I are 1^2+2=3, 2^2+2=6, (-3)^2+2=11. Product = 3 * 6 * 11 = 198."
            }
        ],
        "quizzes": [
            {
                "title": "Linear Algebra Diagnostic Quiz",
                "description": "Test your mastery of matrix rank, determinants, and eigenvalues.",
                "questions": [
                    {
                        "question_text": "If A is an n x n orthogonal matrix, what is det(A)?",
                        "explanation": "Since A^T * A = I, det(A^T) * det(A) = det(I) => det(A)^2 = 1 => det(A) = +/- 1.",
                        "options": [
                            {"option_text": "+1 or -1", "is_correct": True},
                            {"option_text": "0", "is_correct": False},
                            {"option_text": "n", "is_correct": False},
                            {"option_text": "Infinity", "is_correct": False}
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "PROBABILITY",
        "description": "Random variables, Bayes theorem, probability distributions, expectation, and variance.",
        "lectures": [
            {
                "title": "Bayes' Theorem & Conditional Probability",
                "description": "Prior, likelihood, and posterior probability calculations for machine learning and exams.",
                "video_url": "https://www.youtube.com/watch?v=HZGCoVF3YvM",
                "order": 1
            },
            {
                "title": "Continuous Distributions: Gaussian & Exponential",
                "description": "Probability density functions, cumulative distribution functions, expectations.",
                "video_url": "https://www.youtube.com/watch?v=rC_E0bC5aXg",
                "order": 2
            }
        ],
        "articles": [
            {
                "title": "Probability Distributions & Bayes Theorem",
                "summary": "Core probability theory, discrete vs continuous random variables.",
                "content": "# Probability Theory\n\nBayes' Theorem formulation:\n$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$\n\n### Expectation & Variance:\n- $E[X] = \\sum x \\cdot P(X=x)$\n- $Var(X) = E[X^2] - (E[X])^2$"
            }
        ],
        "pyqs": [
            {
                "year": 2024,
                "is_pyq": True,
                "question_text": "Two fair 6-sided dice are rolled simultaneously. What is the conditional probability that the sum of the numbers is 8, given that the sum is an even number?",
                "answer_text": "Sum is even (18 outcomes). Sum=8 (5 outcomes). P = 5/18."
            }
        ],
        "quizzes": [
            {
                "title": "Probability & Statistics Challenge",
                "description": "Practice questions on Bayes theorem, distributions, and variance.",
                "questions": [
                    {
                        "question_text": "What is the variance of a Bernoulli random variable with success probability p?",
                        "explanation": "Var(X) = p * (1 - p).",
                        "options": [
                            {"option_text": "p(1 - p)", "is_correct": True},
                            {"option_text": "p^2", "is_correct": False},
                            {"option_text": "1 - p", "is_correct": False},
                            {"option_text": "p", "is_correct": False}
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "CALCULUS",
        "description": "Limits, derivatives, partial derivatives, double integrals, and optimization techniques.",
        "lectures": [
            {
                "title": "Multivariable Calculus: Gradients, Jacobians & Hessians",
                "description": "Vector calculus foundations essential for optimization and deep learning backpropagation.",
                "video_url": "https://www.youtube.com/watch?v=GkB4vW16QHI",
                "order": 1
            }
        ],
        "articles": [
            {
                "title": "Calculus for Machine Learning & Optimization",
                "summary": "Partial derivatives, gradients, directional derivatives, and optimization bounds.",
                "content": "# Calculus Foundations\n\nGradient vector $\\nabla f(x, y) = \\left[ \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right]^T$ represents direction of steepest ascent."
            }
        ],
        "pyqs": [
            {
                "year": 2024,
                "is_pyq": True,
                "question_text": "Evaluate the limit lim_{x -> 0} (sin(x) - x) / x^3.",
                "answer_text": "Applying L'Hopital's Rule thrice yields -1/6."
            }
        ],
        "quizzes": [
            {
                "title": "Calculus & Optimization Quiz",
                "description": "Test limits, gradients, and critical points.",
                "questions": [
                    {
                        "question_text": "If f(x, y) = x^2 + 3y^2, what is the gradient vector at (2, 1)?",
                        "explanation": "df/dx = 2x, df/dy = 6y. At (2,1): grad = (4, 6).",
                        "options": [
                            {"option_text": "(4, 6)", "is_correct": True},
                            {"option_text": "(2, 3)", "is_correct": False},
                            {"option_text": "(8, 6)", "is_correct": False},
                            {"option_text": "(4, 3)", "is_correct": False}
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "PYTHON PROGRAMMING",
        "description": "Data structures, OOP, list comprehensions, lambda functions, and Python libraries.",
        "lectures": [
            {
                "title": "Python Advanced Features: Decorators, Generators & Iterators",
                "description": "In-depth guide to Python memory efficiency, generator functions, and function wrappers.",
                "video_url": "https://www.youtube.com/watch?v=r7m99R3h1Q4",
                "order": 1
            }
        ],
        "articles": [
            {
                "title": "Python Data Structures & Performance Tricks",
                "summary": "List comprehensions, dict lookups, shallow vs deep copies.",
                "content": "# Python Core Programming\n\n### List Comprehension:\n`[x**2 for x in range(10) if x % 2 == 0]`\n\n### Generators:\nGenerators evaluate lazily using `yield`."
            }
        ],
        "pyqs": [
            {
                "year": 2024,
                "is_pyq": True,
                "question_text": "What is the output of print([i*j for i in range(1, 3) for j in range(1, 3)]) in Python?",
                "answer_text": "[1, 2, 2, 4]"
            }
        ],
        "quizzes": [
            {
                "title": "Python Programming Quiz",
                "description": "Test your knowledge of Python syntax, scoping, and data structures.",
                "questions": [
                    {
                        "question_text": "What is the time complexity of searching a key in a Python dictionary on average?",
                        "explanation": "Python dictionaries use hash tables, offering O(1) average time complexity.",
                        "options": [
                            {"option_text": "O(1)", "is_correct": True},
                            {"option_text": "O(log N)", "is_correct": False},
                            {"option_text": "O(N)", "is_correct": False},
                            {"option_text": "O(N log N)", "is_correct": False}
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "DATA STRUCTURE & ALGORITHM",
        "description": "Stacks, queues, linked lists, trees, heaps, graphs, sorting, and dynamic programming.",
        "lectures": [
            {
                "title": "Graph Algorithms: BFS, DFS, Dijkstra & Prim's",
                "description": "Graph traversals, shortest path algorithms, and minimum spanning tree logic.",
                "video_url": "https://www.youtube.com/watch?v=t0Cq6tVNRBA",
                "order": 1
            }
        ],
        "articles": [
            {
                "title": "Complete Mastery of Data Structures & Algorithms",
                "summary": "Asymptotic notation, trees, binary heaps, and dynamic programming patterns.",
                "content": "# Data Structures & Algorithms\n\n### Binary Heap:\n- Max Heap property: `Parent >= Child`\n- Build Heap algorithm takes $O(N)$ linear time."
            }
        ],
        "pyqs": [
            {
                "year": 2024,
                "is_pyq": True,
                "question_text": "What is the tightest upper bound for building a max-heap from an unsorted array of N elements?",
                "answer_text": "Building heap using Heapify takes O(N) linear time."
            }
        ],
        "quizzes": [
            {
                "title": "DSA Mastery Quiz",
                "description": "Data structures and algorithm design challenges.",
                "questions": [
                    {
                        "question_text": "Which sorting algorithm has a worst-case time complexity of O(N log N)?",
                        "explanation": "MergeSort guarantees O(N log N) time complexity in all cases (best, average, worst).",
                        "options": [
                            {"option_text": "Merge Sort", "is_correct": True},
                            {"option_text": "Quick Sort", "is_correct": False},
                            {"option_text": "Bubble Sort", "is_correct": False},
                            {"option_text": "Insertion Sort", "is_correct": False}
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "MACHINE LEARNING",
        "description": "Supervised learning, unsupervised learning, SVMs, Decision Trees, CNNs, and evaluation metrics.",
        "lectures": [
            {
                "title": "Machine Learning Crash Course: Regression to Neural Networks",
                "description": "Loss functions, optimization, decision trees, random forests, and deep learning.",
                "video_url": "https://www.youtube.com/watch?v=GwIo3gBZSuA",
                "order": 1
            }
        ],
        "articles": [
            {
                "title": "Machine Learning Fundamentals & Regularization",
                "summary": "Bias-Variance Tradeoff, L1 vs L2 regularization, confusion matrices.",
                "content": "# Machine Learning Core Concepts\n\n### Bias-Variance Tradeoff:\n- **High Bias**: Underfitting\n- **High Variance**: Overfitting\n\n$$\\text{Total Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Error}$$"
            }
        ],
        "pyqs": [
            {
                "year": 2024,
                "is_pyq": True,
                "question_text": "Explain the Bias-Variance tradeoff in supervised learning algorithms.",
                "answer_text": "High bias leads to underfitting. High variance leads to overfitting. Total Error = Bias^2 + Variance + Noise."
            }
        ],
        "quizzes": [
            {
                "title": "Machine Learning Fundamentals Quiz",
                "description": "Supervised learning models, overfitting, and regularization.",
                "questions": [
                    {
                        "question_text": "Which regularization technique performs implicit feature selection by driving weights to exact zero?",
                        "explanation": "L1 Regularization (Lasso) adds absolute penalty sum |w|, setting non-essential weights to zero.",
                        "options": [
                            {"option_text": "L1 Regularization (Lasso)", "is_correct": True},
                            {"option_text": "L2 Regularization (Ridge)", "is_correct": False},
                            {"option_text": "Dropout", "is_correct": False},
                            {"option_text": "Batch Normalization", "is_correct": False}
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "AI",
        "description": "Search algorithms, heuristic search (A*), constraint satisfaction, logic, and reasoning.",
        "lectures": [
            {
                "title": "Artificial Intelligence: A* Search & Game Playing",
                "description": "Admissible heuristics, A* algorithm, Minimax search, and Alpha-Beta pruning.",
                "video_url": "https://www.youtube.com/watch?v=g3uUQu2qTdU",
                "order": 1
            }
        ],
        "articles": [
            {
                "title": "Artificial Intelligence & Search Strategies",
                "summary": "State space search, A* admissibility, Alpha-Beta pruning.",
                "content": "# Artificial Intelligence\n\n### A* Search:\nEvaluation function $f(n) = g(n) + h(n)$ where $g(n)$ is path cost and $h(n)$ is heuristic."
            }
        ],
        "pyqs": [
            {
                "year": 2024,
                "is_pyq": True,
                "question_text": "What condition must a heuristic function h(n) satisfy for A* Search to be guaranteed admissible?",
                "answer_text": "h(n) must never overestimate the true cost to reach the goal: h(n) <= h*(n)."
            }
        ],
        "quizzes": [
            {
                "title": "AI & Search Algorithms Quiz",
                "description": "Test state space search and heuristic properties.",
                "questions": [
                    {
                        "question_text": "In Alpha-Beta pruning, a branch under a MIN node is pruned when:",
                        "explanation": "Pruning occurs when beta <= alpha.",
                        "options": [
                            {"option_text": "beta <= alpha", "is_correct": True},
                            {"option_text": "alpha == 0", "is_correct": False},
                            {"option_text": "beta > alpha", "is_correct": False},
                            {"option_text": "beta == 1", "is_correct": False}
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "GENERAL APTITUDE",
        "description": "Quantitative aptitude, verbal ability, logical reasoning, and data interpretation.",
        "lectures": [
            {
                "title": "General Aptitude & Logical Reasoning Masterclass",
                "description": "Quantitative techniques, speed math, series, ratios, and verbal logic.",
                "video_url": "https://www.youtube.com/watch?v=FjS6oUueq2c",
                "order": 1
            }
        ],
        "articles": [
            {
                "title": "General Aptitude Essentials for Competitive Exams",
                "summary": "Percentages, ratios, time-speed-distance, and coding-decoding logic.",
                "content": "# General Aptitude\n\n### Speed, Distance & Time:\n$$\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}$$"
            }
        ],
        "pyqs": [
            {
                "year": 2024,
                "is_pyq": True,
                "question_text": "A train 150 meters long takes 10 seconds to cross a telegraph post. How long will it take to cross a 250-meter long platform at the same speed?",
                "answer_text": "Speed = 150/10 = 15 m/s. Time = (150+250)/15 = 26.67 seconds."
            }
        ],
        "quizzes": [
            {
                "title": "General Aptitude Quick Test",
                "description": "Speed math and logical reasoning check.",
                "questions": [
                    {
                        "question_text": "If a product price increases by 20% and then decreases by 20%, what is the net percentage change?",
                        "explanation": "Net change = 1.20 * 0.80 = 0.96 => 4% decrease.",
                        "options": [
                            {"option_text": "4% decrease", "is_correct": True},
                            {"option_text": "No change", "is_correct": False},
                            {"option_text": "4% increase", "is_correct": False},
                            {"option_text": "2% decrease", "is_correct": False}
                        ]
                    }
                ]
            }
        ]
    }
]

def seed_all():
    print("Clearing outdated content and restructuring platform around 8 Official Subjects...")

    # Clear old lectures, articles, quizzes, pyqs
    Lecture.objects.all().delete()
    Article.objects.all().delete()
    Quiz.objects.all().delete()
    PYQ.objects.all().delete()

    for s_data in OFFICIAL_SUBJECTS:
        cat, _ = Category.objects.get_or_create(
            name=s_data["name"],
            defaults={"description": s_data["description"]}
        )
        cat.description = s_data["description"]
        cat.save()

        # Seed Lectures
        for lec in s_data.get("lectures", []):
            Lecture.objects.create(
                category=cat,
                title=lec["title"],
                description=lec["description"],
                video_url=lec["video_url"],
                order=lec["order"]
            )

        # Seed Articles
        for art in s_data.get("articles", []):
            Article.objects.create(
                subject=cat,
                title=art["title"],
                summary=art["summary"],
                content=art["content"]
            )

        # Seed PYQs
        for q in s_data.get("pyqs", []):
            PYQ.objects.create(
                subject=cat,
                year=q.get("year"),
                is_pyq=q.get("is_pyq", True),
                question_text=q["question_text"],
                option_a=q.get("option_a", "Option A"),
                option_b=q.get("option_b", "Option B"),
                option_c=q.get("option_c", "Option C"),
                option_d=q.get("option_d", "Option D"),
                correct_option=q.get("correct_option", "A"),
                answer_text=q["answer_text"]
            )

        # Seed Quizzes
        for qz in s_data.get("quizzes", []):
            quiz_obj = Quiz.objects.create(
                category=cat,
                title=qz["title"],
                description=qz["description"]
            )
            for q_item in qz.get("questions", []):
                qq = QuizQuestion.objects.create(
                    quiz=quiz_obj,
                    question_text=q_item["question_text"],
                    explanation=q_item["explanation"]
                )
                for opt in q_item.get("options", []):
                    QuizOption.objects.create(
                        question=qq,
                        option_text=opt["option_text"],
                        is_correct=opt["is_correct"]
                    )

        print(f"Ingested complete content suite for subject: {s_data['name']}")

    print("\nSUCCESSFULLY STRUCTURED ALL CONTENT AROUND THE 8 OFFICIAL SUBJECTS!")

if __name__ == "__main__":
    seed_all()
