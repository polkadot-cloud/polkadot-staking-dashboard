// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useTranslation } from 'react-i18next';
import { humanNumber, planckToUnit, rmCommas, toFixedIfNecessary } from 'Utils';

export const PoolMemberBonded = (props: any) => {
  const { meta, batchKey, batchIndex } = props;
  const { network } = useApi();
  const { units, unit } = network;
  const { t } = useTranslation('library');

  const poolMembers = meta[batchKey]?.poolMembers ?? [];
  const poolMember = poolMembers[batchIndex] ?? null;

  let bonded = 0;
  let status = '';
  let totalUnbonding = 0;
  if (poolMember) {
    const { points, unbondingEras } = poolMember;

    bonded = planckToUnit(new BigNumber(rmCommas(points)), units);
    status = bonded > 0 ? 'active' : 'inactive';

    // converting unbonding eras from points to units
    let totalUnbondingBase = new BigNumber(0);
    Object.values(unbondingEras).forEach((amount: any) => {
      const amountBn = new BigNumber(rmCommas(amount));
      totalUnbondingBase = totalUnbondingBase.plus(amountBn);
    });
    totalUnbonding = planckToUnit(
      new BigNumber(totalUnbondingBase),
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
          {bonded > 0 && (
            <ValidatorStatusWrapper status={status}>
              <h5>
                {t('bonded')}: {humanNumber(toFixedIfNecessary(bonded, 3))}{' '}
                {unit}
              </h5>
            </ValidatorStatusWrapper>
          )}
        </>
      )}

      {poolMember && totalUnbonding > 0 && (
        <ValidatorStatusWrapper status="inactive">
          <h5>
            {t('unbonding')}{' '}
            {humanNumber(toFixedIfNecessary(totalUnbonding, 3))} {unit}
          </h5>
        </ValidatorStatusWrapper>
      )}
    </>
  );
};
