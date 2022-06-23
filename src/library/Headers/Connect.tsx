// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface } from 'types/connect';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from 'contexts/Modal';
import { HeadingWrapper, Item } from './Wrappers';

export const Connect = () => {
  const { openModalWith } = useModal();
  const { activeAccount, accounts } = useConnect() as ConnectContextInterface;
  return (
    <>
      {!activeAccount && (
        <HeadingWrapper>
          <Item
            className="connect"
            onClick={() => {
              openModalWith(
                'ConnectAccounts',
                { section: accounts.length ? 1 : 0 },
                'large'
              );
            }}
            whileHover={{ scale: 1.02 }}
          >
            <FontAwesomeIcon icon={faWallet} className="icon" />
            <span>Connect</span>
          </Item>
        </HeadingWrapper>
      )}
    </>
  );
};
