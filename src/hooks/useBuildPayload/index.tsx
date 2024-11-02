// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { merkleizeMetadata } from '@polkadot-api/merkleize-metadata';
import type { ApiPromise } from '@polkadot/api';
import { objectSpread, u8aToHex } from '@polkadot/util';
import type { AnyJson } from '@w3ux/types';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useTxMeta } from 'contexts/TxMeta';
import type { AnyApi } from 'types';

export const useBuildPayload = () => {
  const { api } = useApi();
  const { getNonce } = useBalances();
  const { setTxPayload } = useTxMeta();
  const { getAccount } = useImportedAccounts();

  // Build metadata hash and return updated payload.
  const fetchMetadataHash = async (a: ApiPromise, p: AnyJson) => {
    const metadata = await a.call.metadata.metadataAtVersion(15);
    const { specName, specVersion } = a.runtimeVersion;

    const opts = {
      base58Prefix: Number(a.consts.system.ss58Prefix.toString()),
      decimals: a.registry.chainDecimals[0],
      specName: specName.toString(),
      specVersion: specVersion.toNumber(),
      tokenSymbol: a.registry.chainTokens[0],
    };

    const merkleizedMetadata = merkleizeMetadata(metadata.toHex(), opts);
    const metadataHash = u8aToHex(merkleizedMetadata.digest());
    const payload = objectSpread({}, p, {
      metadataHash,
      mode: 1,
      withSignedTransaction: true,
    });
    const newPayload = a.registry.createType('ExtrinsicPayload', payload);

    return {
      newPayload,
      newTxMetadata: merkleizedMetadata.getProofForExtrinsicPayload(
        u8aToHex(newPayload.toU8a(true))
      ),
    };
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
      const payloadJson: AnyJson = {
        specVersion: api.runtimeVersion.specVersion.toHex(),
        transactionVersion: api.runtimeVersion.transactionVersion.toHex(),
        runtimeVersion: api.runtimeVersion,
        version: api.extrinsicVersion,
        address: from,
        blockHash: lastHeader.hash.toHex(),
        blockNumber: blockNumber.toHex(),
        era: era.toHex(),
        genesisHash: api.genesisHash.toHex(),
        method: method.toHex(),
        nonce: nonce.toHex(),
        signedExtensions: api.registry.signedExtensions,
        tip: api.registry.createType('Compact<Balance>', 0).toHex(),
      };

      let payload;
      let txMetadata = null;

      // If the source is `ledger`, add the metadata hash to the payload.
      if (source === 'ledger') {
        const { newPayload, newTxMetadata } = await fetchMetadataHash(
          api,
          payloadJson
        );
        payload = newPayload;
        txMetadata = newTxMetadata;
      } else {
        // Create the payload raw.
        payload = api.registry.createType('ExtrinsicPayload', payloadJson, {
          version: payloadJson.version,
        });
      }

      // Persist both the payload and the payload bytes in state, indexed by its uid.
      setTxPayload(txMetadata, payload, payloadJson, uid);
    }
  };

  return {
    buildPayload,
  };
};
