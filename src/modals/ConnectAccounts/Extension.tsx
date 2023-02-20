// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import SignClient from '@walletconnect/sign-client';
import { Web3Modal } from '@web3modal/standalone';

import { faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import { ExtensionInjected } from 'contexts/Extensions/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtensionProps } from './types';
import { ExtensionWrapper } from './Wrappers';

export const Extension = (props: ExtensionProps) => {
  const { t } = useTranslation('modals');
  const { extensions, extensionsStatus } = useExtensions();
  const { meta } = props;
  const { id } = meta;

  const installed = extensions.find((e: ExtensionInjected) => e.id === id);
  const status = !installed ? 'not_found' : extensionsStatus[id];

  // determine message to be displayed based on extension status.
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
    <ExtensionWrapper>
      {status === 'connected' || !installed ? (
        <ExtensionElement
          {...props}
          message={message}
          status={status}
          installed={installed}
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
  const { status, id } = meta;

  const { connectExtensionAccounts } = useConnect();

  // force re-render on click
  const [increment, setIncrement] = useState(0);

  // click to connect to extension
  const handleClick = async () => {
    console.log('id', id);
    if (status === 'connected') {
      setSection(1);
    } else if (id === 'wallet-connect') {
      console.log('this is wallet connect handler');
      const projectId = 'f75434b01141677e4ee7ddf70fee56b4';
      //  'polkadot:91b171bb158e2d3848fa23a9f1c25182'
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
    <div style={{ opacity: !props.installed ? 0.5 : 1 }}>
      <ExtensionInner {...props} />
    </div>
  );
};

export const ExtensionInner = ({
  size,
  message,
  flag,
  meta,
  status,
  installed,
}: any) => {
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
        <h4>
          <span
            className={`message ${status === 'connected' ? 'success' : ''}`}
          >
            {message}
          </span>
        </h4>
        {flag && flag}
        {installed || status === 'connected' ? (
          <FontAwesomeIcon
            icon={status === 'connected' ? faCheckCircle : faPlus}
            transform="shrink-0"
            className="icon"
          />
        ) : null}
      </div>
    </>
  );
};
