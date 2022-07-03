// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useRef } from 'react';
import { setStateWithRef } from 'Utils';
import { defaultNotificationsContext } from './defaults';

export interface NotificationsContextInterface {
  addNotification: (n: any) => any;
  removeNotification: (n: any) => void;
  notifications: any;
}

export const NotificationsContext =
  React.createContext<NotificationsContextInterface>(
    defaultNotificationsContext
  );

export const useNotifications = () => React.useContext(NotificationsContext);

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [index, _setIndex] = useState(0);
  const [notifications, setNotifications]: any = useState([]);
  const indexRef = useRef(index);
  const notificationsRef = useRef(notifications);

  const setIndex = (_index: number) => {
    indexRef.current = _index;
    _setIndex(_index);
  };

  const add = (_n: any) => {
    const _notifications = [...notificationsRef.current];

    const newIndex = indexRef.current + 1;

    const item = {
      ..._n,
      index: newIndex,
    };
    _notifications.push({
      index: newIndex,
      item,
    });

    setIndex(newIndex);
    setStateWithRef(_notifications, setNotifications, notificationsRef);
    setTimeout(() => {
      remove(newIndex);
    }, 3000);

    return newIndex;
  };

  const remove = (_index: number) => {
    const _notifications = notificationsRef.current.filter(
      (item: any) => item.index !== _index
    );
    setStateWithRef(_notifications, setNotifications, notificationsRef);
  };

  return (
    <NotificationsContext.Provider
      value={{
        addNotification: add,
        removeNotification: remove,
        notifications: notificationsRef.current,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
