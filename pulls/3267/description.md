## Overview

This PR adds a new CLI tool (`locale-cli`) that automates the translation of locale keys for the Polkadot Staking Dashboard using OpenAI's GPT-4o-mini. The tool enables developers to quickly add new locale entries across all supported languages with context-aware translations.

## Why This Tool?

As the dashboard expands language support (#3262, #3263), manually maintaining translations across multiple language files is becoming increasingly time-consuming and error-prone. This CLI automates the workflow while ensuring blockchain and staking terminology is translated accurately.

## Key Features

### 🤖 **AI-Powered Translation**
- Leverages OpenAI GPT-4o-mini for high-quality translations
- Provides domain-specific context (Polkadot, NPoS, staking concepts)
- Preserves placeholder variables (e.g., `{{amount}}`, `{{unit}}`)
- Maintains technical accuracy while keeping user-facing text accessible

### 🌍 **Multi-Language Support**
- **English (en)** - Base language
- **Spanish (es)** - Auto-translated
- **Chinese Simplified (zh)** - Auto-translated

### 🛠️ **Developer-Friendly**
- Simple CLI interface using Commander.js
- Supports nested keys (e.g., `validators.highCommission`)
- Optional context descriptions for better translation accuracy
- Auto-validates with `pnpm order` and `pnpm validate`
- Flexible API key configuration (env var, .env file, or CLI option)

### 🔒 **Security**
- Comprehensive prototype pollution protection
- Validates against dangerous property names (`__proto__`, `constructor`, `prototype`)
- Uses `Object.defineProperty` for safer property assignment

## Usage Examples

**Basic:**
```bash
pnpm --filter locale-cli add-locale --key "bondMore" --text "Bond More"
```

**With context:**
```bash
pnpm --filter locale-cli add-locale \
  --key "validators.highCommission" \
  --text "High Commission" \
  --description "Refers to validators charging high commission rates"
```

**Specific file:**
```bash
pnpm --filter locale-cli add-locale --key "title" --text "Help Center" --file "help"
```

## How It Works

1. **Input** - Accept key, English text, and optional parameters
2. **Context** - Inject Polkadot/staking domain knowledge into the LLM prompt
3. **Translate** - GPT-4o-mini generates Spanish and Chinese translations
4. **Update** - Add translations to appropriate JSON files in `packages/locales`
5. **Validate** - Run `pnpm order` (alphabetical sort) and `pnpm validate` (consistency check)

## Configuration

Set your OpenAI API key using any method:

```bash
# Environment variable
export OPENAI_API_KEY=your_api_key_here

# .env file in repository root
OPENAI_API_KEY=your_api_key_here

# CLI option
--api-key your_api_key_here
```

## Changes Summary

- **16 files changed**: +1,162 additions, -3 deletions
- New `packages/locale-cli` package with TypeScript implementation
- Dependencies: OpenAI SDK, Commander.js, dotenv
- Complete documentation (README, CHANGELOG, demo script)
- All CI checks passing ✅

## Testing

Run the demo:
```bash
node packages/locale-cli/demo.js
```

Test security (should fail safely):
```bash
node packages/locale-cli/bin/add-locale.js --key "__proto__.test" --text "Test"
```

## Related

Fixes #3266

---

**⚠️ Note**: This tool requires an OpenAI API key. The key is not included in the repository and must be configured by each developer.