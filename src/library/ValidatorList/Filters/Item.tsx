// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useTheme } from 'styled-components';
import defaultThemes from 'theme/default';
import { ItemWrapper } from './Wrapper';

export const Item = (props: any) => {
  const { mode }: any = useTheme();
  const { icon, label, transform, onClick } = props;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      transition={{
        duration: 0.3,
      }}
      onClick={() => {
        onClick();
      }}
    >
      <ItemWrapper active={props.active}>
        <section>
          {props.active && (
            <div className="active">
              <FontAwesomeIcon icon={faCheck} transform="grow-0" />
            </div>
          )}
          <div className="icon">
            <FontAwesomeIcon
              icon={icon}
              color={
                props.active ? 'white' : defaultThemes.text.secondary[mode]
              }
              transform={transform}
              opacity={props.active ? 1 : 0.7}
            />
          </div>
        </section>
        <section>
          <p>{label}</p>
        </section>
      </ItemWrapper>
    </motion.button>
  );
};

export default Item;
