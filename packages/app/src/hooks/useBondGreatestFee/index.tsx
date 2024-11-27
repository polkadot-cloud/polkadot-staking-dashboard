// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import { useTransferOptions } from 'contexts/TransferOptions';
import { ApiController } from 'controllers/Api';
import { useEffect, useMemo, useState } from 'react';
import type { BondFor } from 'types';

export const useBondGreatestFee = ({ bondFor }: { bondFor: BondFor }) => {
  const { network } = useNetwork();
  const { activeAccount } = useActiveAccounts();
  const { feeReserve, getTransferOptions } = useTransferOptions();
  const transferOptions = useMemo(
    () => getTransferOptions(activeAccount),
    [activeAccount]
  );
  const { transferrableBalance } = transferOptions;

  // store the largest possible tx fees for bonding.
  const [largestTxFee, setLargestTxFee] = useState<BigNumber>(new BigNumber(0));

  // update max tx fee on free balance change
  useEffect(() => {
    handleFetch();
  }, [transferOptions]);

  // handle fee fetching
  const handleFetch = async () => {
    const largestFee = await txLargestFee();
    setLargestTxFee(largestFee);
  };

  // estimate the largest possible tx fee based on users free balance.
  const txLargestFee = async () => {
    const api = ApiController.getApi(network);

    const bond = BigNumber.max(
      transferrableBalance.minus(feeReserve),
      0
    ).toString();

    let tx = null;
    if (!api) {
      return new BigNumber(0);
    }
    if (bondFor === 'pool') {
      tx = api.tx.NominationPools.bond_extra({
        extra: {
          type: 'FreeBalance',
          value: BigInt(bond),
        },
      });
    } else if (bondFor === 'nominator') {
      tx = api.tx.Staking.bond_extra({ max_additional: BigInt(bond) });
    }

    if (tx) {
      const { partial_fee } = await tx.getPaymentInfo(activeAccount || '');
      return new BigNumber(partial_fee.toString());
    }
    return new BigNumber(0);
  };

  return largestTxFee;
};
