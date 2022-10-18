// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { ItemProps } from './types';
import { ItemWrapper } from './Wrappers';

export const Item = (props: ItemProps) => {
  const { icon, label, transform, onClick } = props;
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
      style={{
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <ItemWrapper active={props.active} style={{ width: props.width ?? 180 }}>
        <div className="icon">
          <FontAwesomeIcon
            icon={icon}
            transform={transform}
            opacity={props.active ? 1 : 0.7}
          />
        </div>
        <p>{label}</p>
      </ItemWrapper>
    </motion.button>
  );
};

export default Item;
