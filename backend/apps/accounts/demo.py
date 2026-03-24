from .models import User


DEMO_USERS = [
    {
        "name": "Demo Admin",
        "email": "admin@university.edu",
        "password": "password123",
        "role": "admin",
        "roll_no": "ADMIN001",
        "department": "Administration",
        "semester": "0",
        "division": "7",
        "batch": "ADMIN",
    },
    {
        "name": "Demo Student",
        "email": "student@university.edu",
        "password": "password123",
        "role": "student",
        "roll_no": "23BCP000",
        "department": "Computer Engineering",
        "semester": "6",
        "division": "7",
        "batch": "G13",
    },
    {
        "name": "Demo Teacher",
        "email": "faculty.teacher@university.edu",
        "password": "password123",
        "role": "teacher",
        "roll_no": "FAC7001",
        "department": "Computer Engineering",
        "semester": "Faculty",
        "division": "7",
        "batch": "G13",
    },
]


def ensure_demo_users():
    for payload in DEMO_USERS:
        user = User.objects(email=payload["email"]).first()
        if user:
            continue
        user = User(
            name=payload["name"],
            email=payload["email"],
            role=payload["role"],
            roll_no=payload["roll_no"],
            department=payload["department"],
            semester=payload["semester"],
            division=payload.get("division", ""),
            batch=payload.get("batch", ""),
        )
        user.set_password(payload["password"])
        user.save()
