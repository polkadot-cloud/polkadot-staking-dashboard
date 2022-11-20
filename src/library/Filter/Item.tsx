// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { ItemProps } from './types';
import { ItemWrapper } from './Wrappers';

export const Item = ({
  icon,
  active,
  label,
  transform,
  onClick,
  disabled = false,
}: ItemProps) => (
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
    <ItemWrapper active={active}>
      {icon ? (
        <div className="icon">
          <FontAwesomeIcon
            icon={icon}
            transform={transform}
            opacity={active ? 1 : 0.7}
          />
        </div>
      ) : null}
      <p>{label}</p>
    </ItemWrapper>
  </motion.button>
);

export default Item;
