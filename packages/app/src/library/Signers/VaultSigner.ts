// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createV4Tx, getSignBytes } from '@polkadot-api/signers-common';
import type { V15 } from '@polkadot-api/substrate-bindings';
import { decAnyMetadata } from '@polkadot-api/substrate-bindings';
import type { PolkadotSigner } from 'polkadot-api';
import { mergeUint8 } from 'polkadot-api/utils';
import type { AnyApi } from 'types';

export class VaultSigner {
  #publicKey: Uint8Array;
  #promptHandlers: {
    openPrompt: (
      onComplete: (result: Uint8Array) => void,
      toSign: Uint8Array
    ) => void;
    closePrompt: () => void;
  };

  constructor(
    pubKey: Uint8Array,
    promptHandlers: { openPrompt: AnyApi; closePrompt: AnyApi }
  ) {
    this.#publicKey = pubKey;
    this.#promptHandlers = promptHandlers;
  }

  #showPrompt = (toSign: Uint8Array) =>
    new Promise((resolve) => {
      const handleComplete = (result: Uint8Array) => {
        this.#promptHandlers.closePrompt();
        resolve(result);
      };
      // Show prompt, passing completion handler to call once user has completed signing. This will
      // resolve the promise and continue with signing.
      this.#promptHandlers.openPrompt(
        (result: Uint8Array) => handleComplete(result),
        toSign
      );
    });

  async getPolkadotSigner(networkInfo: {
    decimals: number;
    tokenSymbol: string;
  }): Promise<PolkadotSigner> {
    const signTx: PolkadotSigner['signTx'] = async (
      callData,
      signedExtensions,
      metadata
    ) => {
      console.debug(networkInfo);
      // const merkleizer = merkleizeMetadata(metadata, networkInfo);
      // const digest = merkleizer.digest();
      const v15 = decAnyMetadata(metadata).metadata.value as unknown as V15;

      const extra: Uint8Array[] = [];
      const additionalSigned: Uint8Array[] = [];
      v15.extrinsic.signedExtensions.map(({ identifier }) => {
        const signedExtension = signedExtensions[identifier];
        if (!signedExtension) {
          throw new Error(`Missing ${identifier} signed extension`);
        }
        extra.push(signedExtension.value);
        additionalSigned.push(signedExtension.additionalSigned);
      });

      const prefix = new Uint8Array([8]);
      const toSign = mergeUint8(
        prefix,
        callData,
        ...extra,
        ...additionalSigned
      );

      // Start flow to sign QR Code here.
      const userResponse = await this.#showPrompt(toSign);

      console.log('user response: ', userResponse);
      // NOTE: Placeholder.
      const signature = Buffer.from(new Uint8Array(0));
      return createV4Tx(v15, this.#publicKey, signature, extra, callData);
    };

    return {
      publicKey: this.#publicKey,
      signTx,
      signBytes: getSignBytes(async (x) => {
        const signature = Buffer.from(x);
        // TODO: Replace with vault signature.
        // const { signature } = await Ledger.signPayload(app, index, x);
        // NOTE: the signature includes a "0x00" at the beginning, indicating a ed25519 signature.
        // this is not needed for non-extrinsic signatures.
        return signature.subarray(1);
      }),
    };
  }
}
