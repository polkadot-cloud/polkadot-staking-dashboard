// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faMinus, faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces, planckToUnit } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useSyncing } from 'hooks/useSyncing'
import { BondedChart } from 'library/BarChart/BondedChart'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonPrimary, MultiButton } from 'ui-buttons'
import { ButtonRow, CardHeader } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'

export const ManageBond = () => {
  const { t } = useTranslation('pages')

  const { network } = useNetwork()
  const { openHelp } = useHelp()
  const { openModal } = useOverlay().modal
  const { activeAddress } = useActiveAccounts()
  const { syncing } = useSyncing(['active-pools'])
  const { isReadOnlyAccount } = useImportedAccounts()
  const { getTransferOptions } = useTransferOptions()
  const { isBonding, isMember, activePool, isDepositor } = useActivePool()

  const { units } = getNetworkData(network)
  const Token = getChainIcons(network).token
  const allTransferOptions = getTransferOptions(activeAddress)
  const {
    pool: { active, totalUnlocking, totalUnlocked },
    transferrableBalance,
  } = allTransferOptions
  const { state } = activePool?.bondedPool || {}

  const bondDisabled =
    syncing ||
    !isBonding() ||
    !isMember() ||
    isReadOnlyAccount(activeAddress) ||
    state === 'Destroying'
  const canLeavePool = isMember() && !isDepositor() && active > 0n

  return (
    <>
      <CardHeader>
        <h4>
          {t('bondedFunds')}
          <ButtonHelp marginLeft onClick={() => openHelp('Bonded in Pool')} />
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
                  options: { bondFor: 'pool' },
                  size: 'sm',
                })
              }
              iconLeft={faPlus}
              text=""
            />
            <MultiButton.Button
              size="md"
              disabled={bondDisabled}
              marginRight
              onClick={() =>
                openModal({
                  key: 'Unbond',
                  options: { bondFor: 'pool' },
                  size: 'sm',
                })
              }
              iconLeft={faMinus}
              text=""
            />
          </MultiButton.Container>
          {canLeavePool && (
            <ButtonPrimary
              size="md"
              text={t('unstake')}
              iconLeft={faSignOut}
              onClick={() => openModal({ key: 'LeavePool', size: 'sm' })}
            />
          )}
        </ButtonRow>
      </CardHeader>
      <BondedChart
        active={new BigNumber(planckToUnit(active, units))}
        unlocking={planckToUnitBn(totalUnlocking, units)}
        unlocked={planckToUnitBn(totalUnlocked, units)}
        free={new BigNumber(planckToUnit(transferrableBalance, units))}
        inactive={active === 0n}
      />
    </>
  )
}
