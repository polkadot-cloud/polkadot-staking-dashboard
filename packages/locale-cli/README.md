# Locale CLI

A command-line tool for adding locale keys with LLM-powered translations to the Polkadot Staking Dashboard.

## Features

- Translates text to all supported languages (English, Spanish, Chinese) using OpenAI
- Automatically adds translations to the appropriate locale JSON files
- Provides context about Polkadot, staking, and the dashboard for accurate translations
- Runs `pnpm order` and `pnpm validate` to ensure consistency
- Supports nested keys and optional descriptions for better context

## Installation

From the root of the polkadot-staking-dashboard repository:

```bash
pnpm install
```

## Configuration

Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY=your_api_key_here
```

Alternatively, create a `.env` file in the root of the repository:

```
OPENAI_API_KEY=your_api_key_here
```

Or pass the API key directly via the `--api-key` option.

## Usage

From the root of the repository:

```bash
pnpm --filter locale-cli add-locale --key <key> --text <text> [options]
```

Or from within the `packages/locale-cli` directory:

```bash
pnpm add-locale --key <key> --text <text> [options]
```

### Options

- `-k, --key <key>` (required): Locale key to add (e.g., "myKey" or "nested.key")
- `-t, --text <text>` (required): English text to translate
- `-f, --file <file>` (optional): Locale file to add the key to (default: "app")
  - Available files: app, help, modals, pages, tips
- `-d, --description <description>` (optional): Additional context for the LLM
- `--api-key <apiKey>` (optional): OpenAI API key (overrides env var)

### Examples

Add a simple key to the default app.json file:

```bash
pnpm --filter locale-cli add-locale \
  --key "bondMore" \
  --text "Bond More"
```

Add a nested key with description:

```bash
pnpm --filter locale-cli add-locale \
  --key "validators.highCommission" \
  --text "High Commission" \
  --description "Refers to validators charging high commission rates"
```

Add a key to a specific file:

```bash
pnpm --filter locale-cli add-locale \
  --key "title" \
  --text "Help Center" \
  --file "help"
```

Add a key with placeholder variables:

```bash
pnpm --filter locale-cli add-locale \
  --key "bondAmount" \
  --text "Bond {{amount}} {{unit}}" \
  --description "Shows the amount and unit to bond"
```

## How It Works

1. The CLI accepts a key, text, and optional parameters
2. It provides context about Polkadot and the staking dashboard to OpenAI
3. OpenAI translates the text to Spanish and Chinese
4. The translations are added to the appropriate locale JSON files
5. `pnpm order` alphabetically sorts the keys in all locale files
6. `pnpm validate` checks that all locale files have consistent keys

## Supported Languages

- English (en)
- Spanish (es)
- Chinese Simplified (zh)

## Development

The package structure:

```
locale-cli/
├── bin/
│   └── add-locale.js    # CLI entry point
├── src/
│   └── index.ts         # Core translation logic
├── package.json
├── tsconfig.json
└── README.md
```

## License

GPL-3.0-only
