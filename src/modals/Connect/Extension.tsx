// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import { ExtensionInjected } from 'contexts/Extensions/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtensionProps } from './types';
import { ExtensionItem } from './Wrappers';

export const Extension = (props: ExtensionProps) => {
  const { t } = useTranslation('modals');
  const { extensions, extensionsStatus } = useExtensions();
  const { meta } = props;
  const { id } = meta;

  const installed = extensions.find((e: ExtensionInjected) => e.id === id);
  const status = !installed ? 'not_found' : extensionsStatus[id];

  // determine message to be displayed based on extension status.
  // TODO: re-integrate if needed into extension item.
  let message;
  switch (status) {
    case 'connected':
      message = `${t('connected')}`;
      break;
    case 'not_authenticated':
      message = t('notAuthenticated');
      break;
    default:
      message = status === 'no_accounts' ? t('noAccounts') : '';
  }

  return (
    <ExtensionItem>
      <div className="inner">
        <ExtensionButton
          {...props}
          status={status}
          size="1.5rem"
          installed={installed}
          message={message}
          disabled={status === 'connected' || !installed}
        />
      </div>
    </ExtensionItem>
  );
};

export const ExtensionButton = ({
  meta,
  installed,
  disabled,
  size,
  status,
  flag,
  // eslint-disable-next-line
  message,
}: any) => {
  const { connectExtensionAccounts } = useConnect();
  const { title, icon: Icon, url } = meta;

  // force re-render on click
  const [increment, setIncrement] = useState(0);

  // click to connect to extension
  const handleClick = async () => {
    if (status !== 'connected') {
      (() => {
        connectExtensionAccounts(installed);
        // force re-render to display error messages
        setIncrement(increment + 1);
      })();
    }
  };

  return (
    <div>
      <div className="body">
        {!(disabled || status === 'connected') ? (
          <button
            type="button"
            className="button"
            disabled={disabled}
            onClick={() => {
              if (status !== 'connected') {
                handleClick();
              }
            }}
          >
            &nbsp;
          </button>
        ) : null}

        <div className="row">
          <Icon width={size} height={size} className="icon" />
        </div>
        <div className="status">
          {flag && flag}
          {installed ? (
            status === 'connected' ? (
              <p className="success">Connected</p>
            ) : (
              <p>
                <FontAwesomeIcon icon={faPlus} className="plus" />
                Connect
              </p>
            )
          ) : (
            <p>Not Installed</p>
          )}
        </div>
        <div className="row">
          <h3>{title}</h3>
        </div>
      </div>
      <div className="foot">
        <a href={`https://${url}`} target="_blank" rel="noreferrer">
          {url}
          <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-6" />
        </a>
      </div>
    </div>
  );
};
