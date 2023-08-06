// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalPadding } from '@polkadotcloud/core-ui';
import { unitToPlanck } from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useBatchCall } from 'library/Hooks/useBatchCall';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';

export const BalanceTest = () => {
  const { newBatchCall } = useBatchCall();
  const { api, network } = useApi();
  const { activeAccount } = useConnect();
  const { setStatus: setModalStatus } = useModal();
  const { units } = network;

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
