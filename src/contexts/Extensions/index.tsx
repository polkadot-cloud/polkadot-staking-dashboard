// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EXTENSIONS } from 'config/extensions';
import {
  Extension,
  ExtensionConfig,
  ExtensionsContextInterface,
} from 'contexts/Extensions/types';
import React, { useEffect, useRef, useState } from 'react';
import { AnyApi } from 'types';
import { setStateWithRef } from 'Utils';
import { defaultExtensionsContext } from './defaults';

export const ExtensionsContext =
  React.createContext<ExtensionsContextInterface>(defaultExtensionsContext);

export const useExtensions = () => React.useContext(ExtensionsContext);

export const ExtensionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // store whether injectedWeb3 is present
  const [injectedPresent, setInjectedPresent] = useState<boolean>(false);

  // store the installed extensions in state
  const [extensions, setExtensions] = useState<Array<Extension> | null>(null);

  // store whether extensions have been fetched
  const [extensionsFetched, setExtensionsFetched] = useState(false);

  // store each extension's status in state.
  const [extensionsStatus, setExtensionsStatus] = useState<{
    [key: string]: string;
  }>({});
  const extensionsStatusRef = useRef(extensionsStatus);

  // listen for window.injectedWeb3.
  let injectedWeb3Interval: ReturnType<typeof setInterval>;
  let injectCounter = 0;

  // sets an interval to listen to `window` until the
  // `injectedWeb3` property is present.
  useEffect(() => {
    injectedWeb3Interval = setInterval(() => {
      if (++injectCounter === 10) {
        clearInterval(injectedWeb3Interval);
      } else {
        // if injected is present
        const injectedWeb3 = (window as AnyApi)?.injectedWeb3 || null;
        if (injectedWeb3 !== null) {
          clearInterval(injectedWeb3Interval);
          setInjectedPresent(true);
        }
      }
    }, 500);
    return () => {
      clearInterval(injectedWeb3Interval);
    };
  });

  // initialise extensions.
  useEffect(() => {
    if (!extensions && injectedPresent) {
      clearInterval(injectedWeb3Interval);
      // get installed extensions from `injectedWeb3`
      setExtensions(getInstalledExtensions());
    }
  });

  const setExtensionStatus = (id: string, status: string) => {
    setStateWithRef(
      Object.assign(extensionsStatusRef.current, {
        [id]: status,
      }),
      setExtensionsStatus,
      extensionsStatusRef
    );
  };

  const getInstalledExtensions = () => {
    const { injectedWeb3 }: AnyApi = window;
    const _exts: Extension[] = [];
    EXTENSIONS.forEach((e: ExtensionConfig) => {
      if (injectedWeb3[e.id] !== undefined) {
        _exts.push({
          ...e,
          ...injectedWeb3[e.id],
        });
      }
    });
    return _exts;
  };

  return (
    <ExtensionsContext.Provider
      value={{
        extensions: extensions ?? [],
        setExtensionStatus,
        extensionsStatus: extensionsStatusRef.current,
        extensionsFetched,
        setExtensionsFetched,
        setExtensions,
      }}
    >
      {children}
    </ExtensionsContext.Provider>
  );
};
