// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt as faExt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { ItemWrapper } from '../Wrappers';
import type { ExternalProps } from './types';

export const External = ({ width, title, url, website }: ExternalProps) => {
  const handleClick = useCallback(() => {
    window.open(url, '_blank');
  }, [url]);

  return (
    <ItemWrapper width={width}>
      <motion.button
        className="item"
        whileHover={{ scale: 1.004 }}
        whileTap={{ scale: 0.99 }}
        transition={{
          duration: 0.5,
          type: 'spring',
          bounce: 0.4,
        }}
        onClick={handleClick}
      >
        <h2>{title}</h2>
        <p className="icon">
          <FontAwesomeIcon icon={faExt} className="ext" />
          {website !== undefined && website}
        </p>
      </motion.button>
    </ItemWrapper>
  );
};
