// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as TalismanSVG } from 'img/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from 'img/dot_icon.svg';
import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface } from 'types/connect';

export const Extension = (props: any) => {
  const { meta, disabled, setSection, flag } = props;
  const { extensionName, title } = meta;

  const { setActiveExtension } = useConnect() as ConnectContextInterface;

  const handleClick = async () => {
    setActiveExtension(extensionName);
    setSection(1);
  };

  return (
    <button
      type="button"
      className="item"
      key={`wallet_${extensionName}`}
      disabled={disabled}
      onClick={() => {
        handleClick();
      }}
    >
      <div>
        {extensionName === 'talisman' && (
          <TalismanSVG width="1.5rem" height="1.5rem" />
        )}
        {extensionName === 'polkadot-js' && (
          <PolkadotJSSVG width="1.5rem" height="1.5rem" />
        )}
        &nbsp; {title}
      </div>
      <div className="neutral">
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
