// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import { useTxMeta } from 'contexts/TxMeta';
import { ApiController } from 'controllers/Api';
import { useBatchCall } from 'hooks/useBatchCall';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect } from 'react';

export const BalanceTest = () => {
  const {
    network,
    networkData: { units },
  } = useNetwork();
  const { notEnoughFunds } = useTxMeta();
  const { newBatchCall } = useBatchCall();
  const { activeAccount } = useActiveAccounts();
  const { setModalResize, setModalStatus } = useOverlay().modal;

  // tx to submit
  const getTx = () => {
    const pApi = ApiController.getApi(network);

    const tx = null;
    if (!pApi || !activeAccount) {
      return tx;
    }

    const txs = [
      pApi.tx.Balances.transfer_keep_alive({
        dest: {
          type: 'Id',
          value: '1554u1a67ApEt5xmjbZwjgDNaVckbzB6cjRHWAQ1SpNkNxTd',
        },
        value: BigInt(unitToPlanck('0.1', units).toString()),
      }),
      pApi.tx.Balances.transfer_keep_alive({
        dest: {
          type: 'Id',
          value: '1554u1a67ApEt5xmjbZwjgDNaVckbzB6cjRHWAQ1SpNkNxTd',
        },
        value: BigInt(unitToPlanck('0.1', units).toString()),
      }),
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
