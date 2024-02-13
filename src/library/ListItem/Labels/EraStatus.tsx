// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter, planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useNetwork } from 'contexts/Network';
import type { EraStatusProps } from '../types';
import { useSyncing } from 'hooks/useSyncing';

export const EraStatus = ({ noMargin, status, totalStake }: EraStatusProps) => {
  const { t } = useTranslation('library');
  const { syncing } = useSyncing('*');
  const { unit, units } = useNetwork().networkData;

  // Fallback to `waiting` status if still syncing.
  const validatorStatus = syncing ? 'waiting' : status;

  return (
    <ValidatorStatusWrapper $status={validatorStatus} $noMargin={noMargin}>
      <h5>
        {syncing
          ? t('syncing')
          : validatorStatus !== 'waiting'
            ? `${t('listItemActive')} / ${planckToUnit(totalStake, units)
                .integerValue()
                .toFormat()} ${unit}`
            : capitalizeFirstLetter(t(`${validatorStatus}`) ?? '')}
      </h5>
    </ValidatorStatusWrapper>
  );
};
