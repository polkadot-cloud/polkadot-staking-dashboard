// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faBolt,
  faMinus,
  faPlus,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import type BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useBonded } from 'contexts/Bonded'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useFastUnstake } from 'contexts/FastUnstake'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { useSyncing } from 'hooks/useSyncing'
import { useUnstaking } from 'hooks/useUnstaking'
import { BondedChart } from 'library/BarChart/BondedChart'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonPrimary, MultiButton } from 'ui-buttons'
import { ButtonRow, CardHeader } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'

export const ManageBond = () => {
  const { t } = useTranslation('pages')
  const {
    isReady,
    stakingMetrics: { erasToCheckPerBlock },
  } = useApi()
  const { network } = useNetwork()
  const { openHelp } = useHelp()
  const { syncing } = useSyncing()
  const { inSetup } = useStaking()
  const { getLedger } = useBalances()
  const { getBondedAccount } = useBonded()
  const { openModal } = useOverlay().modal
  const { isFastUnstaking } = useUnstaking()
  const { activeAddress } = useActiveAccounts()
  const { getFastUnstakeText } = useUnstaking()
  const { isReadOnlyAccount } = useImportedAccounts()
  const { getTransferOptions } = useTransferOptions()
  const { getNominationStatus } = useNominationStatus()
  const { exposed, fastUnstakeStatus } = useFastUnstake()

  const { units } = getNetworkData(network)
  const Token = getChainIcons(network).token
  const controller = getBondedAccount(activeAddress)
  const ledger = getLedger({ stash: activeAddress })
  const { active }: { active: BigNumber } = ledger
  const allTransferOptions = getTransferOptions(activeAddress)

  const { freeBalance } = allTransferOptions
  const { totalUnlocking, totalUnlocked } = allTransferOptions.nominate
  const nominationStatus = getNominationStatus(activeAddress, 'nominator')

  // Determine whether to display fast unstake button or regular unstake button.
  const unstakeButton =
    erasToCheckPerBlock > 0 &&
    !nominationStatus.nominees.active.length &&
    fastUnstakeStatus !== null &&
    !exposed ? (
      <ButtonPrimary
        size="md"
        disabled={isReadOnlyAccount(controller)}
        text={getFastUnstakeText()}
        iconLeft={faBolt}
        onClick={() => {
          openModal({ key: 'ManageFastUnstake', size: 'sm' })
        }}
      />
    ) : (
      <ButtonPrimary
        size="md"
        text={t('unstake')}
        iconLeft={faSignOutAlt}
        disabled={!isReady || isReadOnlyAccount(controller) || !activeAddress}
        onClick={() => openModal({ key: 'Unstake', size: 'sm' })}
      />
    )

  const unstakeDisabled =
    inSetup() || syncing || isReadOnlyAccount(activeAddress)

  const bondDisabled = unstakeDisabled || isFastUnstaking

  return (
    <>
      <CardHeader>
        <h4>
          {t('bondedFunds')}
          <ButtonHelp marginLeft onClick={() => openHelp('Bonding')} />
        </h4>
        <h2>
          <Token />
          <Odometer
            value={minDecimalPlaces(
              planckToUnitBn(active, units).toFormat(),
              2
            )}
            zeroDecimals={2}
          />
        </h2>
        <ButtonRow>
          <MultiButton.Container marginRight disabled={bondDisabled}>
            <MultiButton.Button
              size="md"
              disabled={bondDisabled}
              marginRight
              onClick={() =>
                openModal({
                  key: 'Bond',
                  options: { bondFor: 'nominator' },
                  size: 'sm',
                })
              }
              iconLeft={faPlus}
              text=""
            />
            <span />
            <MultiButton.Button
              size="md"
              disabled={bondDisabled}
              marginRight
              onClick={() =>
                openModal({
                  key: 'Unbond',
                  options: { bondFor: 'nominator' },
                  size: 'sm',
                })
              }
              iconLeft={faMinus}
              text=""
            />
          </MultiButton.Container>
          {!unstakeDisabled && unstakeButton}
        </ButtonRow>
      </CardHeader>
      <BondedChart
        active={planckToUnitBn(active, units)}
        unlocking={planckToUnitBn(totalUnlocking, units)}
        unlocked={planckToUnitBn(totalUnlocked, units)}
        free={planckToUnitBn(freeBalance, units)}
        inactive={active.isZero()}
      />
    </>
  )
}
