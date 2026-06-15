# DevBattle - Code. Compete. Conquer.

This is the repository for DevBattle, a modern competitive programming platform.

## Phase 1: Foundation Setup

Phase 1 establishes the monorepo architecture, authentication system, MongoDB connection, user profile structures, and basic frontend layouts including the Dashboard, Landing page, and Profile page.

### Folder Structure
- `backend/`: Node.js, Express, TypeScript, MongoDB
- `frontend/`: Next.js 15+, Tailwind CSS, ShadCN UI

---

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Fill in the `.env` values, especially `MONGO_URI` and `JWT_SECRET`.
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env.local` (optional, if your backend runs on a different port than 5000):
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Testing Instructions
- Make sure MongoDB is running or the Atlas cluster URI is correct.
- Open `http://localhost:3000` to see the landing page.
- Navigate to `/auth/register` and test user registration.
- After registration, you should be redirected to `/dashboard`.
- Test logging out and logging back in at `/auth/login`.

## Future Phases
- **Phase 2**: Problems Module, Admin CRUD, Problem Pages, Search, Filters
- **Phase 3**: Monaco Editor, Judge0 Execution, Submission, Verdict Engine
- **Phase 4**: Leaderboard, User Statistics
- **Phase 5**: Contest System
