// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { StakingContext } from 'contexts/Staking';
import { useValidators } from 'contexts/Validators';
import { useUi } from 'contexts/UI';
import { useNetworkMetrics } from 'contexts/Network';
import { LIST_ITEMS_PER_PAGE, LIST_ITEMS_PER_BATCH } from 'consts';
import { APIContextInterface } from 'types/api';
import { Validator } from 'library/ValidatorList/Validator';
import {
  List,
  Header,
  Wrapper as ListWrapper,
  Pagination,
  Selectable,
} from 'library/List';
import { ConnectContextInterface } from 'types/connect';
import { Filters } from './Filters';
import { useValidatorList, ValidatorListProvider } from './context';

export const ValidatorListInner = (props: any) => {
  const { isReady } = useApi() as APIContextInterface;
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { metrics }: any = useNetworkMetrics();
  const { fetchValidatorMetaBatch } = useValidators();
  const provider = useValidatorList();
  const { selectActive, setSelectActive, selected, listFormat, setListFormat } =
    provider;

  const {
    validatorFilters,
    validatorOrder,
    applyValidatorFilters,
    applyValidatorOrder,
    isSyncing,
  }: any = useUi();

  const {
    batchKey,
    allowMoreCols,
    allowFilters,
    toggleFavourites,
    pagination,
    title,
    format,
    selectable,
  }: any = props;

  const actions = props.actions ?? [];
  const actionsAll = [...actions].filter((action: any) => !action.onSelected);
  const actionsSelected = [...actions].filter(
    (action: any) => action.onSelected
  );

  const disableThrottle = props.disableThrottle ?? false;
  const refetchOnListUpdate =
    props.refetchOnListUpdate !== undefined ? props.refetchOnListUpdate : false;

  // current page
  const [page, setPage]: any = useState(1);

  // current render iteration
  const [renderIteration, _setRenderIteration]: any = useState(1);

  // default list of validators
  const [validatorsDefault, setValidatorsDefault] = useState(props.validators);

  // manipulated list (ordering, filtering) of validators
  const [validators, setValidators]: any = useState(props.validators);

  // is this the initial fetch
  const [fetched, setFetched] = useState(false);

  // render throttle iteration
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    _setRenderIteration(iter);
  };

  // pagination
  const totalPages = Math.ceil(validators.length / LIST_ITEMS_PER_PAGE);
  const nextPage = page + 1 > totalPages ? totalPages : page + 1;
  const prevPage = page - 1 < 1 ? 1 : page - 1;
  const pageEnd = page * LIST_ITEMS_PER_PAGE - 1;
  const pageStart = pageEnd - (LIST_ITEMS_PER_PAGE - 1);

  // render batch
  const batchEnd = renderIteration * LIST_ITEMS_PER_BATCH - 1;

  // reset list when validator list changes
  useEffect(() => {
    if (props.validators !== validatorsDefault) {
      setFetched(false);
    }
  }, [props.validators, activeAccount]);

  // configure validator list when network is ready to fetch
  useEffect(() => {
    if (isReady && metrics.activeEra.index !== 0 && !fetched) {
      setupValidatorList();
    }
  }, [isReady, metrics.activeEra.index, fetched]);

  // render throttle
  useEffect(() => {
    if (!(batchEnd >= pageEnd || disableThrottle)) {
      setTimeout(() => {
        setRenderIteration(renderIterationRef.current + 1);
      }, 50);
    }
  }, [renderIterationRef.current]);

  // list ui changes / validator changes trigger re-render of list
  useEffect(() => {
    if (allowFilters && fetched) {
      handleValidatorsFilterUpdate();
    }
  }, [validatorFilters, validatorOrder, isSyncing]);

  // handle validator list bootstrapping
  const setupValidatorList = () => {
    setValidatorsDefault(props.validators);
    setValidators(props.validators);
    setFetched(true);
    fetchValidatorMetaBatch(batchKey, props.validators, refetchOnListUpdate);
  };

  // handle filter / order update
  const handleValidatorsFilterUpdate = () => {
    if (allowFilters) {
      let filteredValidators = Object.assign(validatorsDefault);
      if (validatorOrder !== 'default') {
        filteredValidators = applyValidatorOrder(
          filteredValidators,
          validatorOrder
        );
      }
      filteredValidators = applyValidatorFilters(filteredValidators, batchKey);
      setValidators(filteredValidators);
      setPage(1);
      setRenderIteration(1);
    }
  };

  // get validators to render
  let listValidators = [];

  // get throttled subset or entire list
  if (!disableThrottle) {
    listValidators = validators.slice(pageStart).slice(0, batchEnd);
  } else {
    listValidators = validators;
  }

  if (!validators.length) {
    return <></>;
  }

  return (
    <ListWrapper>
      <Header>
        <div>
          <h4>
            {title ||
              `Dispalying ${validators.length} Validator${
                validators.length === 1 ? '' : 's'
              }`}
          </h4>
        </div>
        <div>
          <button type="button" onClick={() => setListFormat('row')}>
            <FontAwesomeIcon
              icon={faBars}
              color={listFormat === 'row' ? '#d33079' : 'inherit'}
            />
          </button>
          <button type="button" onClick={() => setListFormat('col')}>
            <FontAwesomeIcon
              icon={faGripVertical}
              color={listFormat === 'col' ? '#d33079' : 'inherit'}
            />
          </button>
        </div>
      </Header>
      <List flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        {allowFilters && <Filters />}

        {pagination && (
          <Pagination prev={page !== 1} next={page !== totalPages}>
            <div>
              <h4>
                Page {page} of {totalPages}
              </h4>
            </div>
            <div>
              <button
                type="button"
                className="prev"
                onClick={() => {
                  setPage(prevPage);
                }}
              >
                Prev
              </button>
              <button
                type="button"
                className="next"
                onClick={() => {
                  setPage(nextPage);
                }}
              >
                Next
              </button>
            </div>
          </Pagination>
        )}

        {selectable && (
          <Selectable>
            {actionsAll.map((a: any, i: number) => (
              <button
                key={`a_all_${i}`}
                type="button"
                onClick={() => a.onClick(provider)}
              >
                {a.title}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setSelectActive(!selectActive);
              }}
            >
              {selectActive ? 'Cancel Selection' : 'Select'}
            </button>
            {selected.length > 0 && (
              <>
                {actionsSelected.map((a: any, i: number) => (
                  <button
                    key={`a_selected_${i}`}
                    type="button"
                    onClick={() => a.onClick(provider)}
                  >
                    {a.title}
                  </button>
                ))}
              </>
            )}
          </Selectable>
        )}

        <motion.div
          className="transition"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.01,
              },
            },
          }}
        >
          {listValidators.map((validator: any, index: number) => {
            // fetch batch data by referring to default list index.
            const batchIndex = validatorsDefault.indexOf(validator);

            return (
              <motion.div
                className={`item ${listFormat === 'row' ? 'row' : 'col'}`}
                key={`nomination_${index}`}
                variants={{
                  hidden: {
                    y: 15,
                    opacity: 0,
                  },
                  show: {
                    y: 0,
                    opacity: 1,
                  },
                }}
              >
                <Validator
                  validator={validator}
                  toggleFavourites={toggleFavourites}
                  batchIndex={batchIndex}
                  batchKey={batchKey}
                  format={format}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </List>
    </ListWrapper>
  );
};

export const ValidatorList = (props: any) => {
  return (
    <ValidatorListProvider>
      <ValidatorListShouldUpdate {...props} />
    </ValidatorListProvider>
  );
};

export class ValidatorListShouldUpdate extends React.Component<any, any> {
  static contextType = StakingContext;

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return this.props.validators !== nextProps.validators;
  }

  render() {
    return <ValidatorListInner {...this.props} />;
  }
}

export default ValidatorList;
