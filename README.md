# Learning Management System (LMS)

Learning Management System is a web-based platform for managing educational content, tracking student progress, and organizing learning workflows.

The system is designed to support online courses, assignments, assessments, and user role management.

---

## Overview

The platform provides:

- Course creation and management  
- User registration and role-based access  
- Lesson and material delivery  
- Assignment submission and grading  
- Progress tracking and reporting  

The system supports structured learning processes for students and instructors.

---

## Technology Stack

- Python (FastAPI)  
- PostgreSQL  
- SQLAlchemy (Async)  
- REST API  
- Optional frontend (HTML/JS or modern framework)

Optional:

- WebSocket for real-time updates  
- Background tasks for notifications  

---

## Core Entities

### User

- id  
- full_name  
- email  
- role (student, instructor, admin)  
- created_at  

### Course

- id  
- title  
- description  
- instructor_id  
- created_at  

### Lesson

- id  
- course_id  
- title  
- content  
- order  

### Assignment

- id  
- course_id  
- lesson_id  
- title  
- description  
- deadline  

### Submission

- id  
- assignment_id  
- student_id  
- file_url or text_answer  
- grade  
- submitted_at  

---

## Business Logic Flow

1. Instructor creates a course  
2. Lessons and assignments are added to the course  
3. Students enroll in the course  
4. Students complete lessons and submit assignments  
5. Instructors review submissions and assign grades  
6. Progress is tracked per student and course  

---

## API Examples

### Create course
