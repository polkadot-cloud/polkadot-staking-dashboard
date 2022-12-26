// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBolt, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useSetup } from 'contexts/Setup';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { CardWrapper } from 'library/Graphs/Wrappers';
import useUnstaking from 'library/Hooks/useUnstaking';
import { useTranslation } from 'react-i18next';
import { ButtonRowWrapper, PageRowWrapper } from 'Wrappers';

export const UnstakePrompts = () => {
  const { t } = useTranslation('pages');
  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { mode } = useTheme();
  const { openModalWith } = useModal();
  const { networkSyncing } = useSetup();
  const { isFastUnstaking, isUnstaking, getFastUnstakeText } = useUnstaking();
  const { getTransferOptions } = useTransferOptions();
  const { active, totalUnlockChuncks, totalUnlocked, totalUnlocking } =
    getTransferOptions(activeAccount).nominate;

  const networkColorsSecondary: any = network.colors.secondary;
  const annuncementBorderColor = networkColorsSecondary[mode];

  // unstaking can withdraw
  const canWithdrawUnlocks =
    isUnstaking &&
    active.isZero() &&
    totalUnlocking.isZero() &&
    !totalUnlocked.isZero();

  return (
    <>
      {(isUnstaking || isFastUnstaking) && !networkSyncing && (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
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
                      { unit: network.unit }
                    )}`}
              </h4>
              <ButtonRowWrapper verticalSpacing>
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
                        { bondFor: 'nominator', poolClosure: true },
                        'small'
                      )
                    }
                  />
                )}
              </ButtonRowWrapper>
            </div>
          </CardWrapper>
        </PageRowWrapper>
      )}
    </>
  );
};
