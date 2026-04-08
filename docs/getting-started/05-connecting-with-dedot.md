---
id: connecting-with-dedot
sidebar_position: 5
slug: /getting-started/connecting-with-dedot
---

# Connecting with Dedot

[Dedot](https://dedot.dev) is a **next-generation** JavaScript/TypeScript client for Polkadot and Polkadot SDK-based blockchains. It is lightweight, tree-shakable, and provides precise types and API suggestions for each individual network via the [`@dedot/chaintypes`](https://github.com/dedotdev/chaintypes) package.

## Installation

```bash
npm install dedot
npm install -D @dedot/chaintypes
```

## Connecting to the geo-steered endpoint

```typescript
import { DedotClient, WsProvider } from 'dedot';
import type { PolkadotAssetHubApi } from '@dedot/chaintypes';

const provider = new WsProvider('wss://asset-hub.polkadot.rpc.deserve.network');
const client = await DedotClient.new<PolkadotAssetHubApi>(provider);

const bestBlock = await client.block.best();
console.log(`Connected. Best block: #${bestBlock.number}`);

await client.disconnect();
```

## Connecting to a regional endpoint

```typescript
import { DedotClient, WsProvider } from 'dedot';
import type { PolkadotAssetHubApi } from '@dedot/chaintypes';

// Replace with your preferred regional endpoint
const provider = new WsProvider('wss://london.asset-hub.polkadot.rpc.deserve.network');
const client = await DedotClient.new<PolkadotAssetHubApi>(provider);

const bestBlock = await client.block.best();
console.log(`Connected. Best block: #${bestBlock.number}`);

await client.disconnect();
```

## Available endpoints

| Network            |                                 Endpoints                                 |
| :----------------- | :-----------------------------------------------------------------------: |
| Polkadot Asset Hub | [Link](/polkadot-and-parachains/polkadot-asset-hub#archive-rpc-endpoints) |
