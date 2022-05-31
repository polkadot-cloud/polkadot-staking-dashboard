// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { HeadingWrapper, Item } from './Wrappers';

export const Connect = () => {
  const { activeAccount, initialise }: any = useConnect();

  return (
    <>
      {activeAccount === '' && (
        <HeadingWrapper>
          <Item
            className="connect"
            onClick={() => {
              initialise();
            }}
            whileHover={{ scale: 1.02 }}
          >
            <span>
              Connect <span className="xs-none">Wallet</span>
            </span>
          </Item>
        </HeadingWrapper>
      )}
    </>
  );
};
