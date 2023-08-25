// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import { ExtensionsArray } from '@polkadot-cloud/community/extensions';
import React, { useEffect, useRef, useState } from 'react';
import type {
  ExtensionInjected,
  ExtensionsContextInterface,
  ExtensionsStatus,
} from 'contexts/Extensions/types';
import type { AnyApi } from 'types';
import { defaultExtensionsContext } from './defaults';

export const ExtensionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // store whether injected interval has been initialised.
  const intervalInitialisedRef = useRef<boolean>(false);

  // store whether initial injectedWeb3 checking is underway.
  const [checkingInjectedWeb3, setCheckingInjectedWeb3] =
    useState<boolean>(true);
  const checkingInjectedWeb3Ref = useRef(checkingInjectedWeb3);

  // store the installed extensions in state.
  const [extensions, setExtensionsState] = useState<ExtensionInjected[] | null>(
    null
  );
  const extensionsRef = useRef(extensions);

  const setExtensions = (e: ExtensionInjected[] | null) => {
    setStateWithRef(e, setExtensionsState, extensionsRef);
  };

  // store whether extensions have been fetched
  const [extensionsFetched, setExtensionsFetched] = useState(false);

  // store each extension's status in state.
  const [extensionsStatus, setExtensionsStatus] = useState<ExtensionsStatus>(
    {}
  );
  const extensionsStatusRef = useRef(extensionsStatus);

  // listen for window.injectedWeb3.
  let injectedWeb3Interval: ReturnType<typeof setInterval>;
  let injectCounter = 0;

  // Handle completed interval check for `injectedWeb3`. If `injectedWeb3` is present, get installed
  // extensions and add to state.
  const handleClearInterval = (hasInjectedWeb3: boolean) => {
    clearInterval(injectedWeb3Interval);
    if (hasInjectedWeb3) {
      setExtensions(getInstalledExtensions());
    }
    setStateWithRef(false, setCheckingInjectedWeb3, checkingInjectedWeb3Ref);
  };

  // Sets an interval to listen to `window` until the `injectedWeb3` property is present. Cancels
  // after 500 * 10 milliseconds.
  useEffect(() => {
    if (!intervalInitialisedRef.current) {
      intervalInitialisedRef.current = true;

      injectedWeb3Interval = setInterval(() => {
        if (++injectCounter === 10) {
          handleClearInterval(false);
        } else {
          // if injected is present
          const injectedWeb3 = (window as AnyApi)?.injectedWeb3 || null;
          if (injectedWeb3 !== null) {
            handleClearInterval(true);
          }
        }
      }, 500);
    }
    return () => clearInterval(injectedWeb3Interval);
  });

  const setExtensionStatus = (id: string, status: string) => {
    setStateWithRef(
      Object.assign(extensionsStatusRef.current || {}, {
        [id]: status,
      }),
      setExtensionsStatus,
      extensionsStatusRef
    );
  };

  const getInstalledExtensions = () => {
    const { injectedWeb3 }: AnyApi = window;
    const installed: ExtensionInjected[] = [];
    ExtensionsArray.forEach((e) => {
      if (injectedWeb3[e.id] !== undefined) {
        installed.push({
          ...e,
          ...injectedWeb3[e.id],
        });
      }
    });
    return installed;
  };

  return (
    <ExtensionsContext.Provider
      value={{
        extensions: extensionsRef.current ?? [],
        setExtensionStatus,
        extensionsStatus: extensionsStatusRef.current,
        checkingInjectedWeb3: checkingInjectedWeb3Ref.current,
        extensionsFetched,
        setExtensionsFetched,
        setExtensions,
      }}
    >
      {children}
    </ExtensionsContext.Provider>
  );
};

export const ExtensionsContext =
  React.createContext<ExtensionsContextInterface>(defaultExtensionsContext);

export const useExtensions = () => React.useContext(ExtensionsContext);
