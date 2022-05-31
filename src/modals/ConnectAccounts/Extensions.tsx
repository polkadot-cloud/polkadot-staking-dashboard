// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, forwardRef } from 'react';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { Separator, ContentWrapper, PaddingWrapper } from './Wrappers';
import { Extension } from './Extension';

export const Extensions = forwardRef((props: any, ref: any) => {
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
    <ContentWrapper>
      <PaddingWrapper ref={ref}>
        <h2>Select Wallet</h2>

        {activeExtensionMeta !== null && (
          <Extension
            flag="Disconnect"
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

        {extensionsList.map((extension: any, i: number) => {
          const error = extensionErrors[extension.name] ?? null;
          const disabled =
            activeExtension !== extension.name && activeExtension !== null;
          return (
            <Extension
              key={`active_extension_${i}`}
              meta={extension}
              disabled={disabled}
              error={error}
              setSection={setSection}
            />
          );
        })}
      </PaddingWrapper>
    </ContentWrapper>
  );
});
