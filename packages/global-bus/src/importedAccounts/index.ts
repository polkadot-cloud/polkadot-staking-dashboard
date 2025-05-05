// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  extensionAccounts$,
  hardwareAccounts$,
} from '@w3ux/observables-connect'
import { combineLatest, pairwise, startWith } from 'rxjs'
import { externalAccounts$ } from '../externalAccounts'
import { _importedAccounts } from './private'

export const importedAccounts$ = combineLatest([
  extensionAccounts$,
  hardwareAccounts$,
  externalAccounts$,
]).pipe(startWith([], [], []), pairwise())

export const getImportedAccounts = () => _importedAccounts.getValue()
