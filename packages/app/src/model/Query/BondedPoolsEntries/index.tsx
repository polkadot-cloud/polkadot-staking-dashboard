// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { perbillToPercent } from 'library/Utils';
import type { PapiApi } from 'model/Api/types';
import type { AnyApi } from 'types';

export class BondedPoolsEntries {
  #pApi: PapiApi;

  bondedPools: AnyApi = {};

  constructor(pApi: PapiApi) {
    this.#pApi = pApi;
  }

  async fetch() {
    this.bondedPools =
      await this.#pApi.query.NominationPools.BondedPools.getEntries();
    return this;
  }

  format() {
    return Object.fromEntries(
      this.bondedPools.map(
        ({ keyArgs, value }: { keyArgs: [number]; value: AnyApi }) => {
          const id = keyArgs[0];

          const maybeCommissionCurrent = value.commission.current;
          const commissionCurrent = !maybeCommissionCurrent
            ? null
            : [
                perbillToPercent(maybeCommissionCurrent[0]).toString(),
                maybeCommissionCurrent[1],
              ];

          const commissionMax = value.commission.max;
          const commissionMaxPercent = !commissionMax
            ? null
            : perbillToPercent(new BigNumber(value.commission.max));

          const commissionChangeRate = value.commission.change_rate;

          const commission = {
            current: commissionCurrent,
            claimPermission: value.commission.claim_permission?.type || null,
            max: commissionMaxPercent,
            changeRate: commissionChangeRate || null,
            throttleFrom: value.commission.throttle_from || null,
          };

          const pool = {
            commission,
            points: value.points.toString(),
            memberCounter: value.member_counter.toString(),
            roles: value.roles,
            state: value.state.type,
          };

          return [id, pool];
        }
      )
    );
  }
}
