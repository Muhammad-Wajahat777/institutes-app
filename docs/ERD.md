# Institute App ERD

This file documents the current table relationships used by the app code.

## Mermaid ERD

```mermaid
erDiagram
  TEACHERS ||--o{ COURSES : "teacher_id -> id"
  COURSES ||--o{ STUDENTS : "course_id -> id"
  STUDENTS ||--o{ FEES : "student_id -> id"

  SETTINGS {
    id PK
  }
  ROLES {
    id PK
  }
  STATS {
    id PK
  }
  NOTIFICATIONS {
    id PK
  }
```

## Relation Notes

1. Courses depends on Teachers through teacher_id.
2. Students depends on Courses through course_id.
3. Fees depends on Students through student_id.
4. Settings, Roles, Stats, and Notifications currently appear standalone in app-level usage.

## Safe Data Creation Order

1. teachers
2. courses
3. students
4. fees
