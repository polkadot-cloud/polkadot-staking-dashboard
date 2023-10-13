// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AnimatePresence, motion } from 'framer-motion';
import { useNotifications } from 'contexts/Notifications';
import type { NotificationInterface } from 'contexts/Notifications/types';
import { Wrapper } from './Wrapper';

export const Notifications = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <Wrapper>
      <AnimatePresence initial={false}>
        {notifications.length > 0 &&
          notifications.map(
            (notification: NotificationInterface, i: number) => {
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
                  onClick={() => removeNotification(index)}
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
