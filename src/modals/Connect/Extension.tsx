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
import { ExtensionIcons } from '@polkadot-cloud/assets/extensions';
import { ExtensionInner } from './Wrappers';
import type { ExtensionProps } from './types';

export const Extension = ({ meta, size, flag }: ExtensionProps) => {
  const { t } = useTranslation('modals');
  const { addNotification } = useNotifications();
  const { connectExtensionAccounts } = useExtensionAccounts();
  const { extensions, extensionsStatus } = useExtensions();
  const { title, website, id } = meta;

  const Icon = ExtensionIcons[id || ''] || undefined;

  const extension = extensions.find((e) => e.id === id);
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
      const connected = await connectExtensionAccounts(extension);
      // force re-render to display error messages
      setIncrement(increment + 1);

      if (connected) {
        addNotification({
          title: t('extensionConnected'),
          subtitle: `${t('titleExtensionConnected', { title })}`,
        });
      }
    }
  };

  return (
    <ModalConnectItem canConnect={!!(extension && status !== 'connected')}>
      <ExtensionInner>
        <div>
          <div className="body">
            {!disabled ? (
              <button
                type="button"
                className="button"
                disabled={disabled}
                onClick={() => handleClick()}
              >
                &nbsp;
              </button>
            ) : null}

            <div className="row icon">
              <Icon style={{ width: size, height: size }} />
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
            <a
              className="link"
              href={`https://${website}`}
              target="_blank"
              rel="noreferrer"
            >
              {website}
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-6" />
            </a>
          </div>
        </div>
      </ExtensionInner>
    </ModalConnectItem>
  );
};
