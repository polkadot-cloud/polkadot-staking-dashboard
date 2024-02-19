// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBolt, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { PageRow } from '@polkadot-cloud/react';
import { isNotZero } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { CardWrapper } from 'library/Card/Wrappers';
import { useUnstaking } from 'hooks/useUnstaking';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useSyncing } from 'hooks/useSyncing';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { ButtonRow } from 'kits/Structure/ButtonRow';

export const UnstakePrompts = () => {
  const { t } = useTranslation('pages');
  const { mode } = useTheme();
  const { syncing } = useSyncing('*');
  const { openModal } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { unit, colors } = useNetwork().networkData;
  const { isFastUnstaking, isUnstaking, getFastUnstakeText } = useUnstaking();

  const { getTransferOptions } = useTransferOptions();
  const { active, totalUnlockChunks, totalUnlocked, totalUnlocking } =
    getTransferOptions(activeAccount).nominate;
  const annuncementBorderColor = colors.secondary[mode];

  // unstaking can withdraw
  const canWithdrawUnlocks =
    isUnstaking &&
    active.isZero() &&
    totalUnlocking.isZero() &&
    isNotZero(totalUnlocked);

  return (
    (isUnstaking || isFastUnstaking) &&
    !syncing && (
      <PageRow>
        <CardWrapper style={{ border: `1px solid ${annuncementBorderColor}` }}>
          <div className="content">
            <h3>
              {t('nominate.unstakePromptInProgress', {
                context: isFastUnstaking ? 'fast' : 'regular',
              })}
            </h3>
            <h4>
              {isFastUnstaking
                ? t('nominate.unstakePromptInQueue')
                : !canWithdrawUnlocks
                  ? t('nominate.unstakePromptWaitingForUnlocks')
                  : `${t('nominate.unstakePromptReadyToWithdraw')} ${t(
                      'nominate.unstakePromptRevert',
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
                      ? t('nominate.unlocked')
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
      </PageRow>
    )
  );
};
