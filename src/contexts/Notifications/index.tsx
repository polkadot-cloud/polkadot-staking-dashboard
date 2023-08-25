// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import React, { useRef, useState } from 'react';
import { defaultNotificationsContext } from './defaults';
import type {
  NotificationInterface,
  NotificationItem,
  NotificationsContextInterface,
} from './types';

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [index, _setIndex] = useState(0);
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );

  const indexRef = useRef(index);
  const notificationsRef = useRef(notifications);

  const setIndex = (_index: number) => {
    indexRef.current = _index;
    _setIndex(_index);
  };

  const addNotification = (n: NotificationItem) => {
    const newNotifications: NotificationInterface[] = [
      ...notificationsRef.current,
    ];

    const newIndex: number = indexRef.current + 1;

    newNotifications.push({
      index: newIndex,
      item: {
        ...n,
        index: newIndex,
      },
    });

    setIndex(newIndex);
    setStateWithRef(newNotifications, setNotifications, notificationsRef);
    setTimeout(() => {
      removeNotification(newIndex);
    }, 3000);

    return newIndex;
  };

  const removeNotification = (_index: number) => {
    const newNotifications = notificationsRef.current.filter(
      (item: NotificationInterface) => item.index !== _index
    );
    setStateWithRef(newNotifications, setNotifications, notificationsRef);
  };

  return (
    <NotificationsContext.Provider
      value={{
        addNotification,
        removeNotification,
        notifications: notificationsRef.current,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const NotificationsContext =
  React.createContext<NotificationsContextInterface>(
    defaultNotificationsContext
  );

export const useNotifications = () => React.useContext(NotificationsContext);
