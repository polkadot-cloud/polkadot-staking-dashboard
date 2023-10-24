// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import type { ReactNode } from 'react';
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
  children: ReactNode;
}) => {
  const [index, setIndexState] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );

  const indexRef = useRef(index);
  const notificationsRef = useRef(notifications);

  const setIndex = (i: number) => {
    indexRef.current = i;
    setIndexState(i);
  };

  const addNotification = (newNotification: NotificationItem) => {
    const newNotifications: NotificationInterface[] = [
      ...notificationsRef.current,
    ];

    const newIndex: number = indexRef.current + 1;

    newNotifications.push({
      index: newIndex,
      item: {
        ...newNotification,
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

  const removeNotification = (i: number) => {
    const newNotifications = notificationsRef.current.filter(
      (item: NotificationInterface) => item.index !== i
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
