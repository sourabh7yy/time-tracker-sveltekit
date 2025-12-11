# Time Tracker - SvelteKit

A modern time tracking application built with SvelteKit and Supabase for managing tasks and tracking productivity.

## Tech Stack

- **Frontend**: SvelteKit v2.48.5, Svelte v5.43.8, JavaScript
- **Backend**: Supabase v2.87.1 (Authentication, Database)
- **Build Tool**: Vite v7.2.2
- **Styling**: CSS
- **Deployment**: Vercel

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

🚀 **Live Application**: 

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



