"""
migrations/seed_roadmaps.py — Seed all 15 roadmaps with full topic data.

Run from backend/:
    .\\venv\\Scripts\\python.exe migrations/seed_roadmaps.py
    .\\venv\\Scripts\\python.exe migrations/seed_roadmaps.py --reset
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database import db
from models.roadmap import Roadmap, Topic

# ── Roadmap + Topic master data ───────────────────────────────────────────────
ROADMAP_DATA = [
  {
    "slug": "dsa", "title": "Data Structures & Algorithms",
    "icon": "🌳", "category": "programming", "estimated_hours": 60, "order_index": 1,
    "description": "Master arrays, linked lists, trees, graphs, and dynamic programming step by step.",
    "topics": [
      ("Arrays & Strings",             "Easy",   "beginner",     45, "beginner"),
      ("Two Pointers & Sliding Window","Easy",   "beginner",     40, "beginner"),
      ("Hashing & HashMaps",           "Easy",   "beginner",     40, "beginner"),
      ("Recursion Fundamentals",       "Medium", "beginner",     50, "beginner"),
      ("Stacks & Queues",              "Easy",   "intermediate", 45, "intermediate"),
      ("Linked Lists",                 "Medium", "intermediate", 60, "intermediate"),
      ("Binary Search",                "Medium", "intermediate", 40, "intermediate"),
      ("Trees & BST",                  "Medium", "intermediate", 70, "intermediate"),
      ("Heaps & Priority Queues",      "Medium", "intermediate", 50, "intermediate"),
      ("Graphs — BFS & DFS",           "Hard",   "advanced",     80, "advanced"),
      ("Shortest Path Algorithms",     "Hard",   "advanced",     60, "advanced"),
      ("Backtracking",                 "Hard",   "advanced",     60, "advanced"),
      ("Dynamic Programming",          "Hard",   "advanced",     90, "advanced"),
      ("Trie & Segment Tree",          "Hard",   "advanced",     60, "advanced"),
      ("Greedy Algorithms",            "Medium", "advanced",     50, "advanced"),
      ("Bit Manipulation",             "Medium", "intermediate", 40, "intermediate"),
      ("Sorting & Searching",          "Medium", "intermediate", 50, "intermediate"),
      ("String Algorithms",            "Hard",   "advanced",     55, "advanced"),
    ],
  },
  {
    "slug": "java", "title": "Java Programming",
    "icon": "☕", "category": "programming", "estimated_hours": 40, "order_index": 2,
    "description": "Core Java, OOP, collections, multithreading, and Java 8+ features.",
    "topics": [
      ("Java Basics & Syntax",          "Easy",   "beginner",     30, "beginner"),
      ("OOP Concepts in Java",          "Easy",   "beginner",     45, "beginner"),
      ("Arrays & Strings in Java",      "Easy",   "beginner",     40, "beginner"),
      ("Exception Handling",            "Medium", "beginner",     35, "beginner"),
      ("Collections Framework",         "Medium", "intermediate", 60, "intermediate"),
      ("Generics",                      "Medium", "intermediate", 40, "intermediate"),
      ("Multithreading & Concurrency",  "Hard",   "intermediate", 70, "intermediate"),
      ("Java 8 — Streams & Lambdas",    "Medium", "intermediate", 55, "intermediate"),
      ("File I/O & Serialization",      "Medium", "intermediate", 45, "intermediate"),
      ("Design Patterns in Java",       "Hard",   "advanced",     60, "advanced"),
      ("JVM Internals",                 "Hard",   "advanced",     50, "advanced"),
      ("Spring Boot Basics",            "Medium", "advanced",     60, "advanced"),
      ("JDBC & Database Connectivity",  "Medium", "advanced",     45, "advanced"),
      ("Unit Testing with JUnit",       "Easy",   "advanced",     40, "advanced"),
    ],
  },
  {
    "slug": "python", "title": "Python Programming",
    "icon": "🐍", "category": "programming", "estimated_hours": 35, "order_index": 3,
    "description": "Python fundamentals, data structures, OOP, file handling, and popular libraries.",
    "topics": [
      ("Python Basics & Syntax",       "Easy",   "beginner",     30, "beginner"),
      ("Data Types & Collections",     "Easy",   "beginner",     35, "beginner"),
      ("Functions & Scope",            "Easy",   "beginner",     30, "beginner"),
      ("OOP in Python",                "Medium", "beginner",     45, "beginner"),
      ("File Handling & I/O",          "Easy",   "intermediate", 35, "intermediate"),
      ("Comprehensions & Generators",  "Medium", "intermediate", 40, "intermediate"),
      ("Decorators & Context Managers","Medium", "intermediate", 45, "intermediate"),
      ("Regular Expressions",          "Medium", "intermediate", 35, "intermediate"),
      ("NumPy & Pandas Basics",        "Medium", "intermediate", 60, "intermediate"),
      ("Flask / FastAPI Basics",       "Medium", "advanced",     60, "advanced"),
      ("Threading & Async",            "Hard",   "advanced",     55, "advanced"),
      ("Unit Testing (pytest)",        "Easy",   "advanced",     40, "advanced"),
    ],
  },
  {
    "slug": "cpp", "title": "C++ Programming",
    "icon": "⚡", "category": "programming", "estimated_hours": 38, "order_index": 4,
    "description": "C++ fundamentals, STL, memory management, and competitive programming.",
    "topics": [
      ("C++ Syntax & Basics",           "Easy",   "beginner",     30, "beginner"),
      ("Pointers & References",         "Medium", "beginner",     45, "beginner"),
      ("OOP in C++",                    "Medium", "beginner",     50, "beginner"),
      ("Memory Management",             "Hard",   "intermediate", 55, "intermediate"),
      ("STL — Containers",              "Medium", "intermediate", 60, "intermediate"),
      ("STL — Algorithms & Iterators",  "Medium", "intermediate", 50, "intermediate"),
      ("Templates & Generics",          "Hard",   "intermediate", 50, "intermediate"),
      ("File I/O in C++",               "Easy",   "intermediate", 35, "intermediate"),
      ("Lambda & Modern C++ (11/14/17)","Medium", "advanced",     55, "advanced"),
      ("Competitive Programming Tricks","Hard",   "advanced",     60, "advanced"),
      ("Multithreading in C++",         "Hard",   "advanced",     60, "advanced"),
      ("Design Patterns in C++",        "Hard",   "advanced",     55, "advanced"),
      ("Debugging & Profiling",         "Medium", "advanced",     40, "advanced"),
    ],
  },
  {
    "slug": "sql", "title": "SQL & Databases",
    "icon": "🗄️", "category": "cs-core", "estimated_hours": 25, "order_index": 5,
    "description": "SQL queries, joins, indexing, stored procedures, and database optimization.",
    "topics": [
      ("SQL Basics — DDL & DML",       "Easy",   "beginner",     30, "beginner"),
      ("SELECT & Filtering",           "Easy",   "beginner",     25, "beginner"),
      ("Joins (INNER, LEFT, RIGHT)",   "Medium", "beginner",     40, "beginner"),
      ("Aggregate Functions & GROUP BY","Easy",  "beginner",     30, "beginner"),
      ("Subqueries & CTEs",            "Medium", "intermediate", 45, "intermediate"),
      ("Window Functions",             "Hard",   "intermediate", 50, "intermediate"),
      ("Indexes & Query Optimization", "Medium", "intermediate", 45, "intermediate"),
      ("Transactions & ACID",          "Medium", "intermediate", 40, "intermediate"),
      ("Stored Procedures & Functions","Medium", "advanced",     45, "advanced"),
      ("Database Design & ERD",        "Medium", "advanced",     50, "advanced"),
    ],
  },
  {
    "slug": "dbms", "title": "DBMS",
    "icon": "📦", "category": "cs-core", "estimated_hours": 20, "order_index": 6,
    "description": "Database concepts, ER diagrams, normalization, concurrency control.",
    "topics": [
      ("Introduction to DBMS",         "Easy",   "beginner",     25, "beginner"),
      ("ER Model & ER Diagrams",        "Easy",   "beginner",     35, "beginner"),
      ("Relational Model",             "Easy",   "beginner",     30, "beginner"),
      ("Normalization (1NF–BCNF)",     "Medium", "intermediate", 50, "intermediate"),
      ("Transaction Management",       "Medium", "intermediate", 45, "intermediate"),
      ("Concurrency Control",          "Hard",   "intermediate", 50, "intermediate"),
      ("Indexing & Hashing",           "Medium", "intermediate", 40, "intermediate"),
      ("Query Processing & Optimization","Hard", "advanced",     55, "advanced"),
    ],
  },
  {
    "slug": "os", "title": "Operating Systems",
    "icon": "🖥️", "category": "cs-core", "estimated_hours": 22, "order_index": 7,
    "description": "Processes, threads, memory management, scheduling, and deadlocks.",
    "topics": [
      ("OS Fundamentals",              "Easy",   "beginner",     30, "beginner"),
      ("Process Management",           "Medium", "beginner",     45, "beginner"),
      ("CPU Scheduling Algorithms",    "Medium", "intermediate", 50, "intermediate"),
      ("Process Synchronization",      "Hard",   "intermediate", 55, "intermediate"),
      ("Deadlocks",                    "Hard",   "intermediate", 45, "intermediate"),
      ("Memory Management",            "Hard",   "intermediate", 60, "intermediate"),
      ("Virtual Memory & Paging",      "Hard",   "advanced",     55, "advanced"),
      ("File Systems",                 "Medium", "advanced",     45, "advanced"),
      ("I/O Management",               "Medium", "advanced",     40, "advanced"),
    ],
  },
  {
    "slug": "cn", "title": "Computer Networks",
    "icon": "🌐", "category": "cs-core", "estimated_hours": 20, "order_index": 8,
    "description": "OSI model, TCP/IP, HTTP, DNS, routing, and network security basics.",
    "topics": [
      ("Network Fundamentals",         "Easy",   "beginner",     30, "beginner"),
      ("OSI & TCP/IP Model",           "Easy",   "beginner",     40, "beginner"),
      ("Physical & Data Link Layer",   "Medium", "beginner",     40, "beginner"),
      ("Network Layer & IP",           "Medium", "intermediate", 45, "intermediate"),
      ("Transport Layer — TCP & UDP",  "Medium", "intermediate", 45, "intermediate"),
      ("Application Layer — HTTP/DNS", "Easy",   "intermediate", 40, "intermediate"),
      ("Routing Algorithms",           "Hard",   "advanced",     50, "advanced"),
      ("Network Security Basics",      "Medium", "advanced",     45, "advanced"),
    ],
  },
  {
    "slug": "oop", "title": "OOP Concepts",
    "icon": "🔷", "category": "cs-core", "estimated_hours": 15, "order_index": 9,
    "description": "Encapsulation, inheritance, polymorphism, abstraction, and SOLID principles.",
    "topics": [
      ("Classes & Objects",            "Easy",   "beginner",     25, "beginner"),
      ("Encapsulation",                "Easy",   "beginner",     25, "beginner"),
      ("Inheritance",                  "Easy",   "beginner",     30, "beginner"),
      ("Polymorphism",                 "Medium", "intermediate", 35, "intermediate"),
      ("Abstraction & Interfaces",     "Medium", "intermediate", 35, "intermediate"),
      ("SOLID Principles",             "Hard",   "intermediate", 45, "intermediate"),
      ("Design Patterns Overview",     "Hard",   "advanced",     55, "advanced"),
    ],
  },
  {
    "slug": "system-design", "title": "System Design Basics",
    "icon": "🏗️", "category": "cs-core", "estimated_hours": 18, "order_index": 10,
    "description": "Scalability, load balancing, caching, databases, and microservices fundamentals.",
    "topics": [
      ("Scalability & Load Balancing",  "Medium", "beginner",     40, "beginner"),
      ("Caching Strategies",            "Medium", "intermediate", 45, "intermediate"),
      ("Database Sharding & Replication","Hard",  "intermediate", 50, "intermediate"),
      ("Message Queues & Kafka",        "Hard",   "advanced",     55, "advanced"),
      ("Microservices Architecture",    "Hard",   "advanced",     60, "advanced"),
      ("CAP Theorem & Consistency",     "Hard",   "advanced",     45, "advanced"),
    ],
  },
  {
    "slug": "quant", "title": "Quantitative Aptitude",
    "icon": "🔢", "category": "aptitude", "estimated_hours": 30, "order_index": 11,
    "description": "Number systems, percentages, time & work, profit & loss, and all placement aptitude topics.",
    "topics": [
      ("Number System",                "Easy",   "beginner",     35, "beginner"),
      ("Percentages",                  "Easy",   "beginner",     30, "beginner"),
      ("Profit, Loss & Discount",      "Easy",   "beginner",     30, "beginner"),
      ("Ratio & Proportion",           "Easy",   "beginner",     30, "beginner"),
      ("Time & Work",                  "Medium", "intermediate", 40, "intermediate"),
      ("Time, Speed & Distance",       "Medium", "intermediate", 40, "intermediate"),
      ("Simple & Compound Interest",   "Medium", "intermediate", 35, "intermediate"),
      ("Averages & Mixtures",          "Medium", "intermediate", 35, "intermediate"),
      ("Permutation & Combination",    "Hard",   "intermediate", 50, "intermediate"),
      ("Probability",                  "Hard",   "intermediate", 45, "intermediate"),
      ("Data Interpretation",          "Medium", "advanced",     50, "advanced"),
      ("Geometry & Mensuration",       "Medium", "advanced",     45, "advanced"),
      ("Algebra & Equations",          "Medium", "advanced",     40, "advanced"),
      ("Progressions (AP/GP)",         "Medium", "advanced",     35, "advanced"),
      ("Clocks & Calendars",           "Medium", "intermediate", 30, "intermediate"),
    ],
  },
  {
    "slug": "logical", "title": "Logical Reasoning",
    "icon": "🧩", "category": "aptitude", "estimated_hours": 20, "order_index": 12,
    "description": "Syllogisms, blood relations, seating arrangements, puzzles, and pattern recognition.",
    "topics": [
      ("Syllogisms",                   "Medium", "beginner",     35, "beginner"),
      ("Blood Relations",              "Easy",   "beginner",     30, "beginner"),
      ("Direction Sense",              "Easy",   "beginner",     25, "beginner"),
      ("Coding-Decoding",              "Easy",   "beginner",     30, "beginner"),
      ("Seating Arrangements",         "Medium", "intermediate", 45, "intermediate"),
      ("Puzzles",                      "Hard",   "intermediate", 55, "intermediate"),
      ("Series Completion",            "Medium", "intermediate", 35, "intermediate"),
      ("Analogies",                    "Easy",   "intermediate", 30, "intermediate"),
      ("Venn Diagrams",                "Medium", "intermediate", 35, "intermediate"),
      ("Data Sufficiency",             "Hard",   "advanced",     45, "advanced"),
      ("Critical Reasoning",           "Hard",   "advanced",     50, "advanced"),
      ("Statement & Assumptions",      "Medium", "advanced",     40, "advanced"),
    ],
  },
  {
    "slug": "verbal", "title": "Verbal Ability",
    "icon": "📝", "category": "aptitude", "estimated_hours": 18, "order_index": 13,
    "description": "Reading comprehension, grammar, vocabulary, and sentence correction.",
    "topics": [
      ("Reading Comprehension",        "Medium", "beginner",     40, "beginner"),
      ("Grammar Basics",               "Easy",   "beginner",     30, "beginner"),
      ("Tenses & Subject-Verb Agreement","Easy", "beginner",     30, "beginner"),
      ("Vocabulary Building",          "Medium", "intermediate", 35, "intermediate"),
      ("Fill in the Blanks",           "Easy",   "intermediate", 25, "intermediate"),
      ("Sentence Correction",          "Medium", "intermediate", 35, "intermediate"),
      ("Para Jumbles",                 "Hard",   "intermediate", 45, "intermediate"),
      ("Idioms & Phrases",             "Medium", "advanced",     35, "advanced"),
      ("Error Spotting",               "Hard",   "advanced",     40, "advanced"),
      ("Cloze Test",                   "Medium", "advanced",     35, "advanced"),
    ],
  },
  {
    "slug": "hr-interview", "title": "HR Interview",
    "icon": "🤝", "category": "interview", "estimated_hours": 12, "order_index": 14,
    "description": "Common HR questions with model answers, self-introduction, and negotiation tips.",
    "topics": [
      ("Tell Me About Yourself",       "Easy",   "beginner",     30, "beginner"),
      ("Strengths & Weaknesses",       "Easy",   "beginner",     25, "beginner"),
      ("Why This Company?",            "Easy",   "beginner",     25, "beginner"),
      ("Career Goals & Aspirations",   "Medium", "beginner",     30, "beginner"),
      ("Behavioural Questions (STAR)", "Medium", "intermediate", 45, "intermediate"),
      ("Situational Questions",        "Medium", "intermediate", 40, "intermediate"),
      ("Salary & Negotiation",         "Hard",   "intermediate", 35, "intermediate"),
      ("Questions to Ask Interviewer", "Easy",   "advanced",     25, "advanced"),
    ],
  },
  {
    "slug": "tech-interview", "title": "Technical Interview",
    "icon": "💡", "category": "interview", "estimated_hours": 25, "order_index": 15,
    "description": "Coding rounds, system design interviews, and problem-solving frameworks.",
    "topics": [
      ("Interview Problem-Solving Framework","Easy",  "beginner",  30, "beginner"),
      ("Array & String Problems",      "Medium", "beginner",     50, "beginner"),
      ("Linked List Interview Qs",     "Medium", "intermediate", 50, "intermediate"),
      ("Tree & Graph Interview Qs",    "Hard",   "intermediate", 60, "intermediate"),
      ("DP Interview Patterns",        "Hard",   "intermediate", 70, "intermediate"),
      ("OS Interview Questions",       "Medium", "intermediate", 45, "intermediate"),
      ("DBMS Interview Questions",     "Medium", "intermediate", 40, "intermediate"),
      ("CN Interview Questions",       "Medium", "intermediate", 40, "intermediate"),
      ("OOP & Design Patterns Qs",     "Medium", "intermediate", 45, "intermediate"),
      ("System Design Interview",      "Hard",   "advanced",     70, "advanced"),
      ("Mock Coding Round Tips",       "Medium", "advanced",     40, "advanced"),
    ],
  },
]


def seed(reset: bool = False) -> None:
    app = create_app()
    with app.app_context():
        db.create_all()

        if reset:
            print("⚠️  Deleting existing roadmap data…")
            UserTopicProgress = __import__('models.roadmap', fromlist=['UserTopicProgress']).UserTopicProgress
            db.session.query(UserTopicProgress).delete()
            db.session.query(Topic).delete()
            db.session.query(Roadmap).delete()
            db.session.commit()
            print("   Done.")

        inserted = 0
        for rm_data in ROADMAP_DATA:
            existing = Roadmap.query.filter_by(slug=rm_data["slug"]).first()
            if existing:
                print(f"   SKIP  {rm_data['slug']} (already exists)")
                continue

            roadmap = Roadmap(
                slug=rm_data["slug"],
                title=rm_data["title"],
                description=rm_data["description"],
                icon=rm_data["icon"],
                category=rm_data["category"],
                estimated_hours=rm_data["estimated_hours"],
                order_index=rm_data["order_index"],
                is_published=True,
            )
            db.session.add(roadmap)
            db.session.flush()   # get roadmap.id before committing

            for idx, (title, diff, level, mins, _) in enumerate(rm_data["topics"]):
                topic = Topic(
                    roadmap_id=roadmap.id,
                    title=title,
                    description="",
                    difficulty=diff,
                    level=level,
                    order_index=idx,
                    estimated_minutes=mins,
                    is_published=True,
                )
                db.session.add(topic)

            db.session.commit()
            print(f"   OK    {rm_data['slug']}  ({len(rm_data['topics'])} topics)")
            inserted += 1

        total = Roadmap.query.count()
        print(f"\n✅ Seed complete — {inserted} new roadmaps inserted, {total} total.")


if __name__ == "__main__":
    seed(reset="--reset" in sys.argv)
