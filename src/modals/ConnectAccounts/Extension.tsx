// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as TalismanSVG } from 'img/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from 'img/dot_icon.svg';
import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface } from 'types/connect';
import { ExtensionWrapper } from './Wrappers';

export const Extension = (props: any) => {
  const { meta, setSection, flag } = props;
  const { extensionName, title } = meta;

  const { setActiveExtension } = useConnect() as ConnectContextInterface;

  const handleClick = async () => {
    setActiveExtension(extensionName);
    setSection(1);
  };

  const size = '2rem';

  return (
    <ExtensionWrapper
      key={`wallet_${extensionName}`}
      onClick={() => {
        handleClick();
      }}
    >
      <div>
        {extensionName === 'talisman' && (
          <TalismanSVG width={size} height={size} />
        )}
        {extensionName === 'polkadot-js' && (
          <PolkadotJSSVG width={size} height={size} />
        )}
        <span className="name">&nbsp; {title}</span>
      </div>
      <div className="neutral">
        {flag && flag}
        <FontAwesomeIcon
          icon={faChevronRight}
          transform="shrink-0"
          className="icon"
        />
      </div>
    </ExtensionWrapper>
  );
};
