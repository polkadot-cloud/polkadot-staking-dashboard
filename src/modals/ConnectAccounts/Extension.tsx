// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import UniversalProvider from '@walletconnect/universal-provider';

// import { Core } from '@walletconnect/core';
// import { Web3Wallet } from '@walletconnect/web3wallet';

// import SignClient from '@walletconnect/sign-client';
// import { Web3Modal } from '@web3modal/standalone';

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
  const { status, id: extensionId } = meta;

  const { connectExtensionAccounts } = useConnect();

  // force re-render on click
  const [increment, setIncrement] = useState(0);

  // click to connect to extension
  const handleClick = async () => {
    console.log('id', extensionId);
    if (status === 'connected') {
      setSection(1);
    } else if (extensionId === 'wallet-connect') {
      console.log('this is wallet connect handler');
      const projectId = 'f75434b01141677e4ee7ddf70fee56b4';

      const provider = await UniversalProvider.init({
        projectId,
        metadata: {
          name: 'Polkadot Staking Dashboard',
          description: 'dApp for Staking Nomination Pool Staking',
          url: 'https://https://staking.polkadot.network/',
          icons: ['../../../public/favicons/polkadot/favicon-16x16.png'],
        },
      });

      console.log('what is the provider---', provider);

      // Subscribe for pairing URI
      provider.on('display_uri', async (uri: string) => {
        console.log('display_uri', uri);
      });

      // Subscribe to session ping
      provider.on(
        'session_ping',
        ({ id, topic }: { id: string; topic: string }) => {
          console.log(id, topic);
        }
      );

      // Subscribe to session event
      provider.on(
        'session_event',
        ({ event, chainId }: { event: any; chainId: any }) => {
          console.log(event, chainId);
        }
      );

      // Subscribe to session update
      provider.on(
        'session_update',
        ({ topic, params }: { topic: any; params: any }) => {
          console.log(topic, params);
        }
      );

      // Subscribe to session delete
      provider.on(
        'session_delete',
        ({ id, topic }: { id: string; topic: string }) => {
          console.log(id, topic);
        }
      );

      await provider.connect({
        namespaces: {
          polkadot: {
            methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
            chains: ['polkadot:91b171bb158e2d3848fa23a9f1c25182'],
            events: ['chainChanged", "accountsChanged'],
            rpcMap: {
              '91b171bb158e2d3848fa23a9f1c25182': 'wss://rpc.polkadot.io', // your rpc url,
            },
          },
        },
      });
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
