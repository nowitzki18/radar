# Radar - AI Ad Campaign Anomaly Alert Dashboard

A full-stack TypeScript web application built with Next.js (App Router), TailwindCSS, and Prisma with SQLite. This dashboard provides AI-powered anomaly detection and alerting for ad campaigns.

## Features

- **Executive Dashboard**: Overview of all campaigns with health scores and alert status
- **Campaign Drilldown**: Detailed metrics with time-series charts and anomaly overlays
- **Alert Management**: Filter and manage alerts by severity and date range
- **Settings**: Configure notification preferences and sensitivity thresholds
- **Real-time Detection**: Simulated anomaly detection every 10 seconds
- **AI Suggestions**: Context-aware insights based on metric patterns

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Prisma** + **SQLite**
- **Chart.js** (via react-chartjs-2)
- **Zustand** (State Management)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npm run db:push
npm run db:seed
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
radar/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── campaign/[id]/    # Campaign detail page
│   ├── alerts/           # Alerts page
│   └── settings/         # Settings page
├── components/           # Reusable components
├── lib/                  # Utilities and store
└── prisma/               # Database schema and seed
```

## Key Components

- **AlertCard**: Displays alert information with severity indicators
- **MetricChart**: Time-series charts with anomaly overlays
- **HealthScoreBadge**: Visual health score indicator
- **SuggestionBox**: AI-powered suggestions panel

## Database Schema

- **Campaign**: Campaign information and health scores
- **Metric**: Time-series metric data with Z-scores
- **Alert**: Anomaly alerts with severity and status
- **Settings**: User preferences and sensitivity thresholds

## API Routes

- `GET /api/anomaly-detection` - Simulates real-time anomaly detection
- `POST /api/alerts/[id]/resolve` - Resolve an alert
- `POST /api/alerts/[id]/dismiss` - Dismiss an alert
- `GET/PUT /api/settings` - Manage settings

## Deployment

This application is ready to deploy on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. The SQLite database will be created automatically on first run

## Notes

- The anomaly detection runs every 10 seconds when on the dashboard
- All data is currently using dummy/static data for demonstration
- Integration buttons for Google Ads and Facebook are placeholders
- Health scores are calculated based on alert volume and severity

