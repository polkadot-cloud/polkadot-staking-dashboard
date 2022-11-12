// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  bondType: string;
}

export const useBondGreatestFee = ({ bondType }: Props) => {
  const { api } = useApi();
  const { activeAccount } = useConnect();
  const { getTransferOptions } = useTransferOptions();
  const transferOptions = useMemo(
    () => getTransferOptions(activeAccount),
    [activeAccount]
  );
  const { freeBalance } = transferOptions;

  // store the largest possible tx fees for bonding.
  const [largestTxFee, setLargestTxFee] = useState<BN>(new BN(0));

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
    const bond = freeBalance.toString();

    let _tx = null;
    if (!api) {
      return new BN(0);
    }
    if (bondType === 'pool') {
      _tx = api.tx.nominationPools.bondExtra({
        FreeBalance: bond,
      });
    } else if (bondType === 'stake') {
      _tx = api.tx.staking.bondExtra(bond);
    }

    if (_tx) {
      const { partialFee } = await _tx.paymentInfo(activeAccount || '');
      return new BN(partialFee.toString());
    }
    return new BN(0);
  };

  return largestTxFee;
};

export default useBondGreatestFee;
