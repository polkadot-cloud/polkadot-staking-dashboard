// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import { ExtensionInjected } from 'contexts/Extensions/types';
import { useNotifications } from 'contexts/Notifications';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtensionProps } from './types';
import { ConnectItem } from './Wrappers';

export const Extension = ({ meta, size, flag }: ExtensionProps) => {
  const { t } = useTranslation('modals');
  const { extensions, extensionsStatus } = useExtensions();
  const { connectExtensionAccounts } = useConnect();
  const { addNotification } = useNotifications();
  const { title, icon: Icon, url } = meta;

  const { id } = meta;
  const extension = extensions.find((e: ExtensionInjected) => e.id === id);
  const status = !extension ? 'not_found' : extensionsStatus[id];
  const disabled = status === 'connected' || !extension;

  // determine message to be displayed based on extension status.
  let statusJsx;
  switch (status) {
    case 'connected':
      statusJsx = <p className="success">{t('connected')}</p>;
      break;
    case 'not_authenticated':
      statusJsx = <p>{t('notAuthenticated')}</p>;
      break;
    default:
      statusJsx = (
        <p className="active">
          <FontAwesomeIcon icon={faPlus} className="plus" />
          {t('connect')}
        </p>
      );
  }

  // force re-render on click
  const [increment, setIncrement] = useState(0);

  // click to connect to extension
  const handleClick = async () => {
    if (status !== 'connected' && extension) {
      (async () => {
        await connectExtensionAccounts(extension);
        // force re-render to display error messages
        setIncrement(increment + 1);

        addNotification({
          title: t('extensionConnected'),
          subtitle: `${t('titleExtensionConnected', title)}`,
        });
      })();
    }
  };

  return (
    <ConnectItem
      className={status !== 'connected' && extension ? 'canConnect' : undefined}
    >
      <div className="inner">
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
              {extension ? statusJsx : <p>{t('notInstalled')}</p>}
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
      </div>
    </ConnectItem>
  );
};
