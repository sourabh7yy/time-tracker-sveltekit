# Time Tracker - SvelteKit

A modern time tracking application built with SvelteKit and Supabase for managing tasks and tracking productivity.

## Tech Stack

- **Frontend**: SvelteKit v2.48.5, Svelte v5.43.8, JavaScript
  - SvelteKit provides full-stack web framework with file-based routing
  - Svelte compiles components to vanilla JavaScript for optimal performance
  - Handles user interface, form validation, and client-side navigation

- **Backend**: Supabase v2.87.1 (Authentication, Database)
  - PostgreSQL database with tables: `users`, `tasks`, `time_logs`
  - Built-in authentication system for user signup/login
  - Real-time subscriptions and row-level security
  - RESTful API auto-generated from database schema


- **Styling**: CSS
  - Custom CSS with responsive design
  - Component-scoped and global styles

- **Deployment**: Vercel
  - Serverless deployment platform
  - Automatic deployments from Git

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm/pnpm/yarn

### Package Information
- **Project Version**: 0.0.1
- **Package Manager**: npm (see `package.json` for all dependencies)
- **Module Type**: ES Module

### Local Development

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd time-tracker-sveltekit
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Environment Setup**
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
   ```env
   PUBLIC_SUPABASE_URL=your_supabase_url
   PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   -The keys i have used are provided in separate docs.

4. **Start development server**
   ```sh
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for Production

```sh
npm run build
npm run preview
```

## Live Demo

 **Live Application**: https://time-tracker-sveltekit.vercel.app/

## Screenshots & Demo

📸 **Screenshots/Demo Video**: https://drive.google.com/drive/folders/1Q4LgYAuHWuVuNGZ21RHsKEuv0nyeFsnR?usp=sharing

## Features

- User authentication (login/signup)
- Task management
- Time tracking
- Summary dashboard
- Responsive design

## Dependencies

### Production Dependencies
- `@supabase/supabase-js`: ^2.87.1 - Supabase JavaScript client

### Development Dependencies
- `@sveltejs/adapter-auto`: ^7.0.0 - SvelteKit adapter
- `@sveltejs/kit`: ^2.48.5 - SvelteKit framework
- `@sveltejs/vite-plugin-svelte`: ^6.2.1 - Vite plugin for Svelte
- `svelte`: ^5.43.8 - Svelte framework
- `vite`: ^7.2.2 - Build tool

## Project Structure

```
src/
├── lib/
│   ├── supabaseClient.js    # Supabase configuration
│   └── styles/              # Global styles
├── routes/
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── tasks/               # Tasks management
│   └── summary/             # Time tracking summary
└── app.html                 # Main HTML template
package.json                 # Project dependencies and scripts
```



