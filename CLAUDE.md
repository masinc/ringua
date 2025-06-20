# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Note**: This file has a Japanese version at `CLAUDE.ja.md`. When updating this file, please keep both versions synchronized.

## Project Overview

This is a Tauri desktop application built with React, TypeScript, and Rust. The application uses:
- **Frontend**: React with Vite for the web frontend (TypeScript)
- **Routing**: React Router v7 in Data Mode for client-side navigation with data loading
- **Backend**: Rust with Tauri for native desktop functionality
- **Package Manager**: pnpm (configured with workspace)

## Architecture

- `src/` - React frontend code (TypeScript)
  - `src/routes.tsx` - React Router route definitions
  - `src/pages/` - Route components with data loaders
  - `src/main.tsx` - Application entry point with Router setup
- `src-tauri/` - Rust backend code
  - `src-tauri/src/lib.rs` - Main Tauri commands and application setup
  - `src-tauri/tauri.conf.json` - Tauri configuration
- Frontend communicates with Rust backend via Tauri's `invoke()` API
- Client-side routing handled by React Router v7 with `createBrowserRouter` and data loaders

## Common Commands

### Development
```bash
# Start development server (runs both frontend and Tauri)
pnpm tauri dev

# Start only frontend development server
pnpm dev

# Build the application
pnpm build

# Preview built frontend
pnpm preview
```

### Tauri-specific Commands
```bash
# Build Tauri application for distribution
pnpm tauri build

# Generate Tauri icons
pnpm tauri icon

# Show Tauri info
pnpm tauri info
```

### TypeScript
```bash
# Type checking
pnpm tsc --noEmit
```

### Rust (from src-tauri directory)
```bash
# Check Rust code
cargo check

# Run Rust tests
cargo test

# Format Rust code
cargo fmt
```

## Context7 MCP Integration

This project has Context7 MCP (Model Context Protocol) integrated, which provides up-to-date documentation for libraries and frameworks used in the codebase.

### What is Context7 MCP?
Context7 is an MCP server that dynamically fetches current, version-specific documentation and code examples directly into the AI's context window. This helps prevent outdated or hallucinated code suggestions.

### How to Use Context7
When asking for help with specific libraries or frameworks, you can request up-to-date documentation by mentioning the library name. Context7 will automatically:
1. Identify the library being referenced (e.g., Tauri, React, Vite)
2. Fetch the latest version documentation
3. Inject relevant content into the AI's context
4. Provide current, accurate code examples

### Supported Libraries in This Project
- **Tauri** - Desktop application framework
- **React** - Frontend library  
- **React Router** - Client-side routing with data loading
- **Vite** - Build tool and development server
- **TypeScript** - Type system for JavaScript
- **Rust** - Systems programming language

This ensures that code suggestions and examples are always current and compatible with the versions used in the project.

## React Router v7 Data Mode

This project uses React Router v7 in Data Mode, which enables advanced features like data loading and actions.

### Key Concepts
- **Data Mode**: Routes are configured with `createBrowserRouter` outside of React rendering
- **Loaders**: Functions that run before route components render to fetch data
- **Data Loading**: Server-side style data loading patterns on the client

### Route Structure
Routes are defined in `src/routes.tsx` using the `RouteObject` type:
```typescript
{
  path: "/about",
  Component: About,
  loader: aboutLoader,  // Data loading function
}
```

### Adding New Routes
1. Create route component in `src/pages/`
2. Export a `loader` function for data fetching
3. Add route configuration to `src/routes.tsx`

## Key Files

- `src-tauri/tauri.conf.json` - Tauri app configuration including window settings, build commands, and security policies
- `src/App.tsx` - Main React component demonstrating Tauri command invocation and navigation
- `src/main.tsx` - Application entry point with React Router setup
- `src/routes.tsx` - React Router route definitions and configuration
- `src/pages/` - Route components with data loaders
- `src-tauri/src/lib.rs` - Tauri command definitions and app initialization