// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { Extension as ExtensionInterface } from 'contexts/Connect/types';
import { useTranslation } from 'react-i18next';
import { ExtensionWrapper } from './Wrappers';
import { ExtensionProps } from './types';

export const Extension = (props: ExtensionProps) => {
  const { extensions } = useConnect();
  const { extensionsStatus } = useConnect();
  const { meta } = props;
  const { id } = meta;
  const { t } = useTranslation('common');

  const installed = extensions.find((e: ExtensionInterface) => e.id === id);
  const status = !installed ? 'not_found' : extensionsStatus[id];

  // determine message to be displayed based on extension status.
  let message;
  switch (status) {
    case 'connected':
      message = t('modals.connected');
      break;
    case 'not_authenticated':
      message = t('modals.not_authenticated');
      break;
    default:
      message =
        status === 'no_accounts'
          ? t('modals.no_accounts')
          : t('modals.not_connected');
  }

  return (
    <ExtensionWrapper>
      {status === 'connected' || !installed ? (
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
          installed={installed}
        />
      )}
    </ExtensionWrapper>
  );
};

export const ExtensionButton = (props: any) => {
  const { meta, setSection, installed } = props;
  const { status } = meta;

  const { connectExtensionAccounts } = useConnect();

  // force re-render on click
  const [increment, setIncrement] = useState(0);

  // click to connect to extension
  const handleClick = async () => {
    if (status === 'connected') {
      setSection(1);
    } else {
      (() => {
        connectExtensionAccounts(installed);
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
  const { title, icon: Icon } = meta;

  return (
    <>
      <div>
        <Icon width={size} height={size} />
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
