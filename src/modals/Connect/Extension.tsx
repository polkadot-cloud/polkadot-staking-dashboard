// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModalConnectItem } from '@polkadot-cloud/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useExtensions,
  useExtensionAccounts,
} from '@polkadot-cloud/react/hooks';
import { useNotifications } from 'contexts/Notifications';
import { getExtensionIcon } from '@polkadot-cloud/assets/extensions';
import { ExtensionInner } from './Wrappers';
import type { ExtensionProps } from './types';

export const Extension = ({ meta, size, flag }: ExtensionProps) => {
  const { t } = useTranslation('modals');
  const { addNotification } = useNotifications();
  const { connectExtensionAccounts } = useExtensionAccounts();
  const { extensionsStatus, extensionInstalled, extensionCanConnect } =
    useExtensions();
  const { title, website, id } = meta;
  const isInstalled = extensionInstalled(id);
  const canConnect = extensionCanConnect(id);

  // Force re-render on click.
  const [increment, setIncrement] = useState(0);

  // click to connect to extension
  const handleClick = async () => {
    if (canConnect) {
      const connected = await connectExtensionAccounts(id);
      // force re-render to display error messages
      setIncrement(increment + 1);

      if (connected)
        addNotification({
          title: t('extensionConnected'),
          subtitle: `${t('titleExtensionConnected', { title })}`,
        });
    }
  };

  const Icon = getExtensionIcon(id);

  // determine message to be displayed based on extension status.
  let statusJsx;
  switch (extensionsStatus[id]) {
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

  const shortUrl = Array.isArray(website) ? website[0] : website;
  const longUrl = Array.isArray(website) ? website[1] : website;
  const disabled = extensionsStatus[id] === 'connected' || !isInstalled;

  return (
    <ModalConnectItem canConnect={canConnect}>
      <ExtensionInner>
        <div>
          <div className="body">
            {!disabled ? (
              <button
                type="button"
                className="button"
                onClick={() => handleClick()}
              >
                &nbsp;
              </button>
            ) : null}

            <div className="row icon">
              {Icon && <Icon style={{ width: size, height: size }} />}
            </div>
            <div className="status">
              {flag && flag}
              {isInstalled ? statusJsx : <p>{t('notInstalled')}</p>}
            </div>
            <div className="row">
              <h3>{title}</h3>
            </div>
          </div>
          <div className="foot">
            <a
              className="link"
              href={`https://${longUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              {shortUrl}
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-6" />
            </a>
          </div>
        </div>
      </ExtensionInner>
    </ModalConnectItem>
  );
};
