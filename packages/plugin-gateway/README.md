# plugin-gateway

REST API client for the Polkadot Staking Dashboard gateway service.

## Overview

This package provides REST API methods for authentication with the staking dashboard gateway.

## Endpoints

### Authentication

- `fetchAuthChallenge(address: string)` - Request an authentication challenge
- `fetchAuthResponse(address: string, challengeId: string, signature: string)` - Submit signed challenge response

## Usage

```typescript
import { fetchAuthChallenge, fetchAuthResponse } from 'plugin-gateway'

// Request challenge
const challenge = await fetchAuthChallenge(address)

// Sign the challenge (using your preferred signing method)
const signature = await signMessage(challenge.authChallenge.message)

// Submit response
const auth = await fetchAuthResponse(address, challenge.authChallenge.challengeId, signature)
```
