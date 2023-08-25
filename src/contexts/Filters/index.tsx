// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState } from 'react';
import type { AnyFunction, AnyJson } from 'types';
import { defaultFiltersInterface } from './defaults';
import type {
  FilterItem,
  FilterItems,
  FilterOrder,
  FilterOrders,
  FilterSearch,
  FilterSearches,
  FilterType,
  FiltersContextInterface,
} from './types';

export const FiltersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // groups along with their includes
  const [includes, setIncludes] = useState<FilterItems>([]);

  // groups along with their excludes.
  const [excludes, setExcludes] = useState<FilterItems>([]);

  // groups along with their order.
  const [orders, setOrders] = useState<FilterOrders>([]);

  // groups along with their search terms.
  const [searchTerms, setSearchTerms] = useState<FilterSearches>([]);

  // Get stored includes or excludes for a group.
  const getFilters = (t: FilterType, g: string): string[] | null => {
    const current = t === 'exclude' ? excludes : includes;
    return current.find((e) => e.key === g)?.filters || null;
  };

  const setFilters = (t: FilterType, n: FilterItems) => {
    if (t === 'exclude') {
      setExcludes(n);
    } else {
      setIncludes(n);
    }
  };

  // Toggle a filter for a group.
  // Adds the group to `excludes` or `includes` if it does not already exist.
  const toggleFilter = (t: FilterType, g: string, f: string) => {
    const current = t === 'exclude' ? excludes : includes;
    const exists = getFilters(t, g);

    if (!exists) {
      const newFilters = [...current, { key: g, filters: [f] }];
      setFilters(t, newFilters);
      return;
    }
    const newFilters = [...current]
      .map((e) => {
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
      .filter((e) => e.filters.length !== 0);
    setFilters(t, newFilters);
  };

  // Sets an array of filters to a group.
  const setMultiFilters = (
    t: FilterType,
    g: string,
    fs: string[],
    reset: boolean
  ) => {
    // get the current filters from the group.
    const current = reset ? [] : t === 'exclude' ? excludes : includes;
    // check if filters currently exist in the group.
    const exists = getFilters(t, g);

    if (!exists) {
      const newFilters = [...current, { key: g, filters: [...fs] }];
      setFilters(t, newFilters);
      return;
    }

    let newFilters: FilterItems;
    if (current.length) {
      newFilters = [...current].map((e) => {
        // return groups we are not manipulating.
        if (e.key !== g) return e;

        let { filters } = e;
        filters = filters.filter((f: string) => !fs.includes(f)).concat(fs);
        return {
          key: e.key,
          filters,
        };
      });
    } else {
      newFilters = [{ key: g, filters: fs }];
    }
    setFilters(t, newFilters);
  };

  // Get the current order of a list or null.
  const getOrder = (g: string) =>
    orders.find((o) => o.key === g)?.order || 'default';

  // Sets an order key for a group.
  const setOrder = (g: string, o: string) => {
    let newOrders = [];
    if (o === 'default') {
      newOrders = [...orders].filter((order) => order.key !== g);
    } else if (orders.length) {
      newOrders = [...orders].map((order) =>
        order.key !== g ? order : { ...order, order: o }
      );
    } else {
      newOrders = [{ key: g, order: o }];
    }
    setOrders(newOrders);
  };

  // Get the current search term of a list or null.
  const getSearchTerm = (g: string) =>
    searchTerms.find((o) => o.key === g)?.searchTerm || null;

  // Sets an order key for a group.
  const setSearchTerm = (g: string, t: string) => {
    let newSearchTerms = [];
    if (orders.length) {
      newSearchTerms = [...searchTerms].map((term) =>
        term.key !== g ? term : { ...term, searchTerm: t }
      );
    } else {
      newSearchTerms = [{ key: g, searchTerm: t }];
    }
    setSearchTerms(newSearchTerms);
  };

  // resets excludes for a given group
  const resetFilters = (t: FilterType, g: string) => {
    const current = t === 'exclude' ? excludes : includes;
    setFilters(
      t,
      [...current].filter((e: FilterItem) => e.key !== g)
    );
  };

  // resets order for a given group
  const resetOrder = (g: string) => {
    setOrders([...orders].filter((e: FilterOrder) => e.key !== g));
  };

  // clear searchTerm from given group
  const clearSearchTerm = (g: string) => {
    setSearchTerms([...searchTerms].filter((e: FilterSearch) => e.key !== g));
  };

  // apply filters to list
  const applyFilters = (
    t: FilterType,
    g: string,
    list: AnyJson,
    fn: AnyFunction
  ) => {
    const filtersToApply = getFilters(t, g);

    if (!filtersToApply) {
      return list;
    }
    return fn(list, filtersToApply);
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
        getFilters,
        toggleFilter,
        setMultiFilters,
        getOrder,
        setOrder,
        getSearchTerm,
        setSearchTerm,
        resetFilters,
        resetOrder,
        clearSearchTerm,
        applyFilters,
        applyOrder,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const FiltersContext = React.createContext<FiltersContextInterface>(
  defaultFiltersInterface
);

export const useFilters = () => React.useContext(FiltersContext);
