// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter } from '@w3ux/utils';
import { useNetwork } from 'contexts/Network';
import { useSyncing } from 'hooks/useSyncing';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { planckToUnitBn } from 'library/Utils';
import { useTranslation } from 'react-i18next';
import type { EraStatusProps } from '../types';

export const EraStatus = ({ noMargin, status, totalStake }: EraStatusProps) => {
  const { t } = useTranslation('library');
  const { syncing } = useSyncing();
  const { unit, units } = useNetwork().networkData;

  // Fallback to `waiting` status if still syncing.
  const validatorStatus = syncing ? 'waiting' : status;

  return (
    <ValidatorStatusWrapper $status={validatorStatus} $noMargin={noMargin}>
      <h5>
        {syncing
          ? t('syncing')
          : validatorStatus !== 'waiting'
            ? `${t('listItemActive')} / ${planckToUnitBn(totalStake, units)
                .integerValue()
                .toFormat()} ${unit}`
            : capitalizeFirstLetter(t(`${validatorStatus}`) ?? '')}
      </h5>
    </ValidatorStatusWrapper>
  );
};
