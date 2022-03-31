// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { List, Header, Wrapper as ListWrapper, Pagination } from '../../library/List';
import { motion } from 'framer-motion';
import { Validator } from '../../library/Validator';
import { useApi } from '../../contexts/Api';
import { StakingMetricsContext, useStaking } from '../../contexts/Staking';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { useUi } from '../../contexts/UI';
import { Filters } from './Filters';

const ITEMS_PER_PAGE = 60;

export const ValidatorListInner = (props: any) => {

  const { setListFormat, listFormat, validators: validatorsUi }: any = useUi();
  const { isReady }: any = useApi();
  const {
    fetchValidatorMetaBatch,
    getValidatorMetaBatch,
    VALIDATORS_PER_BATCH_MUTLI,
  }: any = useStaking();
  const { allowMoreCols, allowFilters, pagination }: any = props;

  const [renderIteration, _setRenderIteration]: any = useState(1);
  const [validators, setValidators]: any = useState(props.validators);
  const [page, setPage]: any = useState(1);

  // pagination
  let totalPages = Math.ceil(validators.length / ITEMS_PER_PAGE);
  let nextPage = page + 1 > totalPages ? totalPages : page + 1;
  let prevPage = page - 1 < 1 ? 1 : page - 1;

  // render throttle iteration
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    _setRenderIteration(iter);
  }
  useEffect(() => {
    fetchValidatorMetaBatch(props.batchKey, validators);
  }, [isReady()]);

  let batchEnd = (renderIteration * VALIDATORS_PER_BATCH_MUTLI) - 1;
  let pageEnd = (page * ITEMS_PER_PAGE) - 1;
  let pageStart = pageEnd - (ITEMS_PER_PAGE - 1);

  useEffect(() => {
    if (batchEnd >= pageEnd) {
      return;
    }
    setTimeout(() => {
      setRenderIteration(renderIterationRef.current + 1)
    }, 500);
  }, [renderIterationRef.current, validators]);


  // TODO: handle ordering and filtering changes with useEffect.
  // list ui changes / validator changes trigger re-render of list
  useEffect(() => {
    handleValidatorsUpdate();
  }, [props.validators, validatorsUi])

  const handleValidatorsUpdate = async () => {
    // TODO: handle ordering and filtering here if set.
    setValidators(props.validators);
    setRenderIteration(1);
  }


  if (!validators.length) {
    return (<></>);
  }

  // format component display data
  const meta: any = getValidatorMetaBatch(props.batchKey) ?? [];
  const identities = meta.identities ?? [];
  const stake = meta.stake ?? [];

  const synced = {
    identities: (identities.length > 0) ?? false,
    stake: (stake.length > 0) ?? false,
  };


  // first batch of validators
  const _listValidators = validators.slice(pageStart);
  const listValidators = _listValidators.slice(0, ITEMS_PER_PAGE);

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
        {allowFilters && <Filters />}

        {pagination &&
          <Pagination
            prev={page !== 1}
            next={page !== totalPages}
          >
            <div>
              <h4>Page {page} of {totalPages}</h4>
            </div>
            <div>
              <button className='prev' onClick={() => setPage(prevPage)}>Prev</button>
              <button className='next' onClick={() => setPage(nextPage)}>Next</button>
            </div>
          </Pagination>
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