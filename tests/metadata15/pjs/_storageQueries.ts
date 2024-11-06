// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise, WsProvider } from '@polkadot/api';

// Storage query examples covering the various metadata data types.

const runTests = async () => {
  // Instantiate api and connect to Polkadot.
  const provider = new WsProvider('wss://rpc.ibp.network/polkadot');
  const api = new ApiPromise({ provider });
  await api.isReady;

  // Numbers and text
  //
  // Can simply be passed as numbers or string types. Numbers must not contain decimals, commas, or
  // other formatting.
  let result = await api.query.system.blockHash(20523285);
  const result2 = await api.query.system.blockHash('20523285');
  console.debug(result.toHuman(), '\n', result2.toHuman());

  // `AccountId32`
  //
  // Pass the account as a string.
  result = await api.query.system.account(
    '1554u1a67ApEt5xmjbZwjgDNaVckbzB6cjRHWAQ1SpNkNxTd'
  );
  console.debug(result.toHuman());

  // EthereumAddress
  //
  // Pass as string.
  result = await api.query.claims.claims(
    '0x00002F21194993a750972574e2d82CE8C95078a6'
  );
  console.debug(result.toHuman());

  // Hash (H256, H160, H512)
  //
  // Hex encoded hash can be passed as a string.
  result = await api.query.offences.reports(
    '0xe8474499e90396b81636faa7353ffcaf4ea1edcd8f97ae72ef7d9b5ca9c98c04'
  );
  console.debug(result.toHuman());

  // Composite / Tuples / not-byte Arrays / non-byte sequences.
  //
  // Composite / tuple / non-byte array / non-byte-sequence types are just a collection of other
  // types. They can be passed as as an array of values.
  result = await api.query.session.keyOwner([
    'babe',
    '0xd8677a828653d895cb5770cc1e96a829710db4e6683971f17194e0388cf8c611',
  ]);

  console.debug(result.toHuman());

  // Complex Objects
  //
  // Simple enum values can be passed as strings.
  //
  // Typed enum values can be passed as an object.
  //
  // Struct values can be passed as an object.

  result = await api.query.xcmPallet.supportedVersion(
    4,
    // Typed Enum
    {
      V4:
        // Struct
        {
          // [field]: Number
          parents: 0,
          // [field]: Struct
          interior: {
            // Typed Enum
            X1:
              // Array
              [
                // Struct
                {
                  // [field]: Number
                  Parachain: 2101,
                },
              ],
          },
        },
    }
  );
  console.debug(result.toHuman());

  // TODO: Bitsequence

  api.disconnect();
  process.exit();
};

runTests();
