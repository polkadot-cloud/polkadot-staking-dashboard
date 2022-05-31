// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { ReactComponent as TalismanSVG } from 'img/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from 'img/dot_icon.svg';

export const Extension = (props: any) => {
  const { meta, disabled, error, setSection, flag, disconnect } = props;
  const { extensionName, title } = meta;
  const { activeExtension, connectExtension, disconnectExtension }: any =
    useConnect();

  const handleWalletConnect = async () => {
    if (activeExtension !== extensionName) {
      await connectExtension(extensionName);
    }
    setSection(1);
  };

  return (
    <button
      type="button"
      className="item"
      key={`wallet_${extensionName}`}
      disabled={disabled}
      onClick={() => {
        if (disconnect) {
          disconnectExtension();
        } else {
          handleWalletConnect();
        }
      }}
    >
      <div>
        {extensionName === 'talisman' && (
          <TalismanSVG width="1.5rem" height="1.5rem" />
        )}
        {extensionName === 'polkadot-js' && (
          <PolkadotJSSVG width="1.5rem" height="1.5rem" />
        )}
        &nbsp; {error || title}
      </div>
      <div className={disconnect ? 'danger' : 'neutral'}>
        {flag && flag}
        <FontAwesomeIcon
          icon={faChevronRight}
          transform="shrink-5"
          className="icon"
        />
      </div>
    </button>
  );
};
