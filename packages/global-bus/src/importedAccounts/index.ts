// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	extensionAccounts$,
	externalAccounts$,
	hardwareAccounts$,
} from '@polkadot-cloud/connect-core'
import { combineLatest, pairwise, startWith } from 'rxjs'
import { _importedAccounts } from './private'

export const importedAccounts$ = combineLatest([
	extensionAccounts$,
	hardwareAccounts$,
	externalAccounts$,
]).pipe(startWith([], [], []), pairwise())

export const getImportedAccounts = () => _importedAccounts.getValue()
