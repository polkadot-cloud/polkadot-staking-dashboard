// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBolt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBonded } from 'contexts/Bonded'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useFastUnstake } from 'contexts/FastUnstake'
import { useStaking } from 'contexts/Staking'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { useSyncing } from 'hooks/useSyncing'
import { useUnstaking } from 'hooks/useUnstaking'
import { useOverlay } from 'kits/Overlay/Provider'
import { Stat } from 'library/Stat'
import { useTranslation } from 'react-i18next'
import { useActivePool } from '../../../../contexts/Pools/ActivePool'

export const NominationStatus = ({
  showButtons = true,
  buttonType = 'primary',
}: {
  showButtons?: boolean
  buttonType?: string
}) => {
  const { t } = useTranslation('pages')
  const {
    isReady,
    networkMetrics: { fastUnstakeErasToCheckPerBlock },
  } = useApi()
  const { inSetup } = useStaking()
  const { inPool } = useActivePool()
  const { openModal } = useOverlay().modal
  const { getBondedAccount } = useBonded()
  const { activeAccount } = useActiveAccounts()
  const { isReadOnlyAccount } = useImportedAccounts()
  const { getNominationStatus } = useNominationStatus()
  const { exposed, fastUnstakeStatus } = useFastUnstake()
  const { getFastUnstakeText, isUnstaking } = useUnstaking()
  const { syncing } = useSyncing(['initialization', 'era-stakers', 'balances'])

  const controller = getBondedAccount(activeAccount)
  const nominationStatus = getNominationStatus(activeAccount, 'nominator')
  // Determine whether to display fast unstake button or regular unstake button.
  const unstakeButton =
    fastUnstakeErasToCheckPerBlock > 0 &&
    !nominationStatus.nominees.active.length &&
    fastUnstakeStatus !== null &&
    !exposed
      ? {
          disabled: isReadOnlyAccount(controller),
          title: getFastUnstakeText(),
          icon: faBolt,
          onClick: () => {
            openModal({ key: 'ManageFastUnstake', size: 'sm' })
          },
        }
      : {
          title: t('nominate.unstake'),
          icon: faSignOutAlt,
          disabled: !isReady || isReadOnlyAccount(controller) || !activeAccount,
          onClick: () => openModal({ key: 'Unstake', size: 'sm' }),
        }

  return (
    <Stat
      label={t('nominate.status')}
      helpKey="Nomination Status"
      stat={inPool() ? t('nominate.alreadyInPool') : nominationStatus.message}
      buttons={
        !showButtons || syncing
          ? []
          : !inSetup()
            ? !isUnstaking
              ? [unstakeButton]
              : []
            : []
      }
      buttonType={buttonType}
    />
  )
}
