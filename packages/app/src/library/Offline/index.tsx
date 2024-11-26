// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OnlineStatusController } from 'controllers/OnlineStatus';
import { isCustomEvent } from 'controllers/utils';
import { useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import { Wrapper } from './Wrapper';

export const Offline = () => {
  // Whether the app is offline.
  const [offline, setOffline] = useState<boolean>(false);

  // Handle incoming online status updates.
  const handleOnlineStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { online } = e.detail;
      setOffline(!online);
    }
  };

  // Listen for online status updates.
  useEffect(() => {
    // Start listening for online / offline events.
    OnlineStatusController.initOnlineEvents();
  }, []);

  useEventListener(
    'online-status',
    handleOnlineStatus,
    useRef<Document>(document)
  );

  if (!offline) {
    return null;
  }
  return (
    <Wrapper>
      <FontAwesomeIcon icon={faWarning} transform="grow-4" />
      <h3>Connection appears to be offline</h3>
    </Wrapper>
  );
};
