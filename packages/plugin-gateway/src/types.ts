// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface AuthMessage {
	who: string
	url: string
	version: string
	nonce: string
	issuedAt: number
	expireAt: number
}

export interface AuthChallengeResult {
	challengeId: string
	message: AuthMessage
}

export type AuthChallengeResponse = AuthResponse & {
	data: AuthChallengeResult
}

export interface AuthResponseResult {
	sessionId: string | null
	expireAt: number | null
}

export type AuthResponseResponse = AuthResponse & {
	data: AuthResponseResult
}

export interface ErrorResponse {
	status: 'error'
	message: string
}

export interface AuthResponse {
	status: 'success' | 'error'
}
