# MentorConnect (Prototype)

A modern student–alumni mentorship prototype built with Vite + React + Tailwind.

## Features
- Landing page with hero
- Student and Mentor dashboards
- Mentor matching with filters and simple scoring
- Mentor profile with Request button (in-memory state)
- Messaging UI (local, placeholder)
- Goals with milestones and progress bar

## Tech
- React 18 + Vite
- TailwindCSS
- React Router

## Run locally
```bash
npm install
npm run dev
```
Then open the local URL printed by Vite.

## Notes
- All data is mocked in `src/data` and state lives in `AppContext`.
- Tailwind warnings in editors are expected until the dev server compiles PostCSS.
