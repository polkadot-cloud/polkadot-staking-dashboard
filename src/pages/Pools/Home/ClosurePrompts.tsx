// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRowWrapper } from 'Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTheme } from 'contexts/Themes';
import { PoolState } from 'contexts/Pools/types';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { Button, ButtonRow } from 'library/Button';
import { useModal } from 'contexts/Modal';
import { useConnect } from 'contexts/Connect';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useUi } from 'contexts/UI';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';

export const ClosurePrompts = () => {
  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { mode } = useTheme();
  const { openModalWith } = useModal();
  const { membership } = usePoolMemberships();
  const { isSyncing } = useUi();
  const { isBonding, selectedActivePool, isDepositor, poolNominations } =
    useActivePools();
  const { getTransferOptions } = useTransferOptions();
  const { t } = useTranslation('common');

  const { state, memberCounter } = selectedActivePool?.bondedPool || {};
  const { active, totalUnlockChuncks } = getTransferOptions(activeAccount).pool;
  const targets = poolNominations?.targets ?? [];

  const networkColorsSecondary: any = network.colors.secondary;
  const annuncementBorderColor = networkColorsSecondary[mode];

  // is the pool in a state for the depositor to close
  const depositorCanClose =
    !isSyncing &&
    isDepositor() &&
    state === PoolState.Destroy &&
    memberCounter === '1';

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
              <h3>{t('pages.pools.destroy_pool')}</h3>
              <h4>
                {t('pages.pools.destroy_pool1')}{' '}
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
                  title={t('pages.pools.unbond')}
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
