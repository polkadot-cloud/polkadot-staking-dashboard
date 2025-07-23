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
  const { syncing } = useSyncing(['initialization', 'era-stakers'])

  const { ledger } = getStakingLedger(activeAddress)
  const { units } = getStakingChainData(network)
  const Token = getChainIcons(network).token
  const active = ledger?.active || 0n

  const { totalUnlocking, totalUnlocked } = balances.nominator
  const nominationStatus = getNominationStatus(activeAddress, 'nominator')

  // Determine whether fast unstake is available
  const fastUnstakeEligible =
    erasToCheckPerBlock > 0 &&
    !nominationStatus.nominees.active.length &&
    fastUnstakeStatus?.status === 'NOT_EXPOSED' &&
    !exposed

  // Whether unstake buttons should be disabled
  const unstakeDisabled =
    !isReady || !isBonding || syncing || (syncing && !isBonding)

  // Whether the bond buttons should be disabled
  const bondDisabled =
    unstakeDisabled || isFastUnstaking || isReadOnlyAccount(activeAddress)

  // The available unstake buttons to display. If fast unstaking is available the fast unstake
  // button will be displayed. Otherwise show the normal unstake button. If the account is
  // read-only, no buttons will be displayed.
  const unstakeButtons = !isReadOnlyAccount(activeAddress) ? (
    fastUnstakeEligible && !unstakeDisabled ? (
      <ButtonPrimary
        size="md"
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
        disabled={unstakeDisabled}
        onClick={() => openModal({ key: 'Unstake', size: 'sm' })}
      />
    )
  ) : null

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
          {unstakeButtons}
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
