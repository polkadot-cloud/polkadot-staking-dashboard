// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import {
  humanNumber,
  planckBnToUnit,
  rmCommas,
  toFixedIfNecessary,
} from 'Utils';
import { useTranslation } from 'react-i18next';

export const PoolMemberBonded = (props: any) => {
  const { meta, batchKey, batchIndex, who } = props;
  const { network } = useApi();
  const { units, unit } = network;
  const { t } = useTranslation('common');

  const poolMembers = meta[batchKey]?.poolMembers ?? [];
  const poolMember = poolMembers[batchIndex] ?? null;

  let bonded = 0;
  let status = '';
  let totalUnbonding = 0;
  if (poolMember) {
    const { points, unbondingEras } = poolMember;

    bonded = planckBnToUnit(new BN(rmCommas(points)), units);
    status = bonded > 0 ? 'active' : 'inactive';

    // converting unbonding eras from points to units
    let totalUnbondingBase: BN = new BN(0);
    Object.values(unbondingEras).forEach((amount: any) => {
      const amountBn: BN = new BN(rmCommas(amount));
      totalUnbondingBase = totalUnbondingBase.add(amountBn);
    });
    totalUnbonding = planckBnToUnit(new BN(totalUnbondingBase), network.units);
  }

  return (
    <>
      {!poolMember ? (
        <ValidatorStatusWrapper status="inactive">
          <h5>{t('library.syncing')}</h5>
        </ValidatorStatusWrapper>
      ) : (
        <>
          {bonded > 0 && (
            <ValidatorStatusWrapper status={status}>
              <h5>
                {t('library.bonded')}{' '}
                {humanNumber(toFixedIfNecessary(bonded, 3))} {unit}
              </h5>
            </ValidatorStatusWrapper>
          )}
        </>
      )}

      {poolMember && totalUnbonding > 0 && (
        <ValidatorStatusWrapper status="inactive">
          <h5>
            {t('library.unbonding')}{' '}
            {humanNumber(toFixedIfNecessary(totalUnbonding, 3))} {unit}
          </h5>
        </ValidatorStatusWrapper>
      )}
    </>
  );
};
