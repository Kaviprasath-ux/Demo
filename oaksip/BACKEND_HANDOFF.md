# OAKSIP Backend Handoff Documentation

## Overview

This document provides the backend developer with all the information needed to replace the mock data layer with a real API.

## Current Architecture

The frontend is built with:
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Zustand** for state management
- **Three.js / React Three Fiber** for 3D training
- **Tailwind CSS + shadcn/ui** for styling

All data is currently mocked in `lib/mock-data.ts` and state is managed in `lib/store.ts`.

---

## User Roles

```typescript
type UserRole = 'admin' | 'instructor' | 'trainee';
```

### Role Permissions

| Feature | Admin | Instructor | Trainee |
|---------|-------|------------|---------|
| Dashboard | ✅ | ✅ | ✅ |
| Knowledge Search | ✅ | ✅ | ✅ |
| Quiz | ✅ | ✅ | ✅ |
| 3D Training | ✅ | ✅ | ✅ |
| Simulator Intel | ✅ | ✅ | ✅ |
| Documents | ✅ | ✅ | ❌ |
| Audit Logs | ✅ | ❌ | ❌ |
| Training Mode: Instructor | ✅ | ✅ | ❌ |

---

## API Endpoints Required

### Authentication

#### `POST /api/auth/login`
Authenticate user with credentials.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "USR001",
    "name": "Col. Rajesh Kumar",
    "role": "admin",
    "unit": "School of Artillery, Deolali"
  },
  "token": "jwt_token_here"
}
```

#### `POST /api/auth/logout`
Invalidate user session.

#### `GET /api/auth/me`
Get current authenticated user.

---

### Knowledge Search

#### `POST /api/search`
Search the knowledge base.

**Request:**
```json
{
  "query": "Range of 155mm gun"
}
```

**Response:**
```json
{
  "answer": "The 155mm gun has a maximum range of...",
  "sources": [
    { "document": "Artillery_Field_Manual.pdf", "page": 45 },
    { "document": "Dhanush_Technical_Specs.pdf", "page": 12 }
  ],
  "confidence": 0.95
}
```

#### `GET /api/queries?userId={userId}`
Get recent queries for a user.

**Response:**
```json
{
  "queries": [
    {
      "id": "Q001",
      "query": "What is the range of 155mm gun?",
      "result": { /* QueryResult */ },
      "timestamp": "2024-01-15T10:30:00Z",
      "userId": "USR001"
    }
  ]
}
```

---

### Documents

#### `GET /api/documents`
Get all indexed documents.

**Response:**
```json
{
  "documents": [
    {
      "id": 1,
      "name": "Artillery Field Manual",
      "type": "PDF",
      "pages": 342,
      "category": "Doctrine",
      "uploadedAt": "2024-01-15T00:00:00Z",
      "size": "24.5 MB"
    }
  ]
}
```

#### `POST /api/documents/upload`
Upload a new document (admin/instructor only).

---

### User Stats

#### `GET /api/users/{userId}/stats`
Get stats for a specific user.

**Response:**
```json
{
  "queriesThisMonth": 45,
  "quizzesTaken": 12,
  "avgQuizScore": 92,
  "trainingSessionsCompleted": 8,
  "lastActiveDate": "2024-01-15T10:30:00Z"
}
```

---

### System Stats (Admin Only)

#### `GET /api/admin/stats`
Get system-wide statistics.

**Response:**
```json
{
  "totalQueries": 1247,
  "documentsIndexed": 156,
  "simulatorSessions": 89,
  "activeUsers": 34,
  "queryTrend": 12,
  "sessionTrend": 8
}
```

---

### Simulator

#### `GET /api/simulator/stats`
Get simulator statistics.

**Response:**
```json
{
  "totalExercises": 1247,
  "avgAccuracy": 78.5,
  "totalParticipants": 3456,
  "commonErrors": ["Elevation miscalculation", "..."],
  "exercisesByMonth": [
    { "month": "Aug", "count": 145 }
  ],
  "accuracyTrend": [
    { "date": "Aug", "accuracy": 72.3 }
  ]
}
```

#### `GET /api/simulator/exercises`
Get recent simulator exercises.

---

### Audit Logs (Admin Only)

#### `GET /api/audit`
Get audit logs.

**Query Params:**
- `page` (default: 1)
- `limit` (default: 50)
- `userId` (optional filter)
- `action` (optional filter)

**Response:**
```json
{
  "logs": [
    {
      "id": "AUD001",
      "userId": "USR001",
      "userName": "Col. Rajesh Kumar",
      "action": "QUERY",
      "query": "Range of 155mm gun",
      "timestamp": "2024-01-15T10:30:00Z",
      "ip": "10.0.1.45"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50
}
```

---

### Quiz

#### `GET /api/quiz/questions`
Get quiz questions.

**Query Params:**
- `category` (optional: "all", "General", "Components", "Safety", etc.)
- `difficulty` (optional: "all", "easy", "medium", "hard")
- `count` (default: 10)

**Response:**
```json
{
  "questions": [
    {
      "id": "e1",
      "question": "What is the caliber of the standard Indian Army field gun?",
      "options": ["105mm", "130mm", "155mm", "175mm"],
      "correctIndex": 2,
      "explanation": "The 155mm is the standard caliber...",
      "difficulty": "easy",
      "category": "General"
    }
  ]
}
```

#### `POST /api/quiz/submit`
Submit quiz attempt.

**Request:**
```json
{
  "userId": "USR001",
  "answers": [2, 1, 0, 3, 1],
  "questionIds": ["e1", "e2", "e3", "e4", "e5"],
  "timeSpent": 300
}
```

**Response:**
```json
{
  "score": 4,
  "totalQuestions": 5,
  "percentage": 80,
  "attemptId": "attempt-123"
}
```

#### `GET /api/quiz/attempts?userId={userId}`
Get user's quiz history.

---

### Training Sessions

#### `POST /api/training/start`
Start a training session.

**Request:**
```json
{
  "userId": "USR001",
  "mode": "cadet",
  "drill": "loading"
}
```

#### `POST /api/training/complete`
Complete a training session.

**Request:**
```json
{
  "sessionId": "session-123",
  "score": 85,
  "timeSpent": 300,
  "errors": 2
}
```

---

## TypeScript Interfaces

All interfaces are defined in `types/index.ts`:

```typescript
interface User {
  id: string;
  name: string;
  role: 'admin' | 'instructor' | 'trainee';
  unit: string;
}

interface Query {
  id: string;
  query: string;
  result: QueryResult;
  timestamp: Date;
  userId: string;
}

interface QueryResult {
  answer: string;
  sources: Source[];
  confidence: number;
}

interface Source {
  document: string;
  page: number;
}

interface Document {
  id: number;
  name: string;
  type: string;
  pages: number;
  category: string;
  uploadedAt: Date;
  size: string;
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  query?: string;
  timestamp: Date;
  ip: string;
}
```

---

## Files to Modify

When integrating the backend:

1. **`lib/store.ts`** - Replace mock API calls with actual fetch calls
2. **`lib/mock-data.ts`** - Can be removed after API integration
3. **`lib/quiz-store.ts`** - Replace hardcoded questions with API fetch

---

## Environment Variables

Add these to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## Authentication Flow

1. User enters credentials on `/login`
2. Frontend calls `POST /api/auth/login`
3. Backend returns JWT token + user object
4. Token stored in localStorage (consider httpOnly cookies for production)
5. Token sent with every request in `Authorization: Bearer <token>` header
6. Backend validates token and returns user-specific data

---

## Offline Support

The app is designed to work offline. Consider:

1. **IndexedDB** for caching documents and search results
2. **Service Worker** for offline page serving
3. **Sync queue** for submitting quiz results when back online

---

## Security Considerations

1. Implement rate limiting on all endpoints
2. Validate user roles server-side for every request
3. Sanitize search queries to prevent injection
4. Audit log all sensitive operations
5. Use HTTPS in production
6. Implement CORS properly

---

## Contact

For questions about the frontend implementation, refer to the codebase or contact the frontend team.
