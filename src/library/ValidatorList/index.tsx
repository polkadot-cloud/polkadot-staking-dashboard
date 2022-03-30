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

  const { setListFormat, listFormat, validators: validatorsUi, setValidatorsOrder }: any = useUi();
  const { isReady }: any = useApi();
  const {
    fetchValidatorMetaBatch,
    getValidatorMetaBatch,
    VALIDATORS_PER_BATCH_MUTLI,
  }: any = useStakingMetrics();
  const { allowMoreCols, allowFilters }: any = props;

  const [renderIteration, _setRenderIteration]: any = useState(1);
  const [validators, setValidators]: any = useState(props.validators);

  const renderIterationRef = useRef(renderIteration);

  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    _setRenderIteration(iter);
  }

  // start fetching metadata batches
  useEffect(() => {
    fetchValidatorMetaBatch(props.batchKey, validators);
  }, [isReady()]);


  // list ui changes / validator changes trigger re-render of list
  useEffect(() => {
    handleValidatorsUpdate();
  }, [props.validators, validatorsUi])

  const handleValidatorsUpdate = async () => {
    // TODO: handle ordering here if set.
    setValidators(props.validators);
    setRenderIteration(1);
  }


  let batchEnd = (renderIteration * VALIDATORS_PER_BATCH_MUTLI) - 1;

  useEffect(() => {
    if (batchEnd >= validators.length) {
      return;
    }
    setTimeout(() => {
      setRenderIteration(renderIterationRef.current + 1)
    }, 500);
  }, [renderIterationRef.current, validators]);


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
  const stake = meta.stake ?? [];

  const synced = {
    identities: (identities.length > 0) ?? false,
    stake: (stake.length > 0) ?? false,
  };

  // first batch of validators
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
                <Item
                  label='lowest commission'
                  icon={faPercentage}
                  transform='grow-12'
                  active={validatorsUi.orderBy === 'commission'}
                  onClick={() => setValidatorsOrder()}
                />
              </div>
            </div>

            <div className='separator'></div>
            <div className='section'>
              <div className='head'>Filter</div>
              <div className='items'>
                <Item
                  label='over subscribed'
                  icon={faStopCircle}
                  transform='grow-10'
                  active={false}
                  onClick={() => { }}
                />
                <Item
                  label='100% commission'
                  icon={faBalanceScaleLeft}
                  transform='grow-6'
                  active={false}
                  onClick={() => { }}
                />
                <Item
                  label='blocked nominations'
                  icon={faUserSlash}
                  transform='grow-9'
                  active={false}
                  onClick={() => { }}
                />
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
          {listValidators.map((validator: any, index: number) => {
            return (
              <motion.div className={`item ${listFormat === 'row' ? `row` : `col`}`} key={`nomination_${index}`} variants={listItem}>
                <Validator
                  validator={validator}
                  identity={identities[index]}
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