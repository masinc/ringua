# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Note**: This file has a Japanese version at `CLAUDE.ja.md`. When updating this file, please keep both versions synchronized.

## Project Overview

This is a Tauri desktop application built with React, TypeScript, and Rust. The application uses:
- **Frontend**: React with Vite for the web frontend (TypeScript)
- **Backend**: Rust with Tauri for native desktop functionality
- **Package Manager**: pnpm (configured with workspace)

## Architecture

- `src/` - React frontend code (TypeScript)
- `src-tauri/` - Rust backend code
  - `src-tauri/src/lib.rs` - Main Tauri commands and application setup
  - `src-tauri/tauri.conf.json` - Tauri configuration
- Frontend communicates with Rust backend via Tauri's `invoke()` API

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
- **Vite** - Build tool and development server
- **TypeScript** - Type system for JavaScript
- **Rust** - Systems programming language

This ensures that code suggestions and examples are always current and compatible with the versions used in the project.

## Key Files

- `src-tauri/tauri.conf.json` - Tauri app configuration including window settings, build commands, and security policies
- `src/App.tsx` - Main React component demonstrating Tauri command invocation
- `src-tauri/src/lib.rs` - Tauri command definitions and app initialization