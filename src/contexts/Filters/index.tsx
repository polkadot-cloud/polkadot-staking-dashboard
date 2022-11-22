// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { AnyFunction, AnyJson } from 'types';
import { defaultFiltersInterface } from './defaults';
import {
  FilterExclude,
  FilterExcludes,
  FilterOrder,
  FilterOrders,
  FiltersContextInterface,
  FilterSearch,
  FilterSearches,
} from './types';

export const FiltersContext = React.createContext<FiltersContextInterface>(
  defaultFiltersInterface
);

export const useFilters = () => React.useContext(FiltersContext);

export const FiltersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // groups along with their excludes.
  const [excludes, setExcludes] = useState<FilterExcludes>([]);

  // groups along with their order.
  const [orders, setOrders] = useState<FilterOrders>([]);

  // groups along with their search terms.
  const [searchTerms, setSearchTerms] = useState<FilterSearches>([]);

  // Get stored filters for a group.
  const getExcludes = (g: string) => {
    return excludes.find((e: FilterExclude) => e.key === g)?.filters || null;
  };

  // Toggle ane exclude for a group.
  // Adds the group to `excludes` if it does not already exist.
  const toggleExclude = (g: string, key: string) => {
    const current = getExcludes(g);
    if (current) {
      setExcludes([
        ...excludes,
        { key: g, filters: current.splice(current.indexOf(key), 1) },
      ]);
    } else {
      setExcludes([...excludes, { key: g, filters: [key] }]);
    }
  };

  // Sets an array of excludes to a group.
  const setMultiExcludes = (g: string, keys: Array<string>) => {
    const current = getExcludes(g);
    if (current) {
      const newCurrent = current
        .filter((c: string) => !keys.includes(c))
        .concat(keys);
      setExcludes([...excludes, { key: g, filters: newCurrent }]);
    } else {
      setExcludes([...excludes, { key: g, filters: keys }]);
    }
  };

  // Get the current order of a list or null.
  const getOrder = (g: string) => {
    return orders.find((o: FilterOrder) => o.key === g)?.order || null;
  };

  // Sets an order key for a group.
  const setOrder = (g: string, o: string) => {
    let newOrders = [];
    if (orders.length) {
      newOrders = [...orders].map((order: FilterOrder) =>
        order.key !== g ? order : { ...order, order: o }
      );
    } else {
      newOrders = [{ key: g, order: o }];
    }
    setOrders(newOrders);
  };

  // Get the current search term of a list or null.
  const getSearchTerm = (g: string) => {
    return (
      searchTerms.find((o: FilterSearch) => o.key === g)?.searchTerm || null
    );
  };

  // Sets an order key for a group.
  const setSearchTerm = (g: string, t: string) => {
    let newSearchTerms = [];
    if (orders.length) {
      newSearchTerms = [...searchTerms].map((term: FilterSearch) =>
        term.key !== g ? term : { ...term, searchTerm: t }
      );
    } else {
      newSearchTerms = [{ key: g, searchTerm: t }];
    }
    setSearchTerms(newSearchTerms);
  };

  // clear excludes for a given group
  const clearExcludes = (g: string) => {
    setExcludes([...excludes].filter((e: FilterExclude) => e.key !== g));
  };

  // clear order for a given group
  const clearOrder = (g: string) => {
    setOrders([...orders].filter((e: FilterOrder) => e.key !== g));
  };

  // clear searchTerm from given group
  const clearSearchTerm = (g: string) => {
    setSearchTerms([...searchTerms].filter((e: FilterSearch) => e.key !== g));
  };

  // apply excludes to list
  const applyExcludes = (g: string, list: AnyJson, fn: AnyFunction) => {
    const excludesToApply = getExcludes(g);
    if (!excludesToApply) {
      return list;
    }
    return fn(list, excludesToApply);
  };

  // apply order to a list
  const applyOrder = (g: string, list: AnyJson, fn: AnyFunction) => {
    const orderToApply = getOrder(g);
    if (!orderToApply) {
      return list;
    }
    return fn(list, orderToApply);
  };

  return (
    <FiltersContext.Provider
      value={{
        getExcludes,
        toggleExclude,
        setMultiExcludes,
        getOrder,
        setOrder,
        getSearchTerm,
        setSearchTerm,
        clearExcludes,
        clearOrder,
        clearSearchTerm,
        applyExcludes,
        applyOrder,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
