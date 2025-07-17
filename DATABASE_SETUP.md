# Database Setup Guide

This application uses [Neon](https://neon.tech) as the PostgreSQL database with Drizzle ORM for type-safe database operations.

## Prerequisites

- Node.js 18+ installed
- A Neon account (free tier available)

## Setup Steps

### 1. Create a Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up/sign in
2. Create a new project
3. Note down your connection string from the dashboard

### 2. Environment Configuration

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Neon connection string:
   ```
   DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate and Run Migrations

```bash
# Generate migration files based on schema
npm run db:generate

# Push migrations to your database
npm run db:push

# (Optional) Open Drizzle Studio to view your database
npm run db:studio
```

### 5. Development Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Database Schema

The application uses two main tables:

### `activity_uploads`

- Stores metadata about CSV uploads
- Fields: id, fileName, uploadedAt, totalActivities, description

### `activities`

- Stores individual activity records from CSV uploads
- Fields: id, uploadId, name, category, price, votes, scores, links, timestamps

## Usage

1. **Upload CSV**: Use the admin panel to upload activity data
2. **View Data**: The dashboard automatically loads the latest uploaded activities
3. **Analytics**: All analytics are computed from the latest dataset

## Database Operations

The app includes several key operations:

- `createActivityUpload()` - Create new upload record
- `insertActivityBatch()` - Bulk insert activities
- `getLatestActivities()` - Get activities from most recent upload
- `getAllActivities()` - Get all activities across uploads
- Various analytics queries for stats, categories, etc.

## TanStack Query Integration

The app uses TanStack Query for:

- Automatic background refetching
- Caching and synchronization
- Loading and error states
- Optimistic updates

Key hooks:

- `useActivities(latest?)` - Fetch activities
- `useUploadActivities()` - Upload new CSV data

## Zustand Store

The Zustand store provides computed analytics from the database data:

- Category statistics
- Budget analysis
- Group dynamics
- Voting patterns
- Score distributions

## Development Tips

1. Use `npm run db:studio` to visually inspect your database
2. The app automatically syncs database data with the Zustand store
3. All uploads create new records - old data is preserved for trend analysis
4. CSV format validation happens on both client and server side

## Production Deployment

1. Ensure DATABASE_URL is set in your production environment
2. Run migrations during deployment:
   ```bash
   npm run db:push
   ```
3. Neon automatically handles connection pooling and scaling

## Troubleshooting

- **Connection issues**: Verify DATABASE_URL format and Neon project status
- **Migration errors**: Check schema changes and run `npm run db:generate`
- **Type errors**: Regenerate types with `npm run db:generate`
- **Upload failures**: Check CSV format matches expected schema
