// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useThemeValues } from 'contexts/ThemeValues'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useSyncing } from 'hooks/useSyncing'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { ButtonRow, Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const ClosurePrompts = () => {
  const { t } = useTranslation('pages')
  const { openModal } = useOverlay().modal
  const { getThemeValue } = useThemeValues()
  const { activeAddress } = useActiveAccounts()
  const { syncing } = useSyncing(['active-pools'])
  const { getTransferOptions } = useTransferOptions()
  const { isBonding, activePool, isDepositor, activePoolNominations } =
    useActivePool()

  const { state, memberCounter } = activePool?.bondedPool || {}
  const { active, totalUnlockChunks } = getTransferOptions(activeAddress).pool
  const targets = activePoolNominations?.targets ?? []

  // is the pool in a state for the depositor to close
  const depositorCanClose =
    !syncing && isDepositor() && state === 'Destroying' && memberCounter === 1

  // depositor needs to unbond funds
  const depositorCanUnbond = active > 0n && !targets.length

  // depositor can withdraw & close pool
  const depositorCanWithdraw =
    active === 0n && totalUnlockChunks === 0 && !targets.length

  return (
    state === 'Destroying' &&
    depositorCanClose && (
      <Page.Row>
        <CardWrapper
          style={{
            border: `1px solid ${getThemeValue('--accent-color-secondary')}`,
          }}
        >
          <div className="content">
            <h3>{t('destroyPool')}</h3>
            <h4>
              {t('leftThePool')}.{' '}
              {targets.length > 0
                ? t('stopNominating')
                : depositorCanWithdraw
                  ? t('closePool')
                  : depositorCanUnbond
                    ? t('unbondYourFunds')
                    : t('withdrawUnlock')}
            </h4>
            <ButtonRow yMargin>
              <ButtonPrimary
                marginRight
                text={t('unbond')}
                disabled={
                  syncing || (!depositorCanWithdraw && !depositorCanUnbond)
                }
                onClick={() =>
                  openModal({
                    key: 'LeavePool',
                    options: { bondFor: 'pool' },
                    size: 'sm',
                  })
                }
              />
              <ButtonPrimary
                iconLeft={faLockOpen}
                text={
                  depositorCanWithdraw
                    ? t('unlocked')
                    : String(totalUnlockChunks ?? 0)
                }
                disabled={syncing || !isBonding()}
                onClick={() =>
                  openModal({
                    key: 'UnlockChunks',
                    options: {
                      bondFor: 'pool',
                      poolClosure: true,
                      disableWindowResize: true,
                      disableScroll: true,
                    },
                    size: 'sm',
                  })
                }
              />
            </ButtonRow>
          </div>
        </CardWrapper>
      </Page.Row>
    )
  )
}
