// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNotifications } from 'contexts/Notifications';
import { AnimatePresence, motion } from 'framer-motion';
import Wrapper from './Wrapper';

export const Notifications = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <Wrapper>
      <AnimatePresence initial={false}>
        {notifications.length > 0 &&
          notifications.map((_n: any, i: number) => {
            const { item } = _n;

            return (
              <motion.li
                key={`notification_${i}`}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                  y: 50,
                  transition: { duration: 0.2 },
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => removeNotification(item)}
              >
                {item.title && <h3>{item.title}</h3>}
                {item.subtitle && <h5>{item.subtitle}</h5>}
              </motion.li>
            );
          })}
      </AnimatePresence>
    </Wrapper>
  );
};

export default Notifications;
