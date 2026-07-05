"""
migrations/seed_all.py — Seed problems, aptitude, companies, interview questions, resources.
Run: .\\venv\\Scripts\\python.exe migrations/seed_all.py
     .\\venv\\Scripts\\python.exe migrations/seed_all.py --reset
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database import db
from models.practice  import Problem
from models.aptitude  import AptitudeQuestion
from models.company   import Company
from models.interview import InterviewQuestion
from models.resource  import Resource

# ── Problems ──────────────────────────────────────────────────────────────────
PROBLEMS = [
    ("Two Sum",                 "arrays",         "Easy",   "TCS,Amazon"),
    ("Best Time to Buy Stock",  "arrays",         "Easy",   "Amazon"),
    ("Merge Sorted Array",      "arrays",         "Easy",   "Infosys"),
    ("Maximum Subarray",        "arrays",         "Medium", "Microsoft,Amazon"),
    ("Rotate Array",            "arrays",         "Medium", "TCS"),
    ("Find Duplicate Number",   "arrays",         "Medium", "Amazon"),
    ("Longest Subarray K Sum",  "arrays",         "Hard",   "Zoho"),
    ("Valid Anagram",           "strings",        "Easy",   "TCS"),
    ("Reverse String",          "strings",        "Easy",   "Infosys"),
    ("Longest Common Prefix",   "strings",        "Easy",   "Wipro"),
    ("Longest Substring No Repeat","strings",     "Medium", "Amazon,Google"),
    ("Palindrome Check",        "strings",        "Easy",   "TCS"),
    ("String Compression",      "strings",        "Medium", "Microsoft"),
    ("Reverse Linked List",     "linked-list",    "Easy",   "TCS,Infosys"),
    ("Detect Cycle in List",    "linked-list",    "Medium", "Amazon"),
    ("Merge Two Sorted Lists",  "linked-list",    "Easy",   "Wipro"),
    ("LRU Cache",               "linked-list",    "Hard",   "Amazon,Google"),
    ("Inorder Traversal",       "trees",          "Easy",   "TCS"),
    ("Level Order Traversal",   "trees",          "Medium", "Amazon"),
    ("Lowest Common Ancestor",  "trees",          "Medium", "Google"),
    ("Validate BST",            "trees",          "Medium", "Microsoft"),
    ("Max Depth of Tree",       "trees",          "Easy",   "Infosys"),
    ("Number of Islands",       "graphs",         "Medium", "Amazon,Google"),
    ("BFS Shortest Path",       "graphs",         "Medium", "Microsoft"),
    ("Detect Cycle in Graph",   "graphs",         "Medium", "Zoho"),
    ("Topological Sort",        "graphs",         "Hard",   "Google"),
    ("Valid Parentheses",       "stacks",         "Easy",   "TCS,Amazon"),
    ("Min Stack",               "stacks",         "Medium", "Amazon"),
    ("Largest Rectangle Histogram","stacks",      "Hard",   "Amazon"),
    ("Binary Search",           "binary-search",  "Easy",   "Infosys"),
    ("Search in Rotated Array", "binary-search",  "Medium", "Amazon,Google"),
    ("Find Peak Element",       "binary-search",  "Medium", "Microsoft"),
    ("Coin Change",             "dp",             "Medium", "Amazon"),
    ("Climbing Stairs",         "dp",             "Easy",   "TCS"),
    ("Longest Common Subsequence","dp",           "Medium", "Google"),
    ("0/1 Knapsack",            "dp",             "Medium", "Zoho"),
    ("Word Break",              "dp",             "Hard",   "Google,Amazon"),
    ("N-Queens",                "backtracking",   "Hard",   "Google"),
    ("Combination Sum",         "backtracking",   "Medium", "Amazon"),
    ("Subsets",                 "backtracking",   "Medium", "Microsoft"),
]

APTITUDE_QUESTIONS = [
    # (category, topic, difficulty, question, a, b, c, d, correct, explanation)
    ("quant","Percentages","Easy","What is 20% of 500?","100","80","120","90","A","20/100 × 500 = 100"),
    ("quant","Percentages","Easy","A price increased from 200 to 250. % increase?","20%","25%","30%","15%","B","(50/200)×100 = 25%"),
    ("quant","Time & Work","Medium","A can do work in 10 days, B in 15. Together?","5 days","6 days","8 days","4 days","B","Combined rate = 1/10+1/15 = 1/6"),
    ("quant","Time & Work","Medium","A does half the work in 6 days. Total days alone?","6","12","10","8","B","Full work = 12 days"),
    ("quant","Profit & Loss","Easy","Cost 80, Sell 100. Profit%?","20%","25%","15%","30%","B","(20/80)×100 = 25%"),
    ("quant","Time Speed Distance","Medium","Train 60km/h covers 120km. Time taken?","1h","2h","3h","1.5h","B","120/60 = 2 hours"),
    ("quant","Number System","Easy","LCM of 4 and 6?","12","24","8","6","A","LCM(4,6) = 12"),
    ("quant","Number System","Easy","HCF of 12 and 18?","6","3","9","12","A","HCF(12,18) = 6"),
    ("quant","Ratio & Proportion","Easy","Ratio 3:4 total 35. Larger part?","20","15","21","18","A","4/7 × 35 = 20"),
    ("quant","Simple Interest","Medium","P=1000, R=5%, T=3. SI?","150","100","200","175","A","SI = (1000×5×3)/100 = 150"),
    ("logical","Blood Relations","Easy","A is B's father. C is A's sister. C is B's?","Aunt","Mother","Grandmother","Sister","A","Sister of father = aunt"),
    ("logical","Direction Sense","Easy","Facing North, turn right. Now facing?","East","West","South","North","A","Right from North = East"),
    ("logical","Syllogisms","Medium","All cats are animals. All animals are living. Conclusion?","All cats are living","No cats are living","Some cats not living","None","A","All cats → animals → living"),
    ("logical","Coding-Decoding","Easy","If CAT=3120, DOG=?","4157","4167","3157","4047","A","Sum of positions: D=4,O=15,G=7"),
    ("logical","Seating Arrangement","Medium","5 people in row, A not at ends. A can sit at?","Position 2,3,4","Position 1,5","Only 3","Any","A","Not ends means middle 3"),
    ("logical","Series","Easy","2, 4, 8, 16, ?","32","30","36","28","A","Each term doubles"),
    ("verbal","Grammar","Easy","He ___ (go) to school yesterday.","went","goes","going","go","A","Past tense of go = went"),
    ("verbal","Vocabulary","Easy","Antonym of BRAVE?","Coward","Bold","Fearless","Daring","A","Opposite of brave is coward"),
    ("verbal","Reading Comprehension","Medium","The cat sat on the mat. Subject?","The cat","sat","mat","on","A","Subject = who is performing the action"),
    ("verbal","Sentence Correction","Medium","She don't know the answer. Correct form?","doesn't know","don't knows","didn't knows","do not knows","A","Third person singular = doesn't"),
]

COMPANIES = [
    ("Google",        "google",        "product",  "Hard",   "GO",  5, "SWE,SDE,MLE",            "8-20 LPA", 0,
     "3 tech screens + System Design + Behavioral",
     "DSA,System Design,Algorithms,OOP"),
    ("Microsoft",     "microsoft",     "product",  "Hard",   "MS",  4, "SDE,SE",                  "10-20 LPA", 0,
     "Online Test + 4 tech rounds",
     "DSA,System Design,OOP,C++/Java"),
    ("Amazon",        "amazon",        "product",  "Hard",   "AM",  5, "SDE,MLE",                 "12-25 LPA", 0,
     "Online Test + 4 rounds (LP + DSA + SD)",
     "DSA,Leadership Principles,System Design"),
    ("Zoho",          "zoho",          "product",  "Medium", "ZO",  3, "SE,Dev",                  "4-8 LPA",  0,
     "Written Test + Technical + HR",
     "DSA,Coding,SQL,Problem Solving"),
    ("Freshworks",    "freshworks",    "startup",  "Medium", "FW",  3, "SDE,Dev",                 "6-12 LPA", 0,
     "Online Test + 2 tech rounds + HR",
     "DSA,Web Dev,SQL,OOP"),
    ("JPMorgan",      "jpmorgan",      "finance",  "Medium", "JP",  4, "Tech Analyst,SDE",        "8-15 LPA", 0,
     "Aptitude + 2 tech + HR",
     "DSA,SQL,Aptitude,Finance Basics"),
    ("Deloitte",      "deloitte",      "finance",  "Medium", "DE",  3, "Analyst,Consultant",      "4-8 LPA",  0,
     "Aptitude + GD + HR",
     "Aptitude,Verbal,Logical"),
    ("TCS",           "tcs",           "service",  "Easy",   "TC",  2, "ASE,NQT",                 "3.5-4 LPA", 2,
     "NQT (Aptitude) + Technical + HR",
     "Aptitude,Logical,Verbal,Basic Coding"),
    ("Infosys",       "infosys",       "service",  "Easy",   "IN",  2, "SE,Systems Engineer",     "3.5-5 LPA", 0,
     "Online Test + Technical + HR",
     "Aptitude,Logical,Verbal,Coding"),
    ("Wipro",         "wipro",         "service",  "Easy",   "WI",  2, "Project Engineer",        "3.5-4 LPA", 0,
     "NLTH Test + Technical + HR",
     "Aptitude,Verbal,Basic Coding"),
    ("Accenture",     "accenture",     "service",  "Easy",   "AC",  2, "ASE,ACE",                 "4-5 LPA",  0,
     "Cognitive + Technical + HR",
     "Aptitude,Verbal,Logical"),
    ("Cognizant",     "cognizant",     "service",  "Easy",   "CG",  2, "PEG,GET",                 "4-4.5 LPA",0,
     "GenC Test + Technical + HR",
     "Aptitude,English,Basic Coding"),
    ("Capgemini",     "capgemini",     "service",  "Easy",   "CA",  2, "Analyst",                 "3.5-4 LPA", 0,
     "Game Test + Technical + HR",
     "Aptitude,Logical,Coding"),
    ("HCL",           "hcl",           "service",  "Easy",   "HC",  2, "Grad Trainee",            "3.5-4 LPA", 0,
     "Aptitude + Technical + HR",
     "Aptitude,Basic Coding,Communication"),
    ("Tech Mahindra", "tech-mahindra", "service",  "Easy",   "TM",  2, "GET,Associate",           "3.5-4 LPA", 0,
     "AMCAT + Technical + HR",
     "Aptitude,Verbal,Coding"),
    ("EY",            "ey",            "finance",  "Medium", "EY",  3, "Analyst,Consultant",      "5-8 LPA",  0,
     "Aptitude + GD + HR",
     "Aptitude,Verbal,Logical,Case Study"),
]

INTERVIEW_QUESTIONS = [
    ("hr","Introduction","Tell me about yourself.","Start with education, then skills, projects, and goals. Keep it under 2 minutes.","Practice the PAST-PRESENT-FUTURE framework.",None,True),
    ("hr","Strengths","What are your key strengths?","Pick 2-3 strengths relevant to the role with examples.","Use STAR method for examples.",None,True),
    ("hr","Weaknesses","What is your greatest weakness?","Be honest but choose a weakness you're actively improving.","Never say 'I have no weaknesses'.",None,True),
    ("hr","Goals","Where do you see yourself in 5 years?","Show ambition aligned with the company's growth.","Research the company's growth trajectory.",None,False),
    ("hr","Motivation","Why do you want to join our company?","Show genuine research about the company's products, culture, and values.","Mention specific products or initiatives you admire.",None,True),
    ("hr","Negotiation","What are your salary expectations?","Research market rates, give a range based on your skills.","Know your worth — use sites like Glassdoor, LinkedIn.",None,False),
    ("technical","OS","What is the difference between process and thread?","Process: independent execution unit with its own memory. Thread: lightweight subprocess sharing parent's memory.","Draw a diagram if on whiteboard.",None,True),
    ("technical","DBMS","Explain normalization up to 3NF.","1NF: atomic values. 2NF: no partial dependency. 3NF: no transitive dependency.","Give a table example for each form.",None,True),
    ("technical","OOP","What are the 4 pillars of OOP?","Encapsulation, Abstraction, Inheritance, Polymorphism.","Give real-world examples for each.",None,True),
    ("technical","CN","What is TCP vs UDP?","TCP: reliable, ordered, connection-based. UDP: fast, connectionless, no guarantee.","Mention use cases: TCP for HTTP, UDP for video streaming.",None,True),
    ("technical","DSA","Explain time complexity of sorting algorithms.","Bubble/Selection/Insertion: O(n²). Merge/Heap: O(n log n). Quick: avg O(n log n).","Always mention best/average/worst cases.",None,True),
    ("behavioral","Problem Solving","Describe a challenge you overcame.","Use STAR: Situation, Task, Action, Result.","Pick a technical challenge from a project.",None,False),
    ("behavioral","Teamwork","Tell me about working in a team.","Describe a successful team project, your role, and contribution.","Highlight collaboration and communication.",None,False),
]

RESOURCES = [
    ("video","DSA","Arrays - Complete Tutorial","https://www.youtube.com/watch?v=array","Master array operations","YouTube"),
    ("video","DSA","Linked List Full Course","https://www.youtube.com/watch?v=ll","Linked list concepts","YouTube"),
    ("video","DSA","Binary Tree & BST","https://www.youtube.com/watch?v=tree","Tree traversals","YouTube"),
    ("video","DSA","Graph Algorithms","https://www.youtube.com/watch?v=graph","BFS, DFS, Dijkstra","YouTube"),
    ("video","DSA","Dynamic Programming","https://www.youtube.com/watch?v=dp","DP patterns","YouTube"),
    ("notes","DSA","DSA Cheat Sheet","https://drive.google.com/dsa-cheat","Quick reference for all DSA topics","Community"),
    ("notes","OS","OS Concepts Notes","https://drive.google.com/os-notes","Complete OS notes for interviews","Handmade"),
    ("notes","DBMS","DBMS Interview Notes","https://drive.google.com/dbms","All DBMS concepts summarized","Handmade"),
    ("notes","CN","Computer Networks Notes","https://drive.google.com/cn","OSI, TCP/IP, protocols","Handmade"),
    ("link","DSA","LeetCode","https://leetcode.com","Practice DSA problems","LeetCode"),
    ("link","DSA","GeeksForGeeks DSA","https://geeksforgeeks.org/dsa","Articles + problems","GeeksForGeeks"),
    ("link","Aptitude","IndiaBix","https://indiabix.com","Aptitude practice","IndiaBix"),
    ("link","Interview","InterviewBit","https://interviewbit.com","Interview prep roadmaps","InterviewBit"),
    ("pdf","System Design","System Design Primer","https://github.com/donnemartin/system-design-primer","Comprehensive system design guide","GitHub"),
    ("cheatsheet","Python","Python Quick Reference","https://quickref.me/python","Python syntax cheatsheet","QuickRef"),
    ("cheatsheet","SQL","SQL Cheatsheet","https://www.sqltutorial.org/sql-cheat-sheet/","All SQL commands","SQLTutorial"),
]


def seed(reset: bool = False):
    app = create_app()
    with app.app_context():
        db.create_all()
        if reset:
            print("⚠️  Resetting seed data...")
            for model in [Resource, InterviewQuestion, Company, AptitudeQuestion, Problem]:
                db.session.query(model).delete()
            db.session.commit()

        # Problems
        count = 0
        for i, (title, topic, diff, companies) in enumerate(PROBLEMS):
            slug = title.lower().replace(" ", "-").replace("/", "-")
            if not Problem.query.filter_by(slug=slug).first():
                db.session.add(Problem(
                    title=title, slug=slug, topic=topic, difficulty=diff,
                    description=f"Given a problem related to {topic}: {title}. Solve it efficiently.",
                    companies=companies, order_index=i, is_published=True
                ))
                count += 1
        db.session.commit()
        print(f"   OK  Problems: {count} inserted")

        # Aptitude
        count = 0
        for i, (cat, topic, diff, q, a, b, c, d, correct, exp) in enumerate(APTITUDE_QUESTIONS):
            if not AptitudeQuestion.query.filter_by(question=q).first():
                db.session.add(AptitudeQuestion(
                    category=cat, topic=topic, difficulty=diff, question=q,
                    option_a=a, option_b=b, option_c=c, option_d=d,
                    correct=correct, explanation=exp, order_index=i
                ))
                count += 1
        db.session.commit()
        print(f"   OK  Aptitude: {count} inserted")

        # Companies
        count = 0
        for i, (name, slug, ctype, diff, abbr, rounds, roles, ctc, bond, process, skills) in enumerate(COMPANIES):
            if not Company.query.filter_by(slug=slug).first():
                db.session.add(Company(
                    name=name, slug=slug, type=ctype, difficulty=diff, logo_abbr=abbr,
                    interview_rounds=rounds, roles=roles, ctc_range=ctc, bond_years=bond,
                    hiring_process=process, required_skills=skills, order_index=i
                ))
                count += 1
        db.session.commit()
        print(f"   OK  Companies: {count} inserted")

        # Interview questions
        count = 0
        for i, (cat, topic, q, ans, tips, company, starred) in enumerate(INTERVIEW_QUESTIONS):
            if not InterviewQuestion.query.filter_by(question=q).first():
                db.session.add(InterviewQuestion(
                    category=cat, topic=topic, question=q, model_answer=ans,
                    tips=tips, company_name=company, is_starred=starred, order_index=i
                ))
                count += 1
        db.session.commit()
        print(f"   OK  Interview Qs: {count} inserted")

        # Resources
        count = 0
        for i, (rtype, topic, title, url, desc, source) in enumerate(RESOURCES):
            if not Resource.query.filter_by(url=url).first():
                db.session.add(Resource(
                    type=rtype, topic=topic, title=title, url=url,
                    description=desc, source=source, order_index=i
                ))
                count += 1
        db.session.commit()
        print(f"   OK  Resources: {count} inserted")

        print("\n✅ Seed complete.")


if __name__ == "__main__":
    seed(reset="--reset" in sys.argv)
