// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { ItemProps } from './types';
import { ItemWrapper } from './Wrappers';

export const Item = ({
  disabled = false,
  icon,
  label,
  transform,
  onClick,
}: ItemProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.99 }}
    transition={{
      duration: 0.3,
    }}
    onClick={() => onClick()}
    disabled={disabled}
  >
    <ItemWrapper>
      {icon ? (
        <div className="icon">
          <FontAwesomeIcon icon={icon} transform={transform} />
        </div>
      ) : null}
      <p>{label}</p>
    </ItemWrapper>
  </motion.button>
);

export default Item;
