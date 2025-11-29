# Budget OK Web Frontend

## Project Overview
Budget OK is a personal budget management web application. The frontend is a React + TypeScript web application that allows users to manage budgets through an envelope-based system.

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management & Data Fetching**: TanStack React Query (v5)
- **UI Library**: Ant Design (antd)
- **HTTP Client**: Axios
- **Linting**: ESLint with TypeScript support

## Key Features
- **Envelope Management**: Create, edit, and delete budget envelopes
- **Expense Tracking**: Log expenses against envelopes
- **API Integration**: RESTful API communication with backend

## Project Structure
```
frontend/
├── src/
│   ├── api/              # API client functions and DTOs
│   ├── components/       # React components
│   │   ├── CreateEnvelopeForm
│   │   ├── EditEnvelopeForm
│   │   ├── EnvelopesTable
│   │   └── Expenses
│   ├── hooks/            # Custom React hooks
│   ├── App.tsx
│   └── main.tsx
├── public/
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Development Notes
- The project recently moved from `budget-ok-frontend-web` to `frontend` directory
- Uses envelope-based budgeting model where expenses are tracked within envelopes

## Git Guidelines
See [GIT_GUIDELINES.md](./.claude/GIT_GUIDELINES.md) for detailed commit standards.

**Summary:**
- Use [Conventional Commits](https://www.conventionalcommits.org/) format: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- Always request permission before committing
- Verify tests pass and follow project conventions before committing
