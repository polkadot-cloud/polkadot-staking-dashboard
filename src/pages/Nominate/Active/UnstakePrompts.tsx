// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBolt, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary, ButtonRow, PageRow } from '@polkadotcloud/core-ui';
import { isNotZero } from '@polkadotcloud/utils';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { CardWrapper } from 'library/Card/Wrappers';
import { useUnstaking } from 'library/Hooks/useUnstaking';

export const UnstakePrompts = () => {
  const { t } = useTranslation('pages');
  const { unit, colors } = useApi().network;
  const { activeAccount } = useConnect();
  const { mode } = useTheme();
  const { openModalWith } = useModal();
  const { isNetworkSyncing } = useUi();
  const { isFastUnstaking, isUnstaking, getFastUnstakeText } = useUnstaking();
  const { getTransferOptions } = useTransferOptions();
  const { active, totalUnlockChuncks, totalUnlocked, totalUnlocking } =
    getTransferOptions(activeAccount).nominate;
  const annuncementBorderColor = colors.secondary[mode];

  // unstaking can withdraw
  const canWithdrawUnlocks =
    isUnstaking &&
    active.isZero() &&
    totalUnlocking.isZero() &&
    isNotZero(totalUnlocked);

  return (
    <>
      {(isUnstaking || isFastUnstaking) && !isNetworkSyncing && (
        <PageRow>
          <CardWrapper
            style={{ border: `1px solid ${annuncementBorderColor}` }}
          >
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
                      openModalWith('ManageFastUnstake', {}, 'small')
                    }
                  />
                ) : (
                  <ButtonPrimary
                    iconLeft={faLockOpen}
                    text={
                      canWithdrawUnlocks
                        ? t('nominate.unlocked')
                        : String(totalUnlockChuncks ?? 0)
                    }
                    disabled={false}
                    onClick={() =>
                      openModalWith(
                        'UnlockChunks',
                        {
                          bondFor: 'nominator',
                          poolClosure: true,
                          disableWindowResize: true,
                        },
                        'small'
                      )
                    }
                  />
                )}
              </ButtonRow>
            </div>
          </CardWrapper>
        </PageRow>
      )}
    </>
  );
};
