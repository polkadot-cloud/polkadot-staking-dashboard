// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import { ZondaxMetadataHashApiUrl } from 'consts';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useNetwork } from 'contexts/Network';
import { useTxMeta } from 'contexts/TxMeta';
import type { AnyApi } from 'types';

export const useBuildPayload = () => {
  const { api } = useApi();
  const { getNonce } = useBalances();
  const {
    networkData: { unit },
  } = useNetwork();
  const { getAccount } = useImportedAccounts();

  const { setTxPayload } = useTxMeta();

  // Request a metadata hash from Zondax API service.
  const fetchMetadataHash = async () => {
    const requestMetadataHash = await fetch(ZondaxMetadataHashApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: unit.toLowerCase() }),
    });

    const response = await requestMetadataHash.json();

    return `0x${response.metadataHash}`;
  };

  // Build and set payload of the transaction and store it in TxMetaContext.
  const buildPayload = async (tx: AnyApi, from: string, uid: number) => {
    if (api && tx) {
      const accountMeta = getAccount(from);
      const source = accountMeta?.source;

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

      // Construct the payload value.
      const payload: AnyJson = {
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

      // If the source is `ledger`, add the metadata hash to the payload.
      if (source === 'ledger') {
        const metadataHash = await fetchMetadataHash();
        payload.mode = 1;
        payload.metadataHash = metadataHash;
      }

      // Create the payload bytes.
      const payloadBytes = api.registry.createType(
        'ExtrinsicPayload',
        payload,
        {
          version: payload.version,
        }
      );

      // Persist both the payload and the payload bytes in state, indexed by its uid.
      setTxPayload(payloadBytes, payload, uid);
    }
  };

  return {
    buildPayload,
  };
};
