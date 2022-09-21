// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { LargeItemWrapper } from './Wrappers';

export const LargeItem = (props: any) => {
  const { icon, title, subtitle, transform, onClick } = props;
  const disabled = props.disabled ?? false;

  return (
    <motion.button
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      transition={{
        duration: 0.3,
      }}
      onClick={() => {
        onClick();
      }}
      className="motion-button"
      style={{
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <LargeItemWrapper>
        <section>
          <div className="icon">
            <FontAwesomeIcon
              icon={icon}
              transform={transform}
              opacity={props.active ? 1 : 0.7}
            />
          </div>
          <h3>{title}</h3>
        </section>
        <section>
          <p>{subtitle}</p>
        </section>
      </LargeItemWrapper>
    </motion.button>
  );
};
