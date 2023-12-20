// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AnimatePresence, motion } from 'framer-motion';
// import { useNotifications } from 'contexts/Notifications';
import type { NotificationInterface } from 'contexts/Notifications/types';
import { Wrapper } from './Wrapper';
import { useEffect, useRef, useState } from 'react';
import { setStateWithRef } from '@polkadot-cloud/utils';
import { isCustomEvent } from 'static/utils';

export const Notifications = () => {
  // const { notifications, removeNotification } = useNotifications();

  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );

  const notificationsRef = useRef(notifications);

  const notificationCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const { title, subtitle } = e.detail;

      const newNotifications: NotificationInterface[] = [
        ...notificationsRef.current,
        { index: notificationsRef.current.length, item: { title, subtitle } },
      ];
      setStateWithRef(newNotifications, setNotifications, notificationsRef);
      console.log(newNotifications);
    }
  };

  useEffect(() => {
    document.addEventListener('notification', notificationCallback);
    return () => {
      document.removeEventListener('notification', notificationCallback);
    };
  }, []);

  return (
    <Wrapper>
      <AnimatePresence initial={false}>
        {notifications.length > 0 &&
          notifications.map(
            (notification: NotificationInterface, i: number) => {
              // eslint-disable-next-line
              const { item, index } = notification;

              return (
                <motion.li
                  key={`notification_${i}`}
                  layout
                  initial={{ opacity: 0, y: -50, scale: 0.75 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.75,
                    y: -50,
                    transition: { duration: 0.2 },
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    /* removeNotification(index) */
                  }}
                >
                  {item.title && <h3>{item.title}</h3>}
                  {item.subtitle && <h4>{item.subtitle}</h4>}
                </motion.li>
              );
            }
          )}
      </AnimatePresence>
    </Wrapper>
  );
};
