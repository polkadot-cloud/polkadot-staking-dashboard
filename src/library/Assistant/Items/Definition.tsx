// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import { DefinitionWrapper as Wrapper } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export const Heading = (props: any) => {

  const { onClick, title, description } = props;

  let subtitle = description[0].length > 50
    ? description[0].substring(0, 50) + '...'
    : description[0];

  return (
    <Wrapper width="100%" height="100px">
      <motion.button
        className='item'
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.4,
        }}
        onClick={onClick}
      >
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <div>
          <p className='icon'><FontAwesomeIcon icon={faChevronRight} /></p>
        </div>
      </motion.button>
    </Wrapper>
  )
}

export default Heading;