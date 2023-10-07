// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalPadding } from '@polkadot-cloud/react';
import { unitToPlanck } from '@polkadot-cloud/utils';
import { useApi } from 'contexts/Api';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useTxMeta } from 'contexts/TxMeta';
import { useBatchCall } from 'library/Hooks/useBatchCall';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect } from 'react';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';

export const BalanceTest = () => {
  const { api } = useApi();
  const {
    networkData: { units },
  } = useNetwork();
  const { activeAccount } = useActiveAccounts();
  const { notEnoughFunds } = useTxMeta();
  const { newBatchCall } = useBatchCall();
  const { setModalStatus, setModalResize } = useOverlay().modal;

  // tx to submit
  const getTx = () => {
    const tx = null;
    if (!api || !activeAccount) {
      return tx;
    }

    const txs = [
      api.tx.balances.transfer(
        {
          id: '1554u1a67ApEt5xmjbZwjgDNaVckbzB6cjRHWAQ1SpNkNxTd',
        },
        unitToPlanck('0.1', units).toString()
      ),
      api.tx.balances.transfer(
        {
          id: '1554u1a67ApEt5xmjbZwjgDNaVckbzB6cjRHWAQ1SpNkNxTd',
        },
        unitToPlanck('0.05', units).toString()
      ),
    ];
    const batch = newBatchCall(txs, activeAccount);

    return batch;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
    callbackInBlock: () => {},
  });

  useEffect(() => setModalResize(), [notEnoughFunds]);

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">Balance Test</h2>
      </ModalPadding>
      <SubmitTx valid {...submitExtrinsic} />
    </>
  );
};
