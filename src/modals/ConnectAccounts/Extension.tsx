// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as TalismanSVG } from 'img/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from 'img/dot_icon.svg';
import { useConnect } from 'contexts/Connect';
import { ExtensionWrapper } from './Wrappers';

export const Extension = (props: any) => {
  const { meta } = props;
  const { extensionName } = meta;

  const { extensionsStatus } = useConnect();
  const status = extensionsStatus[extensionName];

  // determine message to be displayed based on extension status.
  let message;
  switch (status) {
    case 'connected':
      message = `Connected`;
      break;
    case 'not_authenticated':
      message = 'Not Authenticated. Authenticate and Try Again';
      break;

    case 'not_found':
      message = 'Not Found. Install and Refresh';
      break;
    default:
      message = status === 'no_accounts' ? 'No Accounts' : 'Not Connected';
  }

  return (
    <ExtensionWrapper>
      {status === 'connected' ? (
        <ExtensionElement
          {...props}
          message={message}
          status={status}
          size="1.5rem"
        />
      ) : (
        <ExtensionButton
          {...props}
          message={message}
          status={status}
          size="1.5rem"
        />
      )}
    </ExtensionWrapper>
  );
};

export const ExtensionButton = (props: any) => {
  const { meta, setSection } = props;
  const { extensionName, status } = meta;

  const { connectExtensionAccounts } = useConnect();

  // force re-render on click
  const [increment, setIncrement] = useState(0);

  // click to connect to extension
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

  return (
    <button
      type="button"
      disabled={status === 'connected'}
      onClick={() => {
        if (status !== 'connected') {
          handleClick();
        }
      }}
    >
      <ExtensionInner {...props} />
    </button>
  );
};

export const ExtensionElement = (props: any) => {
  return (
    <div>
      <ExtensionInner {...props} />
    </div>
  );
};

export const ExtensionInner = (props: any) => {
  const { size, message, flag, meta, status } = props;
  const { extensionName, title } = meta;
  return (
    <>
      <div>
        {extensionName === 'talisman' && (
          <>
            <TalismanSVG width={size} height={size} />
          </>
        )}
        {extensionName === 'polkadot-js' && (
          <PolkadotJSSVG width={size} height={size} />
        )}
        <h3>
          <span className="name">&nbsp; {title}</span>
        </h3>
      </div>

      <div className={status === 'connected' ? 'success' : 'neutral'}>
        <h3>
          <span
            className={`message ${status === 'connected' ? 'success' : ''}`}
          >
            {message}
          </span>
        </h3>
        {flag && flag}
        <FontAwesomeIcon
          icon={status === 'connected' ? faCheckCircle : faPlus}
          transform="shrink-0"
          className="icon"
        />
      </div>
    </>
  );
};
