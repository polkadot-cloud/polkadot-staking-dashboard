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
import { useNetworkMetrics } from 'contexts/Network';
import { LIST_ITEMS_PER_PAGE, LIST_ITEMS_PER_BATCH } from 'consts';
import { Validator } from 'library/ValidatorList/Validator';
import { List, Header, Wrapper as ListWrapper } from 'library/List';
import { useModal } from 'contexts/Modal';
import { useTheme } from 'contexts/Themes';
import { networkColors } from 'theme/default';
import {
  useValidatorFilter,
  ValidatorFilterProvider,
} from 'library/Filter/context';
import { useUi } from 'contexts/UI';
import { Pagination } from 'library/List/Pagination';
import { MotionContainer } from 'library/List/MotionContainer';
import { Selectable } from 'library/List/Selectable';
import { SearchInput } from 'library/List/SearchInput';
import { useTranslation } from 'react-i18next';
import { Filters } from './Filters';
import { useList, ListProvider } from '../List/context';

export const ValidatorListInner = (props: any) => {
  const { mode } = useTheme();
  const { isReady, network } = useApi();
  const { activeAccount } = useConnect();
  const { metrics } = useNetworkMetrics();
  const { fetchValidatorMetaBatch } = useValidators();
  const provider = useList();
  const modal = useModal();
  const { t } = useTranslation('common');

  // determine the nominator of the validator list.
  // By default this will be the activeAccount. But for pools,
  // the pool stash address should be the nominator.
  const nominator = props.nominator ?? activeAccount;

  const { selected, listFormat, setListFormat } = provider;

  const { isSyncing } = useUi();
  const {
    validatorFilters,
    validatorOrder,
    applyValidatorFilters,
    applyValidatorOrder,
    validatorSearchFilter,
  } = useValidatorFilter();

  const {
    batchKey,
    allowMoreCols,
    allowFilters,
    toggleFavorites,
    pagination,
    title,
    format,
    selectable,
    bondType,
  }: any = props;

  const actions = props.actions ?? [];
  const showMenu = props.showMenu ?? true;
  const inModal = props.inModal ?? false;
  const allowSearch = props.allowSearch ?? false;
  const allowListFormat = props.allowListFormat ?? true;

  const actionsAll = [...actions].filter((action) => !action.onSelected);
  const actionsSelected = [...actions].filter(
    (action: any) => action.onSelected
  );

  const disableThrottle = props.disableThrottle ?? false;
  const refetchOnListUpdate =
    props.refetchOnListUpdate !== undefined ? props.refetchOnListUpdate : false;

  // current page
  const [page, setPage] = useState<number>(1);

  // current render iteration
  const [renderIteration, _setRenderIteration] = useState<number>(1);

  // default list of validators
  const [validatorsDefault, setValidatorsDefault] = useState(props.validators);

  // manipulated list (ordering, filtering) of validators
  const [validators, setValidators]: any = useState(props.validators);

  // is this the initial fetch
  const [fetched, setFetched] = useState(false);

  // store whether the search bar is being used
  const [isSearching, setIsSearching] = useState(false);

  // render throttle iteration
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    _setRenderIteration(iter);
  };

  // pagination
  const totalPages = Math.ceil(validators.length / LIST_ITEMS_PER_PAGE);
  const pageEnd = page * LIST_ITEMS_PER_PAGE - 1;
  const pageStart = pageEnd - (LIST_ITEMS_PER_PAGE - 1);

  // render batch
  const batchEnd = renderIteration * LIST_ITEMS_PER_BATCH - 1;

  // reset list when validator list changes
  useEffect(() => {
    const validatorsEqual =
      JSON.stringify(props.validators) === JSON.stringify(validatorsDefault);

    if (!validatorsEqual) {
      setFetched(false);
    }
  }, [props.validators, nominator]);

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

  // trigger onSelected when selection changes
  useEffect(() => {
    if (props.onSelected) {
      props.onSelected(provider);
    }
  }, [selected]);

  // list ui changes / validator changes trigger re-render of list
  useEffect(() => {
    if (allowFilters && fetched) {
      handleValidatorsFilterUpdate();
    }
  }, [validatorFilters, validatorOrder, isSyncing]);

  // handle modal resize on list format change
  useEffect(() => {
    maybeHandleModalResize();
  }, [listFormat, renderIteration, validators, page]);

  // handle validator list bootstrapping
  const setupValidatorList = () => {
    setValidatorsDefault(props.validators);
    setValidators(props.validators);
    setFetched(true);
    fetchValidatorMetaBatch(batchKey, props.validators, refetchOnListUpdate);
  };

  // handle filter / order update
  const handleValidatorsFilterUpdate = (
    filteredValidators: any = Object.assign(validatorsDefault)
  ) => {
    if (allowFilters) {
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

  // if in modal, handle resize
  const maybeHandleModalResize = () => {
    if (!inModal) return;
    modal.setResize();
  };

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    // update validator list
    let filteredValidators = Object.assign(validatorsDefault);
    filteredValidators = validatorSearchFilter(
      filteredValidators,
      batchKey,
      newValue
    );

    // ensure no duplicates
    filteredValidators = filteredValidators.filter(
      (value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => t.address === value.address)
    );

    handleValidatorsFilterUpdate(filteredValidators);
    setPage(1);
    setIsSearching(e.currentTarget.value !== '');
    setRenderIteration(1);
  };

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
          {allowListFormat === true && (
            <>
              <button type="button" onClick={() => setListFormat('row')}>
                <FontAwesomeIcon
                  icon={faBars}
                  color={
                    listFormat === 'row'
                      ? networkColors[`${network.name}-${mode}`]
                      : 'inherit'
                  }
                />
              </button>
              <button type="button" onClick={() => setListFormat('col')}>
                <FontAwesomeIcon
                  icon={faGripVertical}
                  color={
                    listFormat === 'col'
                      ? networkColors[`${network.name}-${mode}`]
                      : 'inherit'
                  }
                />
              </button>
            </>
          )}
        </div>
      </Header>
      <List flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        {allowSearch && (
          <SearchInput
            handleChange={handleSearchChange}
            placeholder={t('library.search_address_or_identity')}
          />
        )}

        {allowFilters && <Filters />}

        {listValidators.length > 0 && pagination && (
          <Pagination page={page} total={totalPages} setter={setPage} />
        )}

        {selectable && (
          <Selectable
            canSelect={listValidators.length > 0}
            actionsAll={actionsAll}
            actionsSelected={actionsSelected}
          />
        )}

        <MotionContainer>
          {listValidators.length ? (
            <>
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
                      nominator={nominator}
                      toggleFavorites={toggleFavorites}
                      batchIndex={batchIndex}
                      batchKey={batchKey}
                      format={format}
                      showMenu={showMenu}
                      bondType={bondType}
                      inModal={inModal}
                    />
                  </motion.div>
                );
              })}
            </>
          ) : (
            <h4 style={{ marginTop: '1rem' }}>
              {isSearching
                ? t('library.no_match2')
                : t('library.no_validators')}
            </h4>
          )}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};

export const ValidatorList = (props: any) => {
  const { selectActive, selectToggleable } = props;
  return (
    <ListProvider
      selectActive={selectActive}
      selectToggleable={selectToggleable}
    >
      <ValidatorFilterProvider>
        <ValidatorListShouldUpdate {...props} />
      </ValidatorFilterProvider>
    </ListProvider>
  );
};

export class ValidatorListShouldUpdate extends React.Component<any, any> {
  static contextType = StakingContext;

  shouldComponentUpdate(nextProps: any) {
    return this.props.validators !== nextProps.validators;
  }

  render() {
    return <ValidatorListInner {...this.props} />;
  }
}

export default ValidatorList;
