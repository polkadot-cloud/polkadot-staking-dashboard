// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useTxMeta } from 'contexts/TxMeta';
import type { AnyApi } from 'types';

export const useBuildPayload = () => {
  const { api } = useApi();
  const { getNonce } = useBalances();
  const { setTxPayload } = useTxMeta();

  // Build and set payload of the transaction and store it in TxMetaContext.
  const buildPayload = async (tx: AnyApi, from: string, uid: number) => {
    if (api && tx) {
      const lastHeader = await api.rpc.chain.getHeader();
      const blockNumber = api.registry.createType(
        'BlockNumber',
        lastHeader.number.toNumber()
      );
      const method = api.createType('Call', tx);
      const era = api.registry.createType('ExtrinsicEra', {
        current: lastHeader.number.toNumber(),
        period: 64,
      });

      const accountNonce = getNonce(from);
      const nonce = api.registry.createType('Compact<Index>', accountNonce);

      const payload = {
        specVersion: api.runtimeVersion.specVersion.toHex(),
        transactionVersion: api.runtimeVersion.transactionVersion.toHex(),
        address: from,
        blockHash: lastHeader.hash.toHex(),
        blockNumber: blockNumber.toHex(),
        era: era.toHex(),
        genesisHash: api.genesisHash.toHex(),
        method: method.toHex(),
        nonce: nonce.toHex(),
        signedExtensions: api.registry.signedExtensions,
        tip: api.registry.createType('Compact<Balance>', 0).toHex(),
        version: tx.version,
      };
      const raw = api.registry.createType('ExtrinsicPayload', payload, {
        version: payload.version,
      });
      setTxPayload(raw, uid);
    }
  };

  return {
    buildPayload,
  };
};
