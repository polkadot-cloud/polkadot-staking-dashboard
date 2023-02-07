// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useTranslation } from 'react-i18next';
import { greaterThanZero, planckToUnit, rmCommas } from 'Utils';

export const PoolMemberBonded = ({ meta, batchKey, batchIndex }: any) => {
  const { t } = useTranslation('library');
  const { network } = useApi();
  const { units, unit } = network;

  const poolMembers = meta[batchKey]?.poolMembers ?? [];
  const poolMember = poolMembers[batchIndex] ?? null;

  let bonded = new BigNumber(0);
  let totalUnbonding = new BigNumber(0);

  let status = '';
  if (poolMember) {
    const { points, unbondingEras } = poolMember;

    bonded = planckToUnit(new BigNumber(rmCommas(points)), units);
    status = greaterThanZero(bonded) ? 'active' : 'inactive';

    // converting unbonding eras from points to units
    let totalUnbondingUnit = new BigNumber(0);
    Object.values(unbondingEras).forEach((amount: any) => {
      const amountBn = new BigNumber(rmCommas(amount));
      totalUnbondingUnit = totalUnbondingUnit.plus(amountBn);
    });
    totalUnbonding = planckToUnit(
      new BigNumber(totalUnbondingUnit),
      network.units
    );
  }

  return (
    <>
      {!poolMember ? (
        <ValidatorStatusWrapper status="inactive">
          <h5>{t('syncing')}...</h5>
        </ValidatorStatusWrapper>
      ) : (
        <>
          {greaterThanZero(bonded) && (
            <ValidatorStatusWrapper status={status}>
              <h5>
                {t('bonded')}: {bonded.decimalPlaces(3).toFormat()} {unit}
              </h5>
            </ValidatorStatusWrapper>
          )}
        </>
      )}

      {poolMember && greaterThanZero(totalUnbonding) && (
        <ValidatorStatusWrapper status="inactive">
          <h5>
            {t('unbonding')} {totalUnbonding.decimalPlaces(3).toFormat()} {unit}
          </h5>
        </ValidatorStatusWrapper>
      )}
    </>
  );
};
