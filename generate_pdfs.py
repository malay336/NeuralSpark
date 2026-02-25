from fpdf import FPDF
import os

output_dir = r"C:\Users\singh\.gemini\antigravity\scratch\gateoverflow_clone\sample_pdfs"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def create_pdf(filename, title, sections):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=18, style="B")
    pdf.cell(0, 15, txt=title, ln=True, align='C')
    pdf.ln(10)
    
    for section_title, content in sections:
        pdf.set_font("Helvetica", size=14, style="B")
        pdf.cell(0, 10, txt=section_title, ln=True)
        pdf.set_font("Helvetica", size=11)
        pdf.multi_cell(0, 8, txt=content)
        pdf.ln(8)
        
        # Add a new page if we're near the bottom to make it multi-page if needed
        if pdf.get_y() > 250:
            pdf.add_page()
            
    pdf.output(os.path.join(output_dir, filename))

# --- Question PDF Content ---
question_title = "Data Structures and Algorithms - Final Assignment"
question_sections = [
    ("Question 1: Graph Theory - Dijkstra's Algorithm (25 Points)",
     "a) Explain the theoretical foundation of Dijkstra's algorithm for finding the shortest path "
     "in a weighted graph. Discuss why it fails when negative weight edges are present.\n\n"
     "b) Trace the execution of Dijkstra's algorithm on a graph with vertices {A, B, C, D, E} and "
     "edges (A,B,4), (A,C,2), (B,C,5), (B,D,10), (C,E,3), (E,D,4), (D,A,7). Assume 'A' is the source node. "
     "Show the state of the distance array and the priority queue at each step.\n\n"
     "c) Provide a Python implementation of Dijkstra's algorithm using a priority queue (heapq). "
     "Analyze both its time and space complexity."),
    
    ("Question 2: Dynamic Programming - The Knapsack Problem (25 Points)",
     "a) Define the 0/1 Knapsack problem. Formulate this problem mathematically, clearly defining "
     "the objective function and the constraints.\n\n"
     "b) Write the Bellman equation (recurrence relation) that solves the 0/1 Knapsack problem. "
     "Explain the base cases and the recursive step in detail.\n\n"
     "c) Given a knapsack with a maximum weight capacity W = 50, and three items: "
     "Item 1 (Weight: 10, Value: 60), Item 2 (Weight: 20, Value: 100), Item 3 (Weight: 30, Value: 120). "
     "Use dynamic programming to determine the maximum value that can be placed in the knapsack. "
     "Show the DP table."),
     
    ("Question 3: Advanced Tree Structures - AVL Trees (25 Points)",
     "a) What is the defining property of an AVL tree? How does this property guarantee O(log n) "
     "search, insertion, and deletion times?\n\n"
     "b) Describe the four types of rotations used to maintain balance in an AVL tree: "
     "Left-Left (LL), Right-Right (RR), Left-Right (LR), and Right-Left (RL). Provide a small "
     "example for each where the rotation becomes necessary.\n\n"
     "c) Insert the following sequence of numbers into an initially empty AVL tree: "
     "10, 20, 30, 40, 50, 25. Show the tree after each insertion and indicate any rotations performed."),
     
    ("Question 4: System Design and Concurrency (25 Points)",
     "a) Explain the concept of a Deadlock in operating systems. What are the four Coffman conditions "
     "that must hold simultaneously for a deadlock to occur?\n\n"
     "b) Describe the Bakery Algorithm for mutual exclusion. How does it ensure fairness (no starvation) "
     "among competing threads?\n\n"
     "c) Design a thread-safe Singleton class in Java or Python. Explain how you ensure that only one "
     "instance is created even in a highly concurrent environment. Discuss the 'Double-Checked Locking' idiom.")
]

# --- Rubric PDF Content ---
rubric_title = "Grading Rubric - DSA Final Assignment"
rubric_sections = [
    ("Question 1: Dijkstra's Algorithm (25 Points)",
     "- (5 pts) Clear explanation of the algorithm's greedy approach and relaxation.\n"
     "- (5 pts) Correct explanation of why negative weights break the greedy assumption.\n"
     "- (5 pts) Accurate step-by-step trace of the algorithm on the provided graph, showing correct intermediate distances.\n"
     "- (5 pts) Syntactically correct and logical Python implementation using a priority queue.\n"
     "- (5 pts) Accurate time complexity analysis (O(E log V) or O(V^2)) and space complexity (O(V))."),
    
    ("Question 2: Knapsack Problem (25 Points)",
     "- (5 pts) Accurate mathematical formulation (maximizing sum of values subject to weight constraint).\n"
     "- (10 pts) Correct recurrence relation with well-defined base cases and recursive step.\n"
     "- (10 pts) Correct construction of the DP table for the specific example and the correct final maximum value (220)."),
     
    ("Question 3: AVL Trees (25 Points)",
     "- (5 pts) Correct definition: height difference of left and right subtrees is at most 1.\n"
     "- (10 pts) Clear explanation and examples of LL, RR, LR, and RL rotations.\n"
     "- (10 pts) Correct final tree structure after all insertions and accurate identification of the rotations performed (e.g., RR rotation after inserting 30, RL rotation after inserting 25)."),
     
    ("Question 4: System Design and Concurrency (25 Points)",
     "- (5 pts) Clear explanation of deadlock.\n"
     "- (5 pts) Accurate listing and explanation of the 4 Coffman conditions (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait).\n"
     "- (5 pts) Clear explanation of the Bakery Algorithm ticket numbering system.\n"
     "- (10 pts) Correct implementation of a thread-safe Singleton and a solid explanation of double-checked locking and its pitfalls (e.g., volatile keyword in Java).")
]

# --- Student Answer PDF Content ---
answer_title = "Student Submission - Alice Smith"
answer_sections = [
    ("Answer to Question 1: Dijkstra's",
     "a) Dijkstra's algorithm finds the shortest path from a starting node to all other nodes in a graph with non-negative edge weights. It works greedily by always picking the unvisited node with the smallest known distance, and then 'relaxing' its neighbors (updating their distances if a shorter path is found). It fails with negative weights because once a node is marked as visited, its shortest path is assumed to be final. A negative edge could later offer a shorter path to a 'visited' node, breaking the greedy property.\n\n"
     "b) Trace:\n- Init: dist(A)=0, others INF. PQ: (0,A)\n- Pop A. Neighbors: B(4), C(2). dist(B)=4, dist(C)=2. PQ: (2,C), (4,B)\n- Pop C. Neighbors: E. dist(E)=2+3=5. PQ: (4,B), (5,E)\n- Pop B. Neighbors: D. dist(D)=4+10=14. PQ: (5,E), (14,D)\n- Pop E. Neighbors: D. dist(D)=min(14, 5+4=9)=9. PQ: (9,D), (14,D) - Note: 9 replaces 14 logically.\n- Pop D. Neighbors: A. A is already visited.\nFinal distances: A=0, B=4, C=2, D=9, E=5\n\n"
     "c) Code:\n```python\nimport heapq\ndef dijkstra(graph, start):\n  distances = {node: float('inf') for node in graph}\n  distances[start] = 0\n  pq = [(0, start)]\n  while pq:\n    current_dist, current_node = heapq.heappop(pq)\n    if current_dist > distances[current_node]:\n      continue\n    for neighbor, weight in graph[current_node].items():\n      distance = current_dist + weight\n      if distance < distances[neighbor]:\n        distances[neighbor] = distance\n        heapq.heappush(pq, (distance, neighbor))\n  return distances\n```\nTime: O(E log V). Space: O(V)."),
    
    ("Answer to Question 2: Knapsack",
     "a) We want to maximize sum(v_i * x_i) subject to sum(w_i * x_i) <= W, where x_i is 0 or 1.\n\n"
     "b) Let DP[i][w] be the max value using items up to index i and weight limit w.\nBase case: DP[0][w] = 0 for all w; DP[i][0] = 0 for all i.\nRecursive step:\nIf w_i > w: DP[i][w] = DP[i-1][w] (can't include item)\nElse: DP[i][w] = max(DP[i-1][w], v_i + DP[i-1][w-w_i]) (max of excluding or including)\n\n"
     "c) DP Table for W=50:\nItems: 1(10,60), 2(20,100), 3(30,120)\nUsing item 1, 2, and partial 3 would give us a lot, but since it's 0/1 we can only pick whole items. \nItem 2 + Item 3 = 20 + 30 = 50 weight. Value = 100 + 120 = 220.\nMax value is 220."),
     
    ("Answer to Question 3: AVL Trees",
     "a) An AVL tree is a self-balancing BST where the difference in heights between the left and right subtrees of any node is at most 1. This keeps the height strictly bounded to O(log n).\n\n"
     "b) \n- LL: caused by insertion into left subtree of left child. Fixed by right rotation.\n- RR: caused by insertion into right subtree of right child. Fixed by left rotation.\n- LR: caused by insertion into right subtree of left child. Fixed by left rotation on left child, then right rotation on root.\n- RL: caused by insertion into left subtree of right child. Fixed by right rotation on right child, then left rotation on root.\n\n"
     "c) \nInsert 10: Root=10\nInsert 20: 10->20\nInsert 30: 10->20->30 (RR imbalance at 10). Perform Left Rotation. Tree: 20(head), left=10, right=30.\nInsert 40: 30->40\nInsert 50: 30->40->50 (RR imbalance at 30). Perform Left Rotation. Tree: 20, left=10, right=40, 40.left=30, 40.right=50.\nInsert 25: 30.left=25. (Imbalance)."),
     
    ("Answer to Question 4: Operating Systems",
     "a) Deadlock is when two or more processes are waiting indefinitely for an event that can only be caused by one of the waiting processes. Conditions: 1. Mutual Exclusion. 2. Hold and Wait. 3. No Preemption. 4. Circular Wait.\n\n"
     "b) The Bakery algorithm works like a bakery: customers take a ticket (a number). Customers are served in order of their ticket number. If two get the same number, they are served based on their process ID (smaller ID goes first). This ensures FIFO fairness and prevents starvation.\n\n"
     "c) Double-checked locking singleton in Python:\n```python\nimport threading\nclass Singleton:\n  _instance = None\n  _lock = threading.Lock()\n  def __new__(cls):\n    if cls._instance is None:\n      with cls._lock:\n        if cls._instance is None:\n          cls._instance = super(Singleton, cls).__new__(cls)\n    return cls._instance\n```")
]

create_pdf("sample_question_large.pdf", question_title, question_sections)
create_pdf("sample_rubric_large.pdf", rubric_title, rubric_sections)
create_pdf("sample_student_answer_large.pdf", answer_title, answer_sections)

print("Large PDFs generated successfully in:", output_dir)
