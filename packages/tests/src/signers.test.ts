// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { deriveVaultButtonState } from 'utils'
import { describe, expect, test } from 'vitest'

describe('deriveVaultButtonState', () => {
	const base = {
		submitted: false,
		valid: true,
		submitText: 'Submit',
		signText: 'Sign',
		promptStatus: 0,
		disabled: false,
	}

	// --- Not submitted ---

	test('not submitted, enabled, prompt idle: sign text, enabled, pulsing', () => {
		const r = deriveVaultButtonState(base)
		expect(r.buttonText).toBe('Sign')
		expect(r.buttonDisabled).toBe(false)
		expect(r.buttonPulse).toBe(true)
	})

	test('not submitted, disabled, prompt idle: sign text, disabled, pulsing', () => {
		const r = deriveVaultButtonState({ ...base, disabled: true })
		expect(r.buttonText).toBe('Sign')
		expect(r.buttonDisabled).toBe(true)
		// !disabled || promptStatus === 0 → false || true → true
		expect(r.buttonPulse).toBe(true)
	})

	test('not submitted, enabled, prompt active: sign text, disabled, pulsing', () => {
		const r = deriveVaultButtonState({ ...base, promptStatus: 1 })
		expect(r.buttonText).toBe('Sign')
		// disabled || promptStatus !== 0 → false || true → true
		expect(r.buttonDisabled).toBe(true)
		// !disabled || promptStatus === 0 → true || false → true
		expect(r.buttonPulse).toBe(true)
	})

	test('not submitted, disabled, prompt active: disabled, not pulsing', () => {
		const r = deriveVaultButtonState({
			...base,
			disabled: true,
			promptStatus: 1,
		})
		expect(r.buttonText).toBe('Sign')
		expect(r.buttonDisabled).toBe(true)
		// !disabled || promptStatus === 0 → false || false → false
		expect(r.buttonPulse).toBe(false)
	})

	// --- Submitted ---

	test('submitted, enabled, valid: submit text, enabled, pulsing', () => {
		const r = deriveVaultButtonState({ ...base, submitted: true })
		expect(r.buttonText).toBe('Submit')
		expect(r.buttonDisabled).toBe(false)
		// !(!valid || promptStatus !== 0) → !(false || false) → true
		expect(r.buttonPulse).toBe(true)
	})

	test('submitted, disabled: submit text, disabled', () => {
		const r = deriveVaultButtonState({
			...base,
			submitted: true,
			disabled: true,
		})
		expect(r.buttonText).toBe('Submit')
		expect(r.buttonDisabled).toBe(true)
	})

	test('submitted, not valid: not pulsing', () => {
		const r = deriveVaultButtonState({
			...base,
			submitted: true,
			valid: false,
		})
		// !(!valid || promptStatus !== 0) → !(true || false) → false
		expect(r.buttonPulse).toBe(false)
	})

	test('submitted, prompt active: not pulsing', () => {
		const r = deriveVaultButtonState({
			...base,
			submitted: true,
			promptStatus: 1,
		})
		// !(!valid || promptStatus !== 0) → !(false || true) → false
		expect(r.buttonPulse).toBe(false)
	})

	test('submitted with empty submitText: returns empty string', () => {
		const r = deriveVaultButtonState({
			...base,
			submitted: true,
			submitText: '',
		})
		expect(r.buttonText).toBe('')
	})
})
