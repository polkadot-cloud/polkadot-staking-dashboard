// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	extensionAccounts$,
	hardwareAccounts$,
} from '@polkadot-cloud/connect-core'
import { combineLatest, pairwise, startWith } from 'rxjs'
import { externalAccounts$ } from '../externalAccounts'
import { _importedAccounts } from './private'

export const importedAccounts$ = combineLatest([
	extensionAccounts$,
	hardwareAccounts$,
	externalAccounts$,
]).pipe(startWith([], [], []), pairwise())

export const getImportedAccounts = () => _importedAccounts.getValue()
