// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBonded } from 'contexts/Bonded'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useStaking } from 'contexts/Staking'
import type { MaybeAddress } from 'types'

export const useControllerSignerAvailable = () => {
  const { getBondedAccount } = useBonded()
  const { activeProxy } = useActiveAccounts()
  const { getControllerNotImported } = useStaking()
  const { accountHasSigner } = useImportedAccounts()

  // TODO: Remove controller checks once controller deprecation is completed on chain.
  const controllerSignerAvailable = (
    stash: MaybeAddress,
    proxySupported: boolean
  ) => {
    const controller = getBondedAccount(stash)

    if (controller !== stash) {
      if (getControllerNotImported(controller)) {
        return 'controller_not_imported'
      }

      if (!accountHasSigner(controller)) {
        return 'read_only'
      }
    } else if (
      (!proxySupported || !accountHasSigner(activeProxy?.address || null)) &&
      !accountHasSigner(stash)
    ) {
      return 'read_only'
    }
    return 'ok'
  }

  return {
    controllerSignerAvailable,
  }
}
