// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faBolt,
  faMinus,
  faPlus,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces, planckToUnit } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useFastUnstake } from 'contexts/FastUnstake'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { useSyncing } from 'hooks/useSyncing'
import { useUnstaking } from 'hooks/useUnstaking'
import { BondedChart } from 'library/BarChart/BondedChart'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonPrimary, MultiButton } from 'ui-buttons'
import { ButtonRow, CardHeader } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const ManageBond = () => {
  const { t } = useTranslation('pages')
  const {
    isReady,
    stakingMetrics: { erasToCheckPerBlock },
  } = useApi()
  const { network } = useNetwork()
  const { openHelp } = useHelp()
  const { syncing } = useSyncing()
  const { isBonding } = useStaking()
  const { openModal } = useOverlay().modal
  const { getStakingLedger } = useBalances()
  const { isFastUnstaking } = useUnstaking()
  const { activeAddress } = useActiveAccounts()
  const { getFastUnstakeText } = useUnstaking()
  const { isReadOnlyAccount } = useImportedAccounts()
  const { getNominationStatus } = useNominationStatus()
  const { exposed, fastUnstakeStatus } = useFastUnstake()
  const { balances } = useAccountBalances(activeAddress)

  const { ledger } = getStakingLedger(activeAddress)
  const { units } = getStakingChainData(network)
  const Token = getChainIcons(network).token
  const active = ledger?.active || 0n

  const { totalUnlocking, totalUnlocked } = balances.nominator
  const nominationStatus = getNominationStatus(activeAddress, 'nominator')

  // Check for actual bonded funds directly from ledger to handle dual staking scenarios
  // where isBonding might be false due to subscription issues
  const hasNominatorFunds = active > 0n
  const canUnbond = hasNominatorFunds || isBonding

  // Determine whether fast unstake is available
  const fastUnstakeEligible =
    erasToCheckPerBlock > 0 &&
    !nominationStatus.nominees.active.length &&
    fastUnstakeStatus !== null &&
    !exposed

  // Whether unstake buttons should be disabled
  const unstakeDisabled = !canUnbond || (syncing && !hasNominatorFunds)

  // Whether unstake buttons should be hidden
  const unstakeHidden = unstakeDisabled || isReadOnlyAccount(activeAddress)

  // Whether the bond buttons should be disabled
  const bondDisabled =
    unstakeDisabled || isFastUnstaking || isReadOnlyAccount(activeAddress)

  // The available unstake buttons to display. If fast unstaking is available, it will show the fast
  // unstake button. Regular unstake button will always be available if the user can unbond
  const unstakeButtons = (
    <>
      {fastUnstakeEligible && (
        <ButtonPrimary
          size="md"
          disabled={isReadOnlyAccount(activeAddress)}
          text={getFastUnstakeText()}
          iconLeft={faBolt}
          onClick={() => {
            openModal({ key: 'ManageFastUnstake', size: 'sm' })
          }}
        />
      )}
      <ButtonPrimary
        size="md"
        text={t('unstake')}
        iconLeft={faSignOutAlt}
        disabled={
          !isReady ||
          isReadOnlyAccount(activeAddress) ||
          !activeAddress ||
          !canUnbond
        }
        onClick={() => openModal({ key: 'Unstake', size: 'sm' })}
      />
    </>
  )

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
              new BigNumber(planckToUnit(active, units)).toFormat(),
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
          {!unstakeHidden && unstakeButtons}
        </ButtonRow>
      </CardHeader>
      <BondedChart
        active={new BigNumber(planckToUnit(active, units))}
        unlocking={new BigNumber(planckToUnit(totalUnlocking, units))}
        unlocked={new BigNumber(planckToUnit(totalUnlocked, units))}
        free={new BigNumber(planckToUnit(balances.transferableBalance, units))}
        inactive={active === 0n}
      />
    </>
  )
}
