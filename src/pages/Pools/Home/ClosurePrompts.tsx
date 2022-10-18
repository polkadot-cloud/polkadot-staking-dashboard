// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { PoolState } from 'contexts/Pools/types';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';
import { useUi } from 'contexts/UI';
import { Button, ButtonRow } from 'library/Button';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageRowWrapper } from 'Wrappers';

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
                  ? t('pages.pools.destroy_pool2')
                  : depositorCanWithdraw
                  ? t('pages.pools.destroy_pool3')
                  : depositorCanUnbond
                  ? t('pages.pools.destroy_pool4')
                  : t('pages.pools.destroy_pool5')}
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
