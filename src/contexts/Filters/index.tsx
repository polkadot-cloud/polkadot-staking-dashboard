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
  const getExcludes = (g: string): Array<string> | null => {
    return excludes.find((e: FilterExclude) => e.key === g)?.filters || null;
  };

  // Toggle an exclude for a group.
  // Adds the group to `excludes` if it does not already exist.
  const toggleExclude = (g: string, f: string) => {
    const current = getExcludes(g);

    if (!current) {
      const newExcludes = [...excludes, { key: g, filters: [f] }];
      setExcludes(newExcludes);
      return;
    }
    const newExcludes = [...excludes]
      .map((e: FilterExclude) => {
        if (e.key !== g) return e;
        let { filters } = e;

        if (filters.includes(f)) {
          filters.splice(filters.indexOf(f), 1);
        } else {
          filters = filters.concat(f);
        }
        return {
          key: e.key,
          filters,
        };
      })
      .filter((e: FilterExclude) => e.filters.length !== 0);
    setExcludes(newExcludes);
  };

  // Sets an array of excludes to a group.
  const setMultiExcludes = (g: string, fs: Array<string>) => {
    const current = getExcludes(g);

    if (!current) {
      const newExcludes = [...excludes, { key: g, filters: [...fs] }];
      setExcludes(newExcludes);
      return;
    }
    const newExcludes = [...excludes].map((e: FilterExclude) => {
      if (e.key !== g) return e;
      let { filters } = e;
      filters = filters.filter((f: string) => !fs.includes(f)).concat(fs);

      return {
        key: e.key,
        filters,
      };
    });
    setExcludes(newExcludes);
  };

  // Get the current order of a list or null.
  const getOrder = (g: string) => {
    return orders.find((o: FilterOrder) => o.key === g)?.order || 'default';
  };

  // Sets an order key for a group.
  const setOrder = (g: string, o: string) => {
    let newOrders = [];
    if (o === 'default') {
      newOrders = [...orders].filter((order: FilterOrder) => order.key !== g);
    } else if (orders.length) {
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

  // resets excludes for a given group
  const resetExcludes = (g: string) => {
    setExcludes([...excludes].filter((e: FilterExclude) => e.key !== g));
  };

  // resets order for a given group
  const resetOrder = (g: string) => {
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
        resetExcludes,
        resetOrder,
        clearSearchTerm,
        applyExcludes,
        applyOrder,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
