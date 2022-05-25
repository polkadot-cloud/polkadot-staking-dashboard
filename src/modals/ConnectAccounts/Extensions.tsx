// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useConnect } from '../../contexts/Connect';
import { Separator } from './Wrapper';
import { useModal } from '../../contexts/Modal';
import { Extension } from './Extension';

export const Extensions = (props: any) => {
  const { setSection } = props;

  const modal = useModal();
  const { extensions, activeExtension, activeAccount, extensionErrors }: any =
    useConnect();

  let { accounts } = useConnect();

  // remove active account from connect list
  accounts = accounts.filter((item: any) => item.address !== activeAccount);

  // trigger modal resize on extensions change
  useEffect(() => {
    modal.setResize();
  }, [extensions]);

  // find active extension from extensions
  const activeExtensionMeta =
    extensions.find(
      (extension: any) => extension.extensionName === activeExtension
    ) ?? null;

  // remove active extension from list
  const extensionsList = extensions.filter(
    (extension: any) => extension.extensionName !== activeExtension
  );

  return (
    <>
      <h2>Select Wallet</h2>

      {activeExtensionMeta !== null && (
        <Extension
          flag="Accounts"
          meta={activeExtensionMeta}
          disabled={false}
          error={false}
          setSection={setSection}
          disconnect
        />
      )}
      <Separator />

      {activeExtensionMeta !== null && (
        <Extension
          flag="Accounts"
          meta={activeExtensionMeta}
          disabled={false}
          error={false}
          setSection={setSection}
        />
      )}

      {extensionsList.map((extension: any) => {
        const error = extensionErrors[extension.name] ?? null;
        const disabled =
          activeExtension !== extension.name && activeExtension !== null;
        return (
          <Extension
            meta={extension}
            disabled={disabled}
            error={error}
            setSection={setSection}
          />
        );
      })}
    </>
  );
};
