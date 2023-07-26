// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SignClient } from '@walletconnect/sign-client';
import { Web3Modal } from '@web3modal/standalone';
import { ModalConnectItem } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import { useNotifications } from 'contexts/Notifications';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtensionInner } from './Wrappers';
import type { ExtensionProps } from './types';

export const Extension = ({ meta, size, flag }: ExtensionProps) => {
  const { t } = useTranslation('modals');
  const { extensions, extensionsStatus } = useExtensions();
  const { connectExtensionAccounts } = useConnect();
  const { addNotification } = useNotifications();
  const { title, icon: Icon, url } = meta;

  const { id } = meta;
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
    // TODO: migrate
    if (id === 'wallet-connect') {
      handleWalletConnect();
    } else if (status !== 'connected' && extension) {
      (async () => {
        const connected = await connectExtensionAccounts(extension);
        // force re-render to display error messages
        setIncrement(increment + 1);

        if (connected) {
          addNotification({
            title: t('extensionConnected'),
            subtitle: `${t('titleExtensionConnected', { title })}`,
          });
        }
      })();
    }
  };

  // click to connect to wallet connect
  const handleWalletConnect = async () => {
    if (id === 'wallet-connect') {
      console.log('this is wallet connect handler');
      const projectId = 'f75434b01141677e4ee7ddf70fee56b4';
      const web3Modal = new Web3Modal({
        walletConnectVersion: 1, // or 2
        projectId,
        standaloneChains: ['eip155:43114'],
      });
      const signClient = await SignClient.init({ projectId });

      const { uri, approval } = await signClient.connect({
        requiredNamespaces: {
          eip155: {
            methods: ['eth_sign'],
            chains: ['eip155:43114'],
            events: ['accountsChanged'],
          },
        },
      });
      if (uri) {
        web3Modal.openModal({ uri, standaloneChains: ['eip155:43114'] });
        await approval();
        web3Modal.closeModal();
      }
    }
  };

  return (
    <ModalConnectItem canConnect={!!(extension && status !== 'connected')}>
      <ExtensionInner>
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
            <a
              className="link"
              href={`https://${url}`}
              target="_blank"
              rel="noreferrer"
            >
              {url}
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-6" />
            </a>
          </div>
        </div>
      </ExtensionInner>
    </ModalConnectItem>
  );
};
