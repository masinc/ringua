# Ringua

**Ringua** is a desktop translation application powered by multiple AI models. The name comes from "lingua" (Latin for language) with 'l' replaced by 'r', symbolizing the transformation of language through AI translation.

## Features

- 🖱️ **Clipboard Translation**: Seamlessly translate content from your clipboard
- 🤖 **Multiple AI Models**: Support for GPT, Claude, Gemini, DeepSeek, and more
- 🔑 **Bring Your Own API**: Use your own API keys for maximum control and privacy
- 🌍 **Multi-language Support**: Translate between multiple languages
- 📝 **Translation History**: Save and manage your translation history locally
- 🖥️ **Desktop Native**: Built with Tauri for optimal performance and native experience

## Supported AI Models

- **OpenAI GPT** (GPT-3.5, GPT-4, GPT-4o)
- **Anthropic Claude** (Claude 3 family)
- **Google Gemini**
- **DeepSeek**
- More models coming soon...

## Prerequisites

- Node.js (v18 or later)
- Rust (latest stable)
- pnpm package manager

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ringua.git
   cd ringua
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm tauri dev
   ```

## Building for Production

```bash
# Build the application
pnpm tauri build
```

The built application will be available in `src-tauri/target/release/`.

## Project Structure

```
ringua/
├── src/                    # React frontend
│   ├── pages/             # Route components with data loaders
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── routes.tsx        # React Router route definitions
│   └── main.tsx          # Application entry point
├── src-tauri/             # Rust backend
│   ├── src/              # Rust source code
│   └── tauri.conf.json   # Tauri configuration
└── docs/                  # Documentation
```

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Routing**: React Router v7 (Data Mode)
- **Backend**: Rust + Tauri
- **Database**: SQLite (for translation history)
- **Package Manager**: pnpm

## Configuration

1. **API Keys**: Configure your AI model API keys in the application settings
2. **Default Languages**: Set your preferred source and target languages
3. **Model Preferences**: Choose your preferred AI models for different use cases

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
