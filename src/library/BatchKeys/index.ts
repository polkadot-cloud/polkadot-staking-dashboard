// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const batchkeys: Array<string> = [];

export class BatchKeys {
    static new(name: string): string {
        if (name in batchkeys) {
            console.error("The key exists");
        }
        batchkeys.push(name);
        return name;
    }
}