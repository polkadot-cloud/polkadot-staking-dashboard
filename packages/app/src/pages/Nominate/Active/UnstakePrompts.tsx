// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBolt, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useThemeValues } from 'contexts/ThemeValues'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useSyncing } from 'hooks/useSyncing'
import { useUnstaking } from 'hooks/useUnstaking'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { ButtonRow, Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const UnstakePrompts = () => {
  const { t } = useTranslation('pages')
  const { syncing } = useSyncing()
  const { inSetup } = useStaking()
  const { network } = useNetwork()
  const { openModal } = useOverlay().modal
  const { getThemeValue } = useThemeValues()
  const { activeAddress } = useActiveAccounts()
  const { isFastUnstaking, isUnstaking, getFastUnstakeText } = useUnstaking()

  const { unit } = getNetworkData(network)
  const { getTransferOptions } = useTransferOptions()
  const { active, totalUnlockChunks, totalUnlocked, totalUnlocking } =
    getTransferOptions(activeAddress).nominate

  // unstaking can withdraw
  const canWithdrawUnlocks =
    isUnstaking &&
    active === 0n &&
    totalUnlocking.isZero() &&
    !totalUnlocked.isZero()

  return (
    !inSetup() &&
    (isUnstaking || isFastUnstaking) &&
    !syncing && (
      <Page.Row>
        <CardWrapper
          style={{
            border: `1px solid ${getThemeValue('--accent-color-secondary')}`,
          }}
        >
          <div className="content">
            <h3>
              {t('unstakePromptInProgress', {
                context: isFastUnstaking ? 'fast' : 'regular',
              })}
            </h3>
            <h4>
              {isFastUnstaking
                ? t('unstakePromptInQueue')
                : !canWithdrawUnlocks
                  ? t('unstakePromptWaitingForUnlocks')
                  : `${t('unstakePromptReadyToWithdraw')} ${t(
                      'unstakePromptRevert',
                      { unit }
                    )}`}
            </h4>
            <ButtonRow yMargin>
              {isFastUnstaking ? (
                <ButtonPrimary
                  marginRight
                  iconLeft={faBolt}
                  text={getFastUnstakeText()}
                  onClick={() =>
                    openModal({ key: 'ManageFastUnstake', size: 'sm' })
                  }
                />
              ) : (
                <ButtonPrimary
                  iconLeft={faLockOpen}
                  text={
                    canWithdrawUnlocks
                      ? t('unlocked')
                      : String(totalUnlockChunks ?? 0)
                  }
                  disabled={false}
                  onClick={() =>
                    openModal({
                      key: 'UnlockChunks',
                      options: {
                        bondFor: 'nominator',
                        poolClosure: true,
                        disableWindowResize: true,
                        disableScroll: true,
                      },
                      size: 'sm',
                    })
                  }
                />
              )}
            </ButtonRow>
          </div>
        </CardWrapper>
      </Page.Row>
    )
  )
}
