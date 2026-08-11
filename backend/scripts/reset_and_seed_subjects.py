import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "e_learning_project.settings")
django.setup()

from core.models import PYQ, Category

def reset_and_seed():
    print("Clearing existing questions in PYQ & Practice Section...")
    count_deleted, _ = PYQ.objects.all().delete()
    print(f"Deleted {count_deleted} old question entries.")

    subjects_data = [
        {
            "name": "LINEAR ALGEBRA",
            "description": "Matrices, eigenvalues, eigenvectors, vector spaces, and linear transformations.",
            "questions": [
                {
                    "year": 2024,
                    "is_pyq": True,
                    "question_text": "Let A be a 3x3 matrix with eigenvalues lambda_1 = 1, lambda_2 = 2, and lambda_3 = -3. Find the determinant of matrix A^2 + 2I.",
                    "answer_text": "Since eigenvalues of A are 1, 2, -3, the eigenvalues of A^2 + 2I are (1^2 + 2) = 3, (2^2 + 2) = 6, and ((-3)^2 + 2) = 11. The determinant is the product of eigenvalues = 3 * 6 * 11 = 198."
                },
                {
                    "year": 2023,
                    "is_pyq": True,
                    "question_text": "Find the rank of the matrix A = [[1, 2, 3], [2, 4, 6], [3, 6, 9]].",
                    "answer_text": "Row 2 = 2 * Row 1, and Row 3 = 3 * Row 1. Reducing to row echelon form gives [[1, 2, 3], [0, 0, 0], [0, 0, 0]]. There is only 1 non-zero row, so Rank(A) = 1."
                },
                {
                    "year": None,
                    "is_pyq": False,
                    "question_text": "Which of the following conditions guarantees that a real symmetric matrix A is positive definite?",
                    "answer_text": "A real symmetric matrix is positive definite if and only if all of its eigenvalues are strictly positive (or all leading principal minors are positive)."
                }
            ]
        },
        {
            "name": "PROBABILITY",
            "description": "Random variables, distributions, Bayes theorem, expectation, and variance.",
            "questions": [
                {
                    "year": 2024,
                    "is_pyq": True,
                    "question_text": "Two fair 6-sided dice are rolled simultaneously. What is the conditional probability that the sum of the numbers is 8, given that the sum is an even number?",
                    "answer_text": "Total outcomes when sum is even: 18 outcomes. Outcomes with sum = 8: (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 outcomes. Conditional probability = 5/18."
                },
                {
                    "year": 2023,
                    "is_pyq": True,
                    "question_text": "If X is a Poisson random variable with mean lambda = 3, what is P(X = 0)?",
                    "answer_text": "P(X = k) = (e^(-lambda) * lambda^k) / k!. For k = 0: P(X = 0) = e^(-3) * 3^0 / 0! = e^(-3) approx 0.0498."
                },
                {
                    "year": None,
                    "is_pyq": False,
                    "question_text": "State Bayes' Theorem formula and its application in machine learning classifiers.",
                    "answer_text": "P(A|B) = [P(B|A) * P(A)] / P(B). Naive Bayes classifiers use this to compute posterior probability P(Class|Features) assuming feature independence."
                }
            ]
        },
        {
            "name": "CALCULUS",
            "description": "Limits, derivatives, partial derivatives, integrals, and optimization techniques.",
            "questions": [
                {
                    "year": 2024,
                    "is_pyq": True,
                    "question_text": "Evaluate the limit lim_{x -> 0} (sin(x) - x) / x^3.",
                    "answer_text": "Using L'Hopital's Rule thrice: derivative of numerator is cos(x)-1 -> -sin(x) -> -cos(x). Derivative of denominator is 3x^2 -> 6x -> 6. At x=0, -cos(0)/6 = -1/6."
                },
                {
                    "year": 2022,
                    "is_pyq": True,
                    "question_text": "Find the maximum value of f(x) = x * e^(-x) for x >= 0.",
                    "answer_text": "f'(x) = e^(-x) - x*e^(-x) = e^(-x)*(1 - x). Setting f'(x) = 0 yields x = 1. Max value is f(1) = 1/e."
                },
                {
                    "year": None,
                    "is_pyq": False,
                    "question_text": "What is the gradient vector of f(x, y) = 3x^2*y + 4y^2 at point (1, 2)?",
                    "answer_text": "df/dx = 6xy, df/dy = 3x^2 + 8y. At (1, 2): df/dx = 6(1)(2) = 12, df/dy = 3(1)^2 + 8(2) = 19. Gradient vector = (12, 19)."
                }
            ]
        },
        {
            "name": "PYTHON PROGRAMMING",
            "description": "Python data structures, decorators, generators, list comprehensions, and OOP.",
            "questions": [
                {
                    "year": 2024,
                    "is_pyq": True,
                    "question_text": "What is the output of print([i*j for i in range(1, 3) for j in range(1, 3)]) in Python?",
                    "answer_text": "i=1, j=1 -> 1; i=1, j=2 -> 2; i=2, j=1 -> 2; i=2, j=2 -> 4. Output: [1, 2, 2, 4]."
                },
                {
                    "year": None,
                    "is_pyq": False,
                    "question_text": "Explain the difference between deepcopy() and copy() in Python's copy module.",
                    "answer_text": "copy.copy() creates a shallow copy (constructs a new compound object and inserts references to objects found in original). copy.deepcopy() recursively copies all nested objects."
                },
                {
                    "year": None,
                    "is_pyq": False,
                    "question_text": "How do Python generators conserve memory compared to standard lists?",
                    "answer_text": "Generators use lazy evaluation (yield keyword) to generate values one at a time on-the-fly instead of allocating the entire sequence in RAM simultaneously."
                }
            ]
        },
        {
            "name": "DATA STRUCTURE & ALGORITHM",
            "description": "Stacks, queues, linked lists, trees, graphs, sorting, searching, and dynamic programming.",
            "questions": [
                {
                    "year": 2024,
                    "is_pyq": True,
                    "question_text": "What is the tightest upper bound for building a max-heap from an unsorted array of N elements?",
                    "answer_text": "Building a heap using bottom-up Heapify takes O(N) linear time, not O(N log N)."
                },
                {
                    "year": 2023,
                    "is_pyq": True,
                    "question_text": "In a connected weighted graph with N vertices and E edges, what is the time complexity of Prim's Algorithm using a Fibonacci Heap?",
                    "answer_text": "O(E + V log V)."
                },
                {
                    "year": None,
                    "is_pyq": False,
                    "question_text": "Explain the optimal substructure property in Dynamic Programming.",
                    "answer_text": "A problem has optimal substructure if an optimal solution to the problem contains optimal solutions to its subproblems."
                }
            ]
        },
        {
            "name": "MACHINE LEARNING",
            "description": "Supervised, unsupervised learning, regression, classification, SVMs, decision trees, neural nets.",
            "questions": [
                {
                    "year": 2024,
                    "is_pyq": True,
                    "question_text": "Explain the Bias-Variance tradeoff in supervised learning algorithms.",
                    "answer_text": "High bias leads to underfitting (oversimplified model). High variance leads to overfitting (model captures noise). Total Error = Bias^2 + Variance + Irreducible Error."
                },
                {
                    "year": 2023,
                    "is_pyq": True,
                    "question_text": "How does L1 regularization (Lasso) differ from L2 regularization (Ridge) in linear models?",
                    "answer_text": "L1 adds the absolute value of coefficients (|w_i|), forcing redundant feature weights to exact zero (feature selection). L2 adds squared magnitude (w_i^2), shrinking weights smoothly."
                },
                {
                    "year": None,
                    "is_pyq": False,
                    "question_text": "What is the primary loss function used for binary classification in Logistic Regression?",
                    "answer_text": "Binary Cross-Entropy Loss (Log Loss): L = - [y * log(p) + (1 - y) * log(1 - p)]."
                }
            ]
        },
        {
            "name": "AI",
            "description": "Search algorithms, heuristic search (A*), constraint satisfaction, logic, knowledge representation.",
            "questions": [
                {
                    "year": 2024,
                    "is_pyq": True,
                    "question_text": "What condition must a heuristic function h(n) satisfy for A* Search to be guaranteed admissible?",
                    "answer_text": "h(n) must be admissible: h(n) <= h*(n) for all nodes n, meaning it never overestimates the actual cost to reach the goal."
                },
                {
                    "year": 2023,
                    "is_pyq": True,
                    "question_text": "In Alpha-Beta Pruning, when is a branch pruned under Alpha-Beta condition?",
                    "answer_text": "A branch is pruned when beta <= alpha, where alpha is the best value choice for MAX and beta is the best value choice for MIN."
                },
                {
                    "year": None,
                    "is_pyq": False,
                    "question_text": "Differentiate between First-Order Logic (FOL) and Propositional Logic.",
                    "answer_text": "Propositional logic deals with simple declarative statements (true/false). FOL introduces objects, relations, functions, and quantifiers (Universal FOR ALL and Existential THERE EXISTS)."
                }
            ]
        },
        {
            "name": "GENERAL APTITUDE",
            "description": "Quantitative aptitude, verbal ability, logical reasoning, data interpretation, and spatial ability.",
            "questions": [
                {
                    "year": 2024,
                    "is_pyq": True,
                    "question_text": "A train 150 meters long takes 10 seconds to cross a telegraph post. How long will it take to cross a 250-meter long platform at the same speed?",
                    "answer_text": "Speed of train = 150 m / 10 s = 15 m/s. Total distance to cross platform = 150 + 250 = 400 m. Time taken = 400 / 15 = 26.67 seconds."
                },
                {
                    "year": 2023,
                    "is_pyq": True,
                    "question_text": "If LOGIC is coded as 13-16-8-10-4, how will APTITUDE be coded under the same rules?",
                    "answer_text": "Each letter is replaced by (Alphabetical position + 1). L(12+1=13), O(15+1=16), G(7+1=8), I(9+1=10), C(3+1=4). APTITUDE: A(2), P(17), T(21), I(10), T(21), U(22), D(5), E(6) -> 2-17-21-10-21-22-5-6."
                },
                {
                    "year": None,
                    "is_pyq": False,
                    "question_text": "A clock shows 3:30. What is the angle between the hour hand and the minute hand?",
                    "answer_text": "At 3:30, minute hand is at 180 degrees (6). Hour hand is at (3 * 30 + 30 * 0.5) = 105 degrees. Angle = 180 - 105 = 75 degrees."
                }
            ]
        }
    ]

    total_created = 0
    for sdata in subjects_data:
        cat, created = Category.objects.get_or_create(
            name=sdata["name"],
            defaults={"description": sdata["description"]}
        )
        if not created:
            cat.description = sdata["description"]
            cat.save()

        for q_item in sdata["questions"]:
            PYQ.objects.create(
                subject=cat,
                year=q_item["year"],
                is_pyq=q_item["is_pyq"],
                question_text=q_item["question_text"],
                answer_text=q_item["answer_text"]
            )
            total_created += 1
        print(f"Added {len(sdata['questions'])} questions for subject: {sdata['name']}")

    print(f"\nSUCCESSFULLY RESET PRACTICE SECTION AND SEEDED {total_created} QUESTIONS ACROSS {len(subjects_data)} SUBJECTS!")

if __name__ == "__main__":
    reset_and_seed()

