// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { List, Header, Wrapper as ListWrapper, Pagination } from '../../library/List';
import { motion } from 'framer-motion';
import { Validator } from '../../library/Validator';
import { useApi } from '../../contexts/Api';
import { StakingContext, useStaking } from '../../contexts/Staking';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { useUi } from '../../contexts/UI';
import { Filters } from './Filters';

const ITEMS_PER_PAGE = 50;

export const ValidatorListInner = (props: any) => {

  const {
    setListFormat,
    listFormat,
    validatorFilters,
    validatorOrder,
    applyValidatorFilters,
    applyValidatorOrder
  }: any = useUi();

  const { isReady }: any = useApi();

  const {
    fetchValidatorMetaBatch,
    getValidatorMetaBatch,
    VALIDATORS_PER_BATCH_MUTLI,
  }: any = useStaking();

  const { allowMoreCols, allowFilters, toggleFavourites, pagination }: any = props;

  let refetchOnListUpdate = props.refetchOnListUpdate !== undefined
    ? props.refetchOnListUpdate
    : false;

  const [page, setPage]: any = useState(1);
  const [renderIteration, _setRenderIteration]: any = useState(1);
  // default list of validators
  const [validatorsDefault, setValidatorsDefault] = useState(props.validators);
  // manipulated list (ordering, filtering) of validators
  const [validators, setValidators]: any = useState(props.validators ?? []);
  // is this the initial render
  const [initial, setInitial] = useState(true);
  // is this the initial fetch
  const [fetched, setFetched] = useState(false);

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

  let batchEnd = (renderIteration * VALIDATORS_PER_BATCH_MUTLI) - 1;
  let pageEnd = (page * ITEMS_PER_PAGE) - 1;
  let pageStart = pageEnd - (ITEMS_PER_PAGE - 1);

  // format component display data
  const meta: any = getValidatorMetaBatch(props.batchKey) ?? [];
  const identities = meta.identities ?? [];
  const supers = meta.supers ?? [];
  const stake = meta.stake ?? [];

  const synced = {
    identities: (identities.length > 0) ?? false,
    supers: (supers.length > 0) ?? false,
    stake: (stake.length > 0) ?? false,
  };

  // refetch when validator list changes.
  useEffect(() => {
    setFetched(false);
  }, [props.validators]);

  // configure validator list.
  // should only be done once for each list change.
  useEffect(() => {
    if (isReady && !fetched) {
      setValidatorsDefault(props.validators);
      setValidators(props.validators);
      setInitial(true);
      setFetched(true);
      fetchValidatorMetaBatch(props.batchKey, props.validators, refetchOnListUpdate);
    }
  }, [isReady, fetched]);

  // handle throttle animations
  useEffect(() => {
    if (batchEnd >= pageEnd) {
      return;
    }
    setTimeout(() => {
      setRenderIteration(renderIterationRef.current + 1)
    }, 500);
  }, [renderIterationRef.current]);

  // list ui changes / validator changes trigger re-render of list
  useEffect(() => {
    handleValidatorsFilterUpdate();
  }, [validatorFilters, validatorOrder]);

  // handle filter / order update
  const handleValidatorsFilterUpdate = () => {
    if (allowFilters) {
      let filteredValidators = Object.assign(validatorsDefault);
      if (validatorOrder !== 'default') {
        filteredValidators = applyValidatorOrder(filteredValidators, validatorOrder);
      }
      filteredValidators = applyValidatorFilters(filteredValidators, props.batchKey);
      setValidators(filteredValidators);
      setPage(1);
      setRenderIteration(1);
    }
  }

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

  // first batch of validators
  const _listValidators = validators.slice(pageStart);
  const listValidators = _listValidators.slice(0, ITEMS_PER_PAGE);

  return (
    <ListWrapper>
      <Header>
        <div>
          <h3>{props.title}</h3>
        </div>
        <div>
          <button onClick={() => setListFormat('row')}><FontAwesomeIcon icon={faBars} color={listFormat === 'row' ? '#d33079' : 'inherit'} /></button>
          <button onClick={() => setListFormat('col')}><FontAwesomeIcon icon={faGripVertical} color={listFormat === 'col' ? '#d33079' : 'inherit'} /></button>
        </div>
      </Header>
      <List
        flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}
      >
        {allowFilters && <Filters setInitial={setInitial} />}

        {pagination &&
          <Pagination
            prev={page !== 1}
            next={page !== totalPages}
          >
            <div>
              <h4>Page {page} of {totalPages}</h4>
            </div>
            <div>
              <button className='prev' onClick={() => { setPage(prevPage); setInitial(false); }}>Prev</button>
              <button className='next' onClick={() => { setPage(nextPage); setInitial(false); }}>Next</button>
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

            // fetch batch data by referring to default list index.
            let batchIndex = validatorsDefault.indexOf(validator);

            return (
              <motion.div className={`item ${listFormat === 'row' ? `row` : `col`}`} key={`nomination_${index}`} variants={listItem}>
                <Validator
                  initial={initial}
                  validator={validator}
                  identity={identities[batchIndex]}
                  superIdentity={supers[batchIndex]}
                  stake={stake[batchIndex]}
                  synced={synced}
                  toggleFavourites={toggleFavourites}
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

  static contextType = StakingContext;

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