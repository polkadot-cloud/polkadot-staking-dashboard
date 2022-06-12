// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as TalismanSVG } from 'img/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from 'img/dot_icon.svg';
import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface } from 'types/connect';
import { ExtensionWrapper } from './Wrappers';

export const Extension = (props: any) => {
  const { meta, setSection, flag } = props;
  const { extensionName, title } = meta;

  const { extensionsStatus, connectExtensionAccounts, accounts } =
    useConnect() as ConnectContextInterface;
  const status = extensionsStatus[extensionName];

  const handleClick = async () => {
    if (status === 'connected') {
      setSection(1);
    } else {
      (async () => {
        await connectExtensionAccounts(extensionName);
      })();
    }
  };

  const accountsConnected = accounts.filter(
    (a: any) => a.source === extensionName
  );

  // determine message to be displayed based on extension status.
  let message;
  switch (status) {
    case 'connected':
      message = `${accountsConnected.length} account${
        accountsConnected.length !== 1 && `s`
      } imported`;
      break;
    case 'not_installed':
      message = 'Not Installed';
      break;
    default:
      message = 'Not Connected';
  }

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
        <span className="message">{message}</span>
      </div>
      <div className="neutral">
        {flag && flag}
        <FontAwesomeIcon
          icon={status === 'connected' ? faAngleDoubleRight : faPlus}
          transform="shrink-0"
          className="icon"
        />
      </div>
    </ExtensionWrapper>
  );
};
