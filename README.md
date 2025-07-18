# 🗳️ Troupe Activity Dashboard

> **Transform group decision-making with data-driven activity insights**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.7-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Neon](https://img.shields.io/badge/Database-Neon_PostgreSQL-00D9FF?style=flat-square&logo=postgresql)](https://neon.tech)
[![Drizzle](https://img.shields.io/badge/ORM-Drizzle-C5F74F?style=flat-square)](https://orm.drizzle.team)

Troupe Activity Dashboard is a modern web platform designed to make group trip planning and activity selection easy, transparent, and data-driven. It empowers trip planners, event organizers, and decision makers to:

## ✨ Features

- **📊 Interactive Dashboard** - Comprehensive analytics and visualizations
- **📁 CSV Upload** - Easy data import with validation
- **🗄️ Database Integration** - Persistent storage with Neon PostgreSQL
- **🔄 Real-time Sync** - TanStack Query for automatic data synchronization
- **📈 Advanced Analytics** - Category stats, voting patterns, and budget analysis
- **📱 Responsive Design** - Works seamlessly on all devices
- **🎨 Modern UI** - Built with Tailwind CSS and Radix UI components

## 🎯 What is this?

Troupe Scraper Web is a **data visualization dashboard** that turns raw activity voting data into actionable insights. Whether you're planning a group trip, organizing team events, or making collective decisions, this tool helps you:

- **Understand group preferences** through comprehensive voting analysis
- **Identify consensus and controversy** across different activities
- **Make budget-conscious decisions** with price-range breakdowns
- **Visualize trends** with interactive charts and metrics

## ⚙️ How It Works

1. **CSV Upload**: Easily import your group's activity data. The system checks for errors and guides you on the required format.
2. **Dashboard & Analytics**: Instantly see top activities, category performance, voting distribution, and budget analysis. All charts and tables update in real time.
3. **Admin Tools**: Log in securely to access the admin dashboard, upload new data, change your password, and manage category icons. All admin actions are protected by rate limiting and authentication.
4. **Custom Branding**: Add your own icons and visual touches to categories for a personalized look.
5. **API Integrations**: All data flows through secure, well-documented API routes for uploads, analytics, authentication, and admin actions.

## 🚀 Why use it?

### For Trip Planners

- See which activities have the strongest group support
- Identify budget sweet spots that maximize satisfaction
- Spot controversial choices before making bookings

### For Event Organizers

- Understand what types of activities resonate with your group
- Balance diverse preferences with data-driven compromises
- Track engagement levels across different categories

### For Decision Makers

- Replace guesswork with concrete voting metrics
- Visualize complex group dynamics at a glance
- Build consensus around data everyone can see

## ✨ Key Features

### 📊 **Smart Analytics**

- **Upload and manage activity data** via simple CSV files, with instant validation and feedback.
- **Analyze voting patterns** to spot consensus, controversy, and budget sweet spots.
- **Access advanced analytics** for deeper insights into group dynamics, category leaders, and spending trends.
- **Activity Scoring**: Weighted algorithm (Love: +2, Like: +1, Pass: -1)
- **Category Performance**: Compare different activity types
- **Budget Analysis**: Find the best value activities per price range
- **Group Dynamics**: Identify consensus builders vs. controversial picks

### 📈 **Visual Insights**

- **Visualize group preferences** using interactive charts, top activity lists, and category breakdowns.
- **Stats Overview**: Total activities, votes, and average scores
- **Top Performers**: Highest-rated activities at a glance
- **Category Charts**: Performance breakdown by activity type
- **Interactive Tables**: Sortable, filterable activity lists

### 💾 **Persistent Storage**

- **Database Storage**: Activities are persisted in Neon PostgreSQL
- **Real-time Sync**: Data automatically synchronizes across sessions
- **Reliable Access**: Your data is always available and backed up

### 🛡️ **Admin & Security**

- **Secure admin dashboard** for managing uploads, reviewing analytics, and changing settings.
- **Robust authentication** with custom login, OTP unlock, and rate limiting to keep your data safe.

### 🎨 **Customization & Branding**

- **Customize category icons** for a tailored, branded experience.
- **Category Icon Mapping**: Assign icons to activity categories for instant recognition and branding.

## 🗄️ Database Setup

### Prerequisites

1. Create a [Neon](https://neon.tech) account
2. Create a new project and database
3. Copy your connection string

- Node.js 18+
- npm, yarn, pnpm, or bun

### Configuration

```bash
# Create environment file
cp .env.example .env.local

# Add your database URL
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

### Database Migration

```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate
```

## 🛠️ Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/troupe-scraper-web.git
cd troupe-scraper-web

# Install dependencies
npm install
# or
pnpm install

# Start the development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 How to Use

### 1. **Prepare Your Data**

Create a CSV file with your activity voting data. Required columns:

```csv
name,category,price,love_votes,like_votes,pass_votes,website_link,google_maps_url,groupNames
"Sunset Hike","Outdoor","Free",5,2,0,"https://example.com","https://maps.google.com","Group A"
"Wine Tasting","Food & Drink","$45",3,4,1,"https://winery.com","https://maps.google.com","Group B"
```

**Column Definitions:**

- `name`: Activity name
- `category`: Activity type (Outdoor, Food & Drink, etc.)
- `price`: Cost per person (Free, $20, etc.)
- `love_votes`: Number of "love" votes
- `like_votes`: Number of "like" votes
- `pass_votes`: Number of "pass" votes
- `website_link`: Optional URL to activity website
- `google_maps_url`: Optional Google Maps link
- `groupNames`: Optional group identifier

### 2. **Upload Your Data**

1. Navigate to `/admin` or click "Upload CSV Data"
2. Drag & drop your CSV file or click to browse
3. Wait for processing confirmation
4. Click "View Dashboard" to see your insights

### 3. **Explore Your Insights**

- **Dashboard**: Overview of all metrics and top activities
- **Analytics**: Deep-dive into voting patterns and distributions

## 🔄 BYOS: Bring Your Own Scraper

This dashboard follows a **"Bring Your Own Scraper"** philosophy. We provide the analysis, you provide the data. This approach offers:

### ✅ **Benefits**

- **Privacy**: Your data never touches our servers
- **Flexibility**: Use any data source or scraping method
- **Control**: You own your data pipeline completely
- **Speed**: No rate limits or API dependencies

### 🛡️ **Getting Data**

Common approaches for gathering activity data:

- **Manual Entry**: Simple spreadsheet creation
- **Web Scraping**: Custom scripts for activity websites
- **Survey Tools**: Export from Google Forms, Typeform, etc.
- **API Integration**: Pull from booking platforms or databases

### 📋 **Data Sources**

Popular platforms to scrape or export from:

- TripAdvisor, Viator, GetYourGuide
- Eventbrite, Meetup, Facebook Events
- Google Reviews, Yelp
- Custom surveys and voting tools

## 🏗️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript + React
- **Styling**: Tailwind CSS v4
- **State**: Zustand with persistence
- **UI Components**: Radix UI primitives
- **Charts**: Custom implementations
- **Icons**: Lucide React

## 📊 Scoring Algorithm

Activities are ranked using a weighted scoring system:

```typescript
score = (love_votes × 2) + (like_votes × 1) + (pass_votes × -1)
```

This ensures:

- **Love votes** have the strongest positive impact
- **Like votes** provide moderate support
- **Pass votes** actively detract from the score
- **Neutral activities** (no votes) score zero

## 🤝 Contributing

We welcome contributions! Whether it's:

- 🐛 **Bug Reports**: Found something broken? Let us know!
- ✨ **Feature Ideas**: Have a cool analytics idea? Share it!
- 📖 **Documentation**: Help make the docs clearer
- 🎨 **Design**: Improve the UI/UX
- ⚡ **Performance**: Optimize the code

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test locally
4. Commit with clear messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com)
- Icons by [Lucide](https://lucide.dev)
- UI components by [Radix UI](https://radix-ui.com)

---

**Made with ❤️ for better group decision-making**
