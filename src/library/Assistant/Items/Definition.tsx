// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { DefinitionWrapper as Wrapper } from '../Wrappers';
import { DefinitionProps } from '../types';

export const Heading = (props: DefinitionProps) => {
  const { onClick, title, description } = props;

  const subtitle =
    description[0].length > 50
      ? `${description[0].substring(0, 50)}...`
      : description[0];

  return (
    <Wrapper>
      <motion.button
        className="item"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{
          duration: 0.5,
          type: 'spring',
          bounce: 0.4,
        }}
        onClick={onClick}
      >
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <div>
          <p className="icon">
            <FontAwesomeIcon icon={faChevronRight} />
          </p>
        </div>
      </motion.button>
    </Wrapper>
  );
};

export default Heading;
