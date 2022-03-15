// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { List } from '../../library/List';
import { motion } from 'framer-motion';
import { Validator } from '../../library/Validator';
import { StakingMetricsContext } from '../../contexts/Staking';

export const ValidatorListInner = (props: any) => {

  const { validators }: any = props;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.025,
      }
    }
  };

  const listItem = {
    hidden: {
      y: 25,
      opacity: 0
    },
    show: {
      y: 0,
      opacity: 1,
    }
  };

  return (
    <List variants={container} initial="hidden" animate="show">
      {validators.map((addr: string, index: number) =>
        <motion.div className='item' key={`nomination_${index}`} variants={listItem}>
          <Validator address={addr} />
        </motion.div>
      )}
    </List>
  );
}

export class ValidatorList extends React.Component<any, any> {

  static contextType = StakingMetricsContext;

  state = {
    meta: {},
  }

  shouldComponentUpdate (nextProps: any, nextState: any) {
    return (this.props.validators !== nextProps.validators || this.state.meta !== nextState.meta);
  }

  componentDidMount () {
    this.context.fetchValidatorMetaBatch(this.props.batchKey, this.props.validators);
  }

  render () {
    return (
      <ValidatorListInner
        meta={this.state.meta}
        {...this.props}
      />
    )
  }
}

export default ValidatorList