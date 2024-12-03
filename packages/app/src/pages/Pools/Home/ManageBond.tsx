// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useSyncing } from 'hooks/useSyncing'
import { useOverlay } from 'kits/Overlay/Provider'
import { BondedChart } from 'library/BarChart/BondedChart'
import { CardHeaderWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonPrimary } from 'ui-buttons'
import { ButtonRow } from 'ui-structure'
import { planckToUnitBn } from 'utils'

export const ManageBond = () => {
  const { t } = useTranslation('pages')

  const {
    networkData: {
      units,
      brand: { token: Token },
    },
  } = useNetwork()
  const { openHelp } = useHelp()
  const { openModal } = useOverlay().modal
  const { activeAccount } = useActiveAccounts()
  const { syncing } = useSyncing(['active-pools'])
  const { isReadOnlyAccount } = useImportedAccounts()
  const { getTransferOptions } = useTransferOptions()
  const { isBonding, isMember, activePool } = useActivePool()

  const allTransferOptions = getTransferOptions(activeAccount)
  const {
    pool: { active, totalUnlocking, totalUnlocked, totalUnlockChunks },
    transferrableBalance,
  } = allTransferOptions

  const { state } = activePool?.bondedPool || {}

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          {t('pools.bondedFunds')}
          <ButtonHelp marginLeft onClick={() => openHelp('Bonded in Pool')} />
        </h4>
        <h2>
          <Token className="networkIcon" />
          <Odometer
            value={minDecimalPlaces(
              planckToUnitBn(active, units).toFormat(),
              2
            )}
            zeroDecimals={2}
          />
        </h2>
        <ButtonRow>
          <ButtonPrimary
            disabled={
              syncing ||
              !isBonding() ||
              !isMember() ||
              isReadOnlyAccount(activeAccount) ||
              state === 'Destroying'
            }
            marginRight
            onClick={() =>
              openModal({
                key: 'Bond',
                options: { bondFor: 'pool' },
                size: 'sm',
              })
            }
            text="+"
          />
          <ButtonPrimary
            disabled={
              syncing ||
              !isBonding() ||
              !isMember() ||
              isReadOnlyAccount(activeAccount) ||
              state === 'Destroying'
            }
            marginRight
            onClick={() =>
              openModal({
                key: 'Unbond',
                options: { bondFor: 'pool' },
                size: 'sm',
              })
            }
            text="-"
          />
          <ButtonPrimary
            disabled={
              syncing || !isMember() || isReadOnlyAccount(activeAccount)
            }
            iconLeft={faLockOpen}
            onClick={() =>
              openModal({
                key: 'UnlockChunks',
                options: {
                  bondFor: 'pool',
                  disableWindowResize: true,
                  disableScroll: true,
                },
                size: 'sm',
              })
            }
            text={String(totalUnlockChunks ?? 0)}
          />
        </ButtonRow>
      </CardHeaderWrapper>
      <BondedChart
        active={planckToUnitBn(active, units)}
        unlocking={planckToUnitBn(totalUnlocking, units)}
        unlocked={planckToUnitBn(totalUnlocked, units)}
        free={planckToUnitBn(transferrableBalance, units)}
        inactive={active.isZero()}
      />
    </>
  )
}
