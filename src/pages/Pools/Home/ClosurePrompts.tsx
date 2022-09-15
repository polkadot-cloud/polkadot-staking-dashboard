// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRowWrapper } from 'Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTheme } from 'contexts/Themes';
import { PoolState } from 'contexts/Pools/types';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { Button, ButtonRow } from 'library/Button';
import { useModal } from 'contexts/Modal';
import { useConnect } from 'contexts/Connect';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useUi } from 'contexts/UI';

export const ClosurePrompts = () => {
  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { mode } = useTheme();
  const { openModalWith } = useModal();
  const { membership } = usePoolMemberships();
  const { isSyncing } = useUi();
  const {
    isBonding,
    activeBondedPool,
    isDepositor,
    getPoolTransferOptions,
    poolNominations,
  } = useActivePool();

  const { state, memberCounter } = activeBondedPool?.bondedPool || {};
  const { active, totalUnlockChuncks } = getPoolTransferOptions(activeAccount);
  const targets = poolNominations?.targets ?? [];

  const networkColorsSecondary: any = network.colors.secondary;
  const annuncementBorderColor = networkColorsSecondary[mode];

  // is the pool in a state for the depositor to close
  const depositorCanClose =
    !isSyncing &&
    isDepositor() &&
    state === PoolState.Destroy &&
    memberCounter === '1' &&
    !targets.length;

  // depositor needs to unbond funds
  const depositorCanUnbond = active.toNumber() > 0 && !targets.length;

  // depositor can withdraw & close pool
  const depositorCanWithdraw =
    active.toNumber() === 0 && totalUnlockChuncks === 0 && !targets.length;

  return (
    <>
      {depositorCanClose && (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
          <CardWrapper
            style={{ border: `1px solid ${annuncementBorderColor}` }}
          >
            <div className="content">
              <h3>Destroy Pool</h3>
              <h4>
                All members have now left the pool.{' '}
                {targets.length > 0
                  ? 'To continue with pool closure, stop nominating.'
                  : depositorCanWithdraw
                  ? 'You can now withdraw and close the pool.'
                  : depositorCanUnbond
                  ? 'You can now unbond your funds.'
                  : 'Withdraw your unlock chunk to proceed with pool closure.'}
              </h4>
              <ButtonRow verticalSpacing>
                <Button
                  small
                  primary
                  inline
                  title="Unbond"
                  disabled={
                    isSyncing || (!depositorCanWithdraw && !depositorCanUnbond)
                  }
                  onClick={() =>
                    openModalWith(
                      'UnbondPoolMember',
                      { who: activeAccount, member: membership },
                      'small'
                    )
                  }
                />
                <Button
                  small
                  primary
                  icon={faLockOpen}
                  title={String(totalUnlockChuncks ?? 0)}
                  disabled={isSyncing || !isBonding()}
                  onClick={() =>
                    openModalWith(
                      'UnlockChunks',
                      { bondType: 'pool', poolClosure: true },
                      'small'
                    )
                  }
                />
              </ButtonRow>
            </div>
          </CardWrapper>
        </PageRowWrapper>
      )}
    </>
  );
};
