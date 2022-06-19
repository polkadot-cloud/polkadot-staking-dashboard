// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
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

  // force re-render on click
  const [increment, setIncrement] = useState(0);

  const handleClick = async () => {
    if (status === 'connected') {
      setSection(1);
    } else {
      (async () => {
        await connectExtensionAccounts(extensionName);

        // force re-render to display error messages
        setIncrement(increment + 1);
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
      message = `${accountsConnected.length} Account${
        accountsConnected.length !== 1 ? `s` : ``
      } Imported`;
      break;
    case 'not_authenticated':
      message = 'Not Authenticated. Authenticate and Try Again';
      break;

    case 'not_found':
      message = 'Not Found. Install and Refresh';
      break;
    default:
      message =
        status === 'no_accounts' ? 'No Accounts Imported' : 'Not Connected';
  }

  const size = '2rem';

  return (
    <ExtensionWrapper
      key={`wallet_${extensionName}`}
      disabled={status === 'connected'}
      onClick={() => {
        if (status !== 'connected') {
          handleClick();
        }
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
          icon={status === 'connected' ? faCheckCircle : faPlus}
          transform="shrink-0"
          className="icon"
        />
      </div>
    </ExtensionWrapper>
  );
};
