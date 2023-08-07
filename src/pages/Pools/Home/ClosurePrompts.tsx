// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary, ButtonRow, PageRow } from '@polkadotcloud/core-ui';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { CardWrapper } from 'library/Card/Wrappers';

export const ClosurePrompts = () => {
  const { t } = useTranslation('pages');
  const { colors } = useApi().network;
  const { activeAccount } = useConnect();
  const { mode } = useTheme();
  const { openModalWith } = useModal();
  const { membership } = usePoolMemberships();
  const { isPoolSyncing } = useUi();
  const { isBonding, selectedActivePool, isDepositor, poolNominations } =
    useActivePools();
  const { getTransferOptions } = useTransferOptions();

  const { state, memberCounter } = selectedActivePool?.bondedPool || {};
  const { active, totalUnlockChuncks } = getTransferOptions(activeAccount).pool;
  const targets = poolNominations?.targets ?? [];
  const annuncementBorderColor = colors.secondary[mode];

  // is the pool in a state for the depositor to close
  const depositorCanClose =
    !isPoolSyncing &&
    isDepositor() &&
    state === 'Destroying' &&
    memberCounter === '1';

  // depositor needs to unbond funds
  const depositorCanUnbond = active.toNumber() > 0 && !targets.length;

  // depositor can withdraw & close pool
  const depositorCanWithdraw =
    active.toNumber() === 0 && totalUnlockChuncks === 0 && !targets.length;

  return (
    <>
      {depositorCanClose && (
        <PageRow>
          <CardWrapper
            style={{ border: `1px solid ${annuncementBorderColor}` }}
          >
            <div className="content">
              <h3>{t('pools.destroyPool')}</h3>
              <h4>
                {t('pools.leftThePool')}.{' '}
                {targets.length > 0
                  ? t('pools.stopNominating')
                  : depositorCanWithdraw
                  ? t('pools.closePool')
                  : depositorCanUnbond
                  ? t('pools.unbondYourFunds')
                  : t('pools.withdrawUnlock')}
              </h4>
              <ButtonRow yMargin>
                <ButtonPrimary
                  marginRight
                  text={t('pools.unbond')}
                  disabled={
                    isPoolSyncing ||
                    (!depositorCanWithdraw && !depositorCanUnbond)
                  }
                  onClick={() =>
                    openModalWith(
                      'UnbondPoolMember',
                      { who: activeAccount, member: membership },
                      'small'
                    )
                  }
                />
                <ButtonPrimary
                  iconLeft={faLockOpen}
                  text={
                    depositorCanWithdraw
                      ? t('pools.unlocked')
                      : String(totalUnlockChuncks ?? 0)
                  }
                  disabled={isPoolSyncing || !isBonding()}
                  onClick={() =>
                    openModalWith(
                      'UnlockChunks',
                      {
                        bondFor: 'pool',
                        poolClosure: true,
                        disableWindowResize: true,
                      },
                      'small'
                    )
                  }
                />
              </ButtonRow>
            </div>
          </CardWrapper>
        </PageRow>
      )}
    </>
  );
};
