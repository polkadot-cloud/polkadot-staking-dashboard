// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt as faExt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

import { ItemWrapper } from '../Wrappers';

export const External = (props: any) => {
  const { width, height, subtitle, title, url, website } = props;

  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <ItemWrapper width={`${width}`} height={height || 'auto'}>
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
        {subtitle}
        <p className="icon">
          <FontAwesomeIcon icon={faExt} className="ext" />
          {website !== undefined && website}
        </p>
      </motion.button>
    </ItemWrapper>
  );
};

export default External;
