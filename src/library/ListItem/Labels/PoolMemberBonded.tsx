// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useNetwork } from 'contexts/Network';
import type { AnyMetaBatch } from 'types';
import { planckToUnitBn } from 'Utils';

export const PoolMemberBonded = ({
  meta,
  batchKey,
  batchIndex,
}: {
  meta: AnyMetaBatch;
  batchKey: string;
  batchIndex: number;
}) => {
  const { t } = useTranslation('library');
  const { units, unit } = useNetwork().networkData;

  const poolMembers = meta[batchKey]?.poolMembers ?? [];
  const poolMember = poolMembers[batchIndex] ?? null;

  let bonded = new BigNumber(0);
  let totalUnbonding = new BigNumber(0);

  let status = '';
  if (poolMember) {
    const { points, unbondingEras } = poolMember;

    bonded = planckToUnitBn(new BigNumber(rmCommas(points)), units);
    status = bonded.isGreaterThan(0) ? 'active' : 'inactive';

    // converting unbonding eras from points to units
    let totalUnbondingUnit = new BigNumber(0);
    Object.values(unbondingEras).forEach((amount) => {
      const amountBn = new BigNumber(rmCommas(amount as string));
      totalUnbondingUnit = totalUnbondingUnit.plus(amountBn);
    });
    totalUnbonding = planckToUnitBn(new BigNumber(totalUnbondingUnit), units);
  }

  return (
    <>
      {!poolMember ? (
        <ValidatorStatusWrapper $status="inactive">
          <h5>{t('syncing')}...</h5>
        </ValidatorStatusWrapper>
      ) : (
        bonded.isGreaterThan(0) && (
          <ValidatorStatusWrapper $status={status}>
            <h5>
              {t('bonded')}: {bonded.decimalPlaces(3).toFormat()} {unit}
            </h5>
          </ValidatorStatusWrapper>
        )
      )}

      {poolMember && totalUnbonding.isGreaterThan(0) && (
        <ValidatorStatusWrapper $status="inactive">
          <h5>
            {t('unbonding')} {totalUnbonding.decimalPlaces(3).toFormat()} {unit}
          </h5>
        </ValidatorStatusWrapper>
      )}
    </>
  );
};
