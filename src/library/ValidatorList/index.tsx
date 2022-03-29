// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { List, Header, Wrapper as ListWrapper } from '../../library/List';
import { motion } from 'framer-motion';
import { Validator } from '../../library/Validator';
import { useApi } from '../../contexts/Api';
import { StakingMetricsContext, useStakingMetrics } from '../../contexts/Staking';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGripVertical, faPercentage, faStopCircle, faUserSlash, faBalanceScaleLeft } from '@fortawesome/free-solid-svg-icons';
import { useUi } from '../../contexts/UI';
import { FiltersWrapper } from './Filters';
import { Item } from './Item';

export const ValidatorListInner = (props: any) => {

  const { setListFormat, listFormat }: any = useUi();
  const { isReady }: any = useApi();
  const {
    fetchValidatorMetaBatch,
    getValidatorMetaBatch,
    VALIDATORS_PER_BATCH_MUTLI,
  }: any = useStakingMetrics();
  const { validators, allowMoreCols, allowFilters }: any = props;

  const [renderIteration, _setRenderIteration]: any = useState(1);

  const renderIterationRef = useRef(renderIteration);

  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    _setRenderIteration(iter);
  }

  useEffect(() => {
    fetchValidatorMetaBatch(props.batchKey, props.validators);
  }, [isReady()]);

  useEffect(() => {
    setRenderIteration(1);
  }, [props.validators])

  let batchEnd = (renderIteration * VALIDATORS_PER_BATCH_MUTLI) - 1;

  useEffect(() => {
    if (batchEnd >= validators.length) {
      return;
    }
    setTimeout(() => {
      setRenderIteration(renderIterationRef.current + 1)
    }, 250);
  }, [renderIterationRef.current, props.validators]);


  if (!validators.length) {
    return (<></>);
  }

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

  const meta: any = getValidatorMetaBatch(props.batchKey) ?? [];
  const identities = meta.identities ?? [];
  const prefs = meta.prefs ?? [];
  const stake = meta.stake ?? [];

  const synced = {
    identities: (identities.length > 0) ?? false,
    prefs: (prefs.length > 0) ?? false,
    stake: (stake.length > 0) ?? false,
  };

  const listValidators = validators.slice(0, batchEnd);

  return (
    <ListWrapper>
      <Header>
        <div>
          <h3>{props.title}</h3>
        </div>
        <div>
          <button onClick={() => setListFormat('row')}><FontAwesomeIcon icon={faBars} color={listFormat === 'row' ? '#d33079' : '#222'} /></button>
          <button onClick={() => setListFormat('col')}><FontAwesomeIcon icon={faGripVertical} color={listFormat === 'col' ? '#d33079' : '#222'} /></button>
        </div>
      </Header>
      <List
        flexBasisLarge={allowMoreCols ? '33%' : '50%'}
      >
        {allowFilters &&
          <FiltersWrapper>

            <div className='section'>
              <div className='head'>Order</div>
              <div className='items'>
                <Item label='lowest commission' icon={faPercentage} transform='grow-12' />
              </div>
            </div>

            <div className='separator'></div>
            <div className='section'>
              <div className='head'>Filter</div>
              <div className='items'>
                <Item label='over subscribed' icon={faStopCircle} transform='grow-10' />
                <Item label='100% commission' icon={faBalanceScaleLeft} transform='grow-6' />
                <Item label='blocked nominations' icon={faUserSlash} transform='grow-9' />
              </div>
            </div>

          </FiltersWrapper>
        }
        <motion.div
          className='transition'
          variants={container}
          initial="hidden"
          animate="show"
        >
          {listValidators.map((addr: string, index: number) => {
            return (
              <motion.div className={`item ${listFormat === 'row' ? `row` : `col`}`} key={`nomination_${index}`} variants={listItem}>
                <Validator
                  address={addr}
                  identity={identities[index]}
                  prefs={prefs[index]}
                  stake={stake[index]}
                  synced={synced}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </List>
    </ListWrapper>
  );
}


export class ValidatorList extends React.Component<any, any> {

  static contextType = StakingMetricsContext;

  shouldComponentUpdate (nextProps: any, nextState: any) {
    return (this.props.validators !== nextProps.validators);
  }

  render () {
    return (
      <ValidatorListInner
        {...this.props}
      />
    )
  }
}

export default ValidatorList