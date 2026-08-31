# Smart India Internal Hackathon - Registration Portal

A brutalist registration website for the Smart India Internal Hackathon at Vemana Institute of Technology.

## Event Details
- **Event**: Smart India Internal Hackathon
- **Institution**: Vemana Institute of Technology
- **Date**: 3 September 2026
- **Last Date to Apply**: 2 September 2026
- **Team Size**: 6 students
- **Requirement**: At least 1 female student per team
- **Registration**: Free

## Tech Stack
- **Next.js 14** (App Router) with **TypeScript**
- **Tailwind CSS** (brutalist design)
- **Prisma ORM** with **SQLite** (zero-config database)
- **Zod** for validation
- **React Hook Form** patterns
- **xlsx** for Excel export

## Features

### Public
- Brutalist registration form with hard offset shadows, thick borders, bold typography
- 6 student sections (Student 01 is team leader)
- Real-time progress bar
- Real-time female-member requirement indicator
- Full client-side + server-side validation
- Unique Registration ID generation (e.g., `SIH-LX9K2AB4CD`)
- Success page with print/download
- Mobile responsive

### Admin
- Password-protected (`/admin`)
- View all registered teams
- Search by team name, student name, USN, phone, or email
- Filter by department
- Filter by gender-requirement status
- Stats dashboard
- Export to CSV or Excel
- View individual registration
- Copy registration ID
- Delete registration

## Setup

```bash
# Install dependencies
npm install

# Generate Prisma client and create database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Visit:
- **Public**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Default admin password**: `sih2026admin` (change in `.env`)

## Environment Variables

```
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="sih2026admin"
```

## Build for Production

```bash
npm run build
npm start
```

## Database Reset

```bash
rm prisma/dev.db
npx prisma db push
```

## Design Notes
- White background, black text, thick 3-4px borders
- Hard offset shadows (6px 6px 0px #000)
- Purple (#6B21A8) and orange (#EA580C) as accent colors
- No gradients, no glassmorphism, no animations
- Large bold typography
- Sharp rectangular elements
