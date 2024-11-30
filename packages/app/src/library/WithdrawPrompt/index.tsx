// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from 'contexts/Api';
import { useNetwork } from 'contexts/Network';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { getUnixTime } from 'date-fns';
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft';
import { useSyncing } from 'hooks/useSyncing';
import { useOverlay } from 'kits/Overlay/Provider';
import { CardWrapper } from 'library/Card/Wrappers';
import { useTranslation } from 'react-i18next';
import type { BondFor } from 'types';
import { ButtonPrimary } from 'ui-buttons';
import { ButtonRow, PageRow } from 'ui-structure';
import { timeleftAsString } from 'utils';

export const WithdrawPrompt = ({ bondFor }: { bondFor: BondFor }) => {
  const { t } = useTranslation('modals');
  const { mode } = useTheme();
  const { consts } = useApi();
  const { activePool } = useActivePool();
  const { openModal } = useOverlay().modal;
  const { colors } = useNetwork().networkData;

  const { syncing } = useSyncing(['balances']);
  const { activeAccount } = useActiveAccounts();
  const { erasToSeconds } = useErasToTimeLeft();
  const { getTransferOptions } = useTransferOptions();
  const { state } = activePool?.bondedPool || {};

  const { bondDuration } = consts;
  const allTransferOptions = getTransferOptions(activeAccount);

  const totalUnlockChunks =
    bondFor === 'nominator'
      ? allTransferOptions.nominate.totalUnlockChunks
      : allTransferOptions.pool.totalUnlockChunks;

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  );

  // Check whether there are active unlock chunks.
  const displayPrompt = totalUnlockChunks > 0;

  return (
    /* NOTE: ClosurePrompts is a component that displays a prompt to the user when a pool is being
    destroyed. */
    state !== 'Destroying' &&
    displayPrompt && (
      <PageRow>
        <CardWrapper style={{ border: `1px solid ${colors.secondary[mode]}` }}>
          <div className="content">
            <h3>{t('unlocksInProgress')}</h3>
            <h4>{t('youHaveActiveUnlocks', { bondDurationFormatted })}</h4>
            <ButtonRow yMargin>
              <ButtonPrimary
                iconLeft={faLockOpen}
                text={t('manageUnlocks')}
                disabled={syncing}
                onClick={() =>
                  openModal({
                    key: 'UnlockChunks',
                    options: {
                      bondFor,
                      disableWindowResize: true,
                      disableScroll: true,
                      // NOTE: This will always be false as a different prompt is displayed when a
                      // pool is being destroyed.
                      poolClosure: false,
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
