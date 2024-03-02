// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { PageRow } from 'kits/Structure/PageRow';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { CardWrapper } from 'library/Card/Wrappers';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useSyncing } from 'hooks/useSyncing';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { ButtonRow } from 'kits/Structure/ButtonRow';
import { timeleftAsString } from 'hooks/useTimeLeft/utils';
import { getUnixTime } from 'date-fns';
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft';
import { useApi } from 'contexts/Api';
import { useTranslation } from 'react-i18next';
import type { BondFor } from 'types';

export const WithdrawPrompt = ({ bondFor }: { bondFor: BondFor }) => {
  const { t } = useTranslation('modals');
  const { mode } = useTheme();
  const { consts } = useApi();
  const { openModal } = useOverlay().modal;
  const { colors } = useNetwork().networkData;
  const { activeAccount } = useActiveAccounts();
  const { syncing } = useSyncing(['balances']);
  const { erasToSeconds } = useErasToTimeLeft();
  const { getTransferOptions } = useTransferOptions();

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

  // Check whether there are ongonig unlock chunks.
  const displayPrompt = totalUnlockChunks > 0;

  return (
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
