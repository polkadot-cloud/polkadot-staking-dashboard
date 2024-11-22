// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createV4Tx, getSignBytes } from '@polkadot-api/signers-common';
import type { V15 } from '@polkadot-api/substrate-bindings';
import {
  Binary,
  compact,
  decAnyMetadata,
  u32,
} from '@polkadot-api/substrate-bindings';
import type { WalletConnectSignTx } from 'contexts/WalletConnect/types';
import type { PapiChainSpec } from 'model/Api/types';
import type { PolkadotSigner } from 'polkadot-api';
import { toHex } from 'polkadot-api/utils';

export class WallectConnectSigner {
  #publicKey: Uint8Array;
  #who: string;
  #caip: string;
  #signFn: WalletConnectSignTx;
  #chainSpecs: PapiChainSpec;
  #nonce: number;
  #blockNumber: number;
  #blockHash: string;

  constructor(
    pubKey: Uint8Array,
    caip: string,
    signFn: WalletConnectSignTx,
    chainSpecs: PapiChainSpec,
    nonce: number,
    who: string,
    blockNumber: number,
    blockHash: string
  ) {
    this.#publicKey = pubKey;
    this.#caip = caip;
    this.#signFn = signFn;
    this.#chainSpecs = chainSpecs;
    this.#who = who;
    this.#nonce = nonce;
    this.#blockNumber = blockNumber;
    this.#blockHash = blockHash;
  }

  #toPjsHex(value: number | bigint, minByteLen?: number) {
    let inner = value.toString(16);
    inner = (inner.length % 2 ? '0' : '') + inner;
    const nPaddedBytes = Math.max(0, (minByteLen || 0) - inner.length / 2);
    return '0x' + '00'.repeat(nPaddedBytes) + inner;
  }

  async getPolkadotSigner(): Promise<PolkadotSigner> {
    const signTx: PolkadotSigner['signTx'] = async (
      callData,
      signedExtensions,
      metadata
    ) => {
      const v15 = decAnyMetadata(metadata).metadata.value as unknown as V15;
      const identifiers: string[] = [];
      const extra: Uint8Array[] = [];
      const additionalSigned: Uint8Array[] = [];
      v15.extrinsic.signedExtensions.map(({ identifier }) => {
        const signedExtension = signedExtensions[identifier];
        if (!signedExtension) {
          throw new Error(`Missing ${identifier} signed extension`);
        }
        identifiers.push(identifier);
        extra.push(signedExtension.value);
        additionalSigned.push(signedExtension.additionalSigned);
      });

      const { version } = v15.extrinsic;
      const lastBlock = this.#blockNumber - 1;
      // const phase = lastBlock % 64;
      // const period = 6;
      // const era = toHex(new Uint8Array([phase, period]));

      const unsignedTransaction = {
        specVersion: this.#toPjsHex(
          u32.dec(u32.enc(this.#chainSpecs.specVersion)),
          4
        ),
        transactionVersion: this.#toPjsHex(
          u32.dec(u32.enc(this.#chainSpecs.transactionVersion))
        ),
        version,
        address: this.#who,
        blockHash: this.#blockHash,
        blockNumber: this.#toPjsHex(u32.dec(u32.enc(lastBlock)), 4),
        era: '0x00',
        genesisHash: this.#chainSpecs.genesisHash,
        method: toHex(callData),
        nonce: this.#toPjsHex(compact.dec(compact.enc(this.#nonce)), 4),
        signedExtensions: identifiers,
        tip: this.#toPjsHex(u32.dec(u32.enc(0)), 16),
      };

      // Await signature from Wallet Connect.
      const signature = await this.#signFn(
        this.#caip,
        unsignedTransaction,
        this.#who
      );

      console.log(signature);

      if (signature === null) {
        throw 'Invalid signature';
      }
      return createV4Tx(
        v15,
        this.#publicKey,
        Binary.fromHex(signature).asBytes(),
        extra,
        callData
      );
    };

    return {
      publicKey: this.#publicKey,
      signTx,
      signBytes: getSignBytes(async (x) => {
        const signatureHex = await this.#signFn(this.#caip, x, this.#who);
        if (!signatureHex) {
          throw 'Invalid signature';
        }
        // NOTE: the signature includes a "0x00" at the beginning, indicating a ed25519 signature.
        // this is not needed for non-extrinsic signatures.
        return Binary.fromHex(signatureHex).asBytes().subarray(1);
      }),
    };
  }
}
