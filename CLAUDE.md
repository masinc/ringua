# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Note**: This file has a Japanese version at `CLAUDE.ja.md`. When updating this file, please keep both versions synchronized.

## Documentation Files

This project maintains comprehensive documentation in both English and Japanese. **Always use @ references** when working with these files for optimal Claude Code integration.

### Available Documentation

- **Project Overview**: `@README.md` / `@README.ja.md`
- **Application Specification**: `@docs/specification.md` / `@docs/specification.ja.md`  
- **Technical Architecture**: `@docs/architecture.md` / `@docs/architecture.ja.md`

### When to Reference Documentation

#### Read Before Starting Work
- **@README.md**: For project overview, setup instructions, and basic understanding
- **@docs/specification.md**: Before implementing new features, UI changes, or user-facing functionality
- **@docs/architecture.md**: Before making architectural decisions, adding new services, or refactoring core systems

#### Read During Development
- **@docs/specification.md**: When unclear about feature requirements, user flows, or data models
- **@docs/architecture.md**: When implementing database operations, API integrations, or cross-component communication

#### Update Documentation When
- **@README.md**: Adding new dependencies, changing setup process, or modifying project structure
- **@docs/specification.md**: Adding/changing features, modifying user interface, or altering data requirements
- **@docs/architecture.md**: Adding new services, changing database schema, or modifying API integrations

### Documentation Synchronization Rules

1. **Always update both language versions** when modifying any documentation
2. **Use @ references** in your prompts (e.g., "@docs/specification.md shows the user flow...")
3. **Read relevant docs first** before asking questions about existing functionality
4. **Update docs immediately** after implementing significant changes

## Project Overview

**Ringua** - AI-powered desktop translation application with clipboard integration. See `@README.md` for detailed overview.

**Key Technologies**: Tauri + React + TypeScript + Rust + React Router v7 Data Mode + SQLite

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

**Important**: This project uses React Router v7 in **Data Mode** (not Declarative Mode). 

Routes use `createBrowserRouter` with data loaders. See `@docs/architecture.md` for detailed routing patterns.

### Quick Route Addition
1. Create component in `src/pages/` with `loader` function
2. Add to `src/routes.tsx`

## Key Development Files

- `src/routes.tsx` - React Router route definitions
- `src/main.tsx` - Application entry point with Router setup  
- `src-tauri/src/lib.rs` - Tauri command definitions
- `src-tauri/tauri.conf.json` - Tauri configuration