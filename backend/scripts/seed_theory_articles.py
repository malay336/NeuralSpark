import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

from core.models import Category, Article

def seed_theory_articles():
    print("Seeding GeeksforGeeks-style theory articles for GATE DS & AI...")

    # Ensure categories exist
    la_cat, _ = Category.objects.get_or_create(name='Linear algebra', defaults={'description': 'Linear Algebra'})
    ml_cat, _ = Category.objects.get_or_create(name='ML', defaults={'description': 'Machine Learning'})
    prob_cat, _ = Category.objects.get_or_create(name='probability', defaults={'description': 'Probability & Statistics'})
    dsa_cat, _ = Category.objects.get_or_create(name='DSA', defaults={'description': 'Data Structures & Algorithms'})

    # 1. Linear Algebra Article
    la_art, created = Article.objects.get_or_create(
        title="Eigenvalues and Eigenvectors: A GATE Perspective",
        subject=la_cat,
        defaults={
            "summary": "Master the concepts of characteristic equations, eigenvalues, eigenvectors, and their algebraic/geometric multiplicities for GATE DS & AI.",
            "content": "### Introduction to Eigenvalues & Eigenvectors\n\n"
                       "In Linear Algebra, linear transformations can rotate, scale, or shear vectors. "
                       "However, there exist certain special non-zero vectors whose direction remains unchanged "
                       "during a linear transformation. These are called **Eigenvectors**, and the factor by which "
                       "they scale is the **Eigenvalue**.\n\n"
                       "For a square matrix $A \\in \\mathbb{R}^{n \\times n}$, if there exists a scalar $\\lambda$ and "
                       "a non-zero vector $v \\in \\mathbb{R}^n$ such that:\n"
                       "$$Av = \\lambda v$$\n"
                       "then $v$ is an eigenvector of $A$ associated with eigenvalue $\\lambda$.\n\n"
                       "### How to Calculate Eigenvalues (Characteristic Equation)\n\n"
                       "To find eigenvalues, we rewrite the equation as:\n"
                       "$$(A - \\lambda I)v = 0$$\n"
                       "Since $v \\neq 0$, the matrix $(A - \\lambda I)$ must be singular, meaning its determinant is zero:\n"
                       "$$\\det(A - \\lambda I) = 0$$\n"
                       "Solving this polynomial equation gives the eigenvalues $\\lambda_1, \\lambda_2, \\dots, \\lambda_n$.\n\n"
                       "### Key Properties for GATE\n\n"
                       "1. **Sum of Eigenvalues**: The sum of the eigenvalues of a matrix equals its **Trace** (the sum of diagonal elements):\n"
                       "   $$\\sum \\lambda_i = \\text{Trace}(A)$$\n"
                       "2. **Product of Eigenvalues**: The product of the eigenvalues equals the **Determinant** of the matrix:\n"
                       "   $$\\prod \\lambda_i = \\det(A)$$\n"
                       "3. **Symmetric Matrices**: Real symmetric matrices always have real eigenvalues, and their eigenvectors are orthogonal.\n"
                       "4. **Triangular/Diagonal Matrices**: For upper triangular, lower triangular, or diagonal matrices, the eigenvalues are simply the diagonal entries."
        }
    )
    if created:
        print(f"Created Linear Algebra article (ID: {la_art.id})")

    # 2. Machine Learning Article
    ml_art, created = Article.objects.get_or_create(
        title="Linear Regression: Theoretical Foundations & Gradient Descent",
        subject=ml_cat,
        defaults={
            "summary": "Deep dive into Linear Regression, Mean Squared Error cost functions, Ordinary Least Squares, and Gradient Descent optimization.",
            "content": "### Introduction to Linear Regression\n\n"
                       "Linear Regression is one of the foundational supervised learning algorithms in Machine Learning. "
                       "It models the relationship between a dependent scalar variable $y$ and one or more independent variables $x$.\n\n"
                       "The linear regression hypothesis function is formulated as:\n"
                       "$$h_\\theta(x) = \\theta_0 + \\theta_1 x_1 + \\theta_2 x_2 + \\dots + \\theta_n x_n = \\theta^T x$$\n"
                       "where $\\theta_i$ are parameters (weights) and $x_0 = 1$ is the bias term.\n\n"
                       "### Cost Function: Mean Squared Error (MSE)\n\n"
                       "To measure how well our model fits the training data, we define a loss function. The standard is Mean Squared Error:\n"
                       "$$J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^m (h_\\theta(x^{(i)}) - y^{(i)})^2$$\n"
                       "where $m$ is the number of training examples.\n\n"
                       "### Optimization 1: Ordinary Least Squares (Analytical)\n\n"
                       "We can solve for the optimal parameters analytically using the Normal Equation:\n"
                       "$$\\theta = (X^T X)^{-1} X^T y$$\n"
                       "Note that if $X^T X$ is non-invertible (singular), we use pseudo-inverse. Computing $(X^T X)^{-1}$ is computationally heavy ($O(n^3)$), which is why we use Gradient Descent for large feature sizes.\n\n"
                       "### Optimization 2: Gradient Descent (Iterative)\n\n"
                       "Gradient descent minimizes the cost function $J(\\theta)$ by iteratively updating parameters in the opposite direction of the gradient:\n"
                       "$$\\theta_j := \\theta_j - \\alpha \\frac{\\partial}{\\partial \\theta_j} J(\\theta)$$\n"
                       "where $\\alpha$ is the learning rate. For MSE, the update rule is:\n"
                       "$$\\theta_j := \\theta_j - \\alpha \\frac{1}{m} \\sum_{i=1}^m (h_\\theta(x^{(i)}) - y^{(i)}) x_j^{(i)}$$"
        }
    )
    if created:
        print(f"Created ML article (ID: {ml_art.id})")

    # 3. Probability Article
    prob_art, created = Article.objects.get_or_create(
        title="Bayes' Theorem and Conditional Probability",
        subject=prob_cat,
        defaults={
            "summary": "Understand conditional probability, the Law of Total Probability, and Bayes' Theorem with GATE Data Science practice concepts.",
            "content": "### Conditional Probability\n\n"
                       "Conditional probability measures the probability of an event occurring, given that another event has already occurred. "
                       "The conditional probability of event $A$ given event $B$ is denoted as $P(A \\mid B)$ and defined as:\n"
                       "$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} \\quad \\text{for } P(B) > 0$$\n\n"
                       "### Bayes' Theorem Formulation\n\n"
                       "Bayes' Theorem relates conditional probabilities in a reverse manner. It is derived from the definition of conditional probability:\n"
                       "$$P(A \\mid B) = \\frac{P(B \\mid A) P(A)}{P(B)}$$\n\n"
                       "Where:\n"
                       "- $P(A \\mid B)$ is the **Posterior** probability of hypothesis $A$ given evidence $B$.\n"
                       "- $P(B \\mid A)$ is the **Likelihood** of evidence $B$ given hypothesis $A$.\n"
                       "- $P(A)$ is the **Prior** probability of the hypothesis.\n"
                       "- $P(B)$ is the **Marginal** probability of the evidence (constant factor).\n\n"
                       "### Law of Total Probability\n\n"
                       "Often, the denominator $P(B)$ is not given directly. If the sample space is partitioned by mutually exclusive events $A_1, A_2, \\dots, A_k$, we calculate it using the Law of Total Probability:\n"
                       "$$P(B) = \\sum_{i=1}^k P(B \\mid A_i) P(A_i)$$\n\n"
                       "Thus, Bayes' Theorem can be written as:\n"
                       "$$P(A_j \\mid B) = \\frac{P(B \\mid A_j) P(A_j)}{\\sum_{i=1}^k P(B \\mid A_i) P(A_i)}$$"
        }
    )
    if created:
        print(f"Created Probability article (ID: {prob_art.id})")

    # 4. DSA Article
    dsa_art, created = Article.objects.get_or_create(
        title="Hash Table Collisions: Chaining vs. Open Addressing",
        subject=dsa_cat,
        defaults={
            "summary": "Understand how hash tables work, what collisions are, and analyze collision resolution techniques: chaining and open addressing.",
            "content": "### What is a Collision in Hashing?\n\n"
                       "A Hash Table stores key-value pairs. It uses a hash function $h(k)$ to map keys to index locations in an array. "
                       "Since the universe of keys is much larger than the slot size of the array, two different keys may map to the same slot:\n"
                       "$$h(k_1) = h(k_2) \\quad \\text{where } k_1 \\neq k_2$$\n"
                       "This event is called a **Collision**.\n\n"
                       "### Collision Resolution 1: Separate Chaining\n\n"
                       "In Separate Chaining, each slot in the hash table points to a linked list of records that share the same hash value.\n"
                       "- **Insertion**: Always O(1) by appending key at the head of the linked list.\n"
                       "- **Search/Deletion**: Depends on chain length. In the worst case (all keys collide into one slot), search takes O(n).\n"
                       "- **Average Case**: Under Uniform Hashing assumption, the average chain length is the load factor $\\alpha = n/m$. Search takes O(1 + $\\alpha$).\n\n"
                       "### Collision Resolution 2: Open Addressing\n\n"
                       "In Open Addressing, all elements are stored in the hash table itself. If a collision occurs, we probe other slots sequentially according to a probe sequence.\n"
                       "1. **Linear Probing**: $h(k, i) = (h'(k) + i) \\bmod m$. Suffer from primary clustering.\n"
                       "2. **Quadratic Probing**: $h(k, i) = (h'(k) + c_1 i + c_2 i^2) \\bmod m$. Suffers from secondary clustering.\n"
                       "3. **Double Hashing**: $h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\bmod m$. Eliminates clustering issues."
        }
    )
    if created:
        print(f"Created DSA article (ID: {dsa_art.id})")

    print("Theory seeding complete.")

if __name__ == '__main__':
    seed_theory_articles()
