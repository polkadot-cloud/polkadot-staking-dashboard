// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBolt, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { CardWrapper } from 'library/Graphs/Wrappers';
import useUnstaking from 'library/Hooks/useUnstaking';
import { ButtonRowWrapper, PageRowWrapper } from 'Wrappers';

export const UnstakePrompts = () => {
  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { mode } = useTheme();
  const { openModalWith } = useModal();
  const { networkSyncing } = useUi();
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
                {isFastUnstaking
                  ? 'Fast Unstake in Progress'
                  : 'Unstake in Progress'}
              </h3>
              <h4>
                {isFastUnstaking
                  ? 'You are in the fast unstake queue. You will not be able to carry out any staking functions while you are registered for fast unstake.'
                  : !canWithdrawUnlocks
                  ? `Waiting for unlocks to become available to withdraw.`
                  : `Your bonded funds are now unlocked and ready to withdraw.`}{' '}
                If you no longer wish to unstake, rebond your {network.unit} and
                start nominating again.
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
                        ? 'Unlocked'
                        : String(totalUnlockChuncks ?? 0)
                    }
                    disabled={false}
                    onClick={() =>
                      openModalWith(
                        'UnlockChunks',
                        { bondType: 'stake', poolClosure: true },
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
