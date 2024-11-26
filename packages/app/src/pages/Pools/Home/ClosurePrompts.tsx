// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useSyncing } from 'hooks/useSyncing';
import { useOverlay } from 'kits/Overlay/Provider';
import { CardWrapper } from 'library/Card/Wrappers';
import { useTranslation } from 'react-i18next';
import { ButtonPrimary } from 'ui-buttons';
import { ButtonRow, PageRow } from 'ui-structure';

export const ClosurePrompts = () => {
  const { t } = useTranslation('pages');
  const { mode } = useTheme();
  const { openModal } = useOverlay().modal;
  const { colors } = useNetwork().networkData;
  const { activeAccount } = useActiveAccounts();
  const { syncing } = useSyncing(['active-pools']);
  const { getTransferOptions } = useTransferOptions();
  const { isBonding, activePool, isDepositor, activePoolNominations } =
    useActivePool();

  const { state, memberCounter } = activePool?.bondedPool || {};
  const { active, totalUnlockChunks } = getTransferOptions(activeAccount).pool;
  const targets = activePoolNominations?.targets ?? [];
  const annuncementBorderColor = colors.secondary[mode];

  // is the pool in a state for the depositor to close
  const depositorCanClose =
    !syncing &&
    isDepositor() &&
    state === 'Destroying' &&
    memberCounter === '1';

  // depositor needs to unbond funds
  const depositorCanUnbond = active.toNumber() > 0 && !targets.length;

  // depositor can withdraw & close pool
  const depositorCanWithdraw =
    active.toNumber() === 0 && totalUnlockChunks === 0 && !targets.length;

  return (
    state === 'Destroying' &&
    depositorCanClose && (
      <PageRow>
        <CardWrapper style={{ border: `1px solid ${annuncementBorderColor}` }}>
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
                  syncing || (!depositorCanWithdraw && !depositorCanUnbond)
                }
                onClick={() =>
                  openModal({
                    key: 'Unbond',
                    options: { bondFor: 'pool' },
                    size: 'sm',
                  })
                }
              />
              <ButtonPrimary
                iconLeft={faLockOpen}
                text={
                  depositorCanWithdraw
                    ? t('pools.unlocked')
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
      </PageRow>
    )
  );
};
