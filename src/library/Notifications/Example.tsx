import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseButton } from "./CloseButton";
import { add, remove } from "./array-utils";
import Wrapper from './Wrapper';

export const Example = () => {

  const [notifications, _setNotifications]: any = useState([]);

  const notificationsRef = useRef(notifications);

  const setNotifications = (val: any) => {
    notificationsRef.current = val;
    _setNotifications(val);
  }

  useEffect(() => {
    // listen for D key to toggle demo bar
    window.onkeydown = (e: KeyboardEvent): any => {
      if (e.code === 'KeyN') {
        setNotifications(add(notificationsRef.current));
      }
    }
  }, []);

  return (
    <Wrapper>
      <AnimatePresence initial={false}>

        {notifications.length > 0 &&
          notifications.map((id: any) => (
            <motion.li
              key={id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, y: 50, transition: { duration: 0.2 } }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setNotifications(remove(notificationsRef.current, id))}
            >
              <div>
                <h3>Welcome to Polkadot Staking!</h3>
                <h4>Connect your accounts to get started. Visit the Assistant if you get stuck at any point along the way.</h4>
                <CloseButton
                  close={() => setNotifications(remove(notificationsRef.current, id))}
                />
              </div>
            </motion.li>
          ))
        }
      </AnimatePresence>
      {/* <button
        className="add"
        onClick={() => { setNotifications(add(notificationsRef.current)) }}
      >
        +
      </button> */}
    </Wrapper>
  );
};
