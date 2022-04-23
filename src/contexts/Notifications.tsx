// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useRef } from "react";

export interface NotificationsContextState {
  addNotification: (n: any) => any;
  removeNotification: (n: any) => void;
  notifications: any;
}

export const NotificationsContext: React.Context<NotificationsContextState> = React.createContext({
  addNotification: (n: any) => { },
  removeNotification: (n: any) => { },
  notifications: [],
});

export const useNotifications = () => React.useContext(NotificationsContext);

export const NotificationsContextWrapper = (props: any) => {

  const [index, _setIndex] = useState(0);
  const [notifications, _setNotifications]: any = useState([]);
  const indexRef = useRef(index);
  const notificationsRef = useRef(notifications);

  const setIndex = (_index: any) => {
    indexRef.current = _index;
    _setIndex(_index);
  }

  const setNotifications = (_notifications: any) => {
    notificationsRef.current = _notifications;
    _setNotifications(_notifications);
  }

  const add = (_n: any) => {
    let _notifications = [...notificationsRef.current];

    let newIndex = indexRef.current + 1;

    let item = {
      ..._n,
      index: newIndex
    };
    _notifications.push({
      index: newIndex,
      item: item,
    });

    setIndex(newIndex);
    setNotifications(_notifications);
    setTimeout(() => { remove(newIndex); }, 3000);

    return newIndex;
  };

  const remove = (index: any) => {
    let _notifications = notificationsRef.current.filter((item: any) => item.index !== index);
    setNotifications(_notifications);
  };

  return (
    <NotificationsContext.Provider value={{
      addNotification: add,
      removeNotification: remove,
      notifications: notificationsRef.current,
    }}>
      {props.children}
    </NotificationsContext.Provider>
  );
}