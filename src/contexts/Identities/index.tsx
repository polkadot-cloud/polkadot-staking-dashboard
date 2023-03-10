// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi, AnyMetaBatch } from 'types';
import { setStateWithRef } from 'Utils';
import { useApi } from '../Api';
import { defaultIdentitiesContext } from './defaults';
import type { IdentitiesContextInterface } from './types';

// context definition
export const IdentitiesContext =
  React.createContext<IdentitiesContextInterface>(defaultIdentitiesContext);

export const useIdentities = () => React.useContext(IdentitiesContext);

// wrapper component to provide components with context
export const IdentitiesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady, api } = useApi();

  // stores the meta data batches for validator lists
  const [identitiesMetaBatches, setIdentitiesMetaBatch] =
    useState<AnyMetaBatch>({});
  const identitiesMetaBatchesRef = useRef(identitiesMetaBatches);

  // stores the meta batch subscriptions for validator lists
  const [identitiesSubs, setIdentitiesSubs] = useState<AnyApi>({});
  const identitiesSubsRef = useRef(identitiesSubs);

  // unsubscribe from any validator meta batches
  useEffect(
    () => () => {
      Object.values(identitiesSubsRef.current).map((batch: AnyMetaBatch) =>
        Object.entries(batch).map(([, v]: AnyApi) => v())
      );
    },
    []
  );

  /*
    Fetches a new batch of subscribed accounts metadata. Stores the returning
    metadata alongside the unsubscribe function in state.
    structure:
    {
      key: {
        [
          {
          addresses [],
          identities: [],
        }
      ]
    },
  };
  */
  const fetchIdentitiesMetaBatch = async (
    key: string,
    addresses: string[],
    refetch = false
  ) => {
    if (!isReady || !api) {
      return;
    }

    if (!addresses.length) {
      return;
    }

    if (!refetch) {
      // if already exists, do not re-fetch
      if (identitiesMetaBatchesRef.current[key] !== undefined) {
        return;
      }
    } else {
      // tidy up if existing batch exists
      const updatedMetaBatches: AnyMetaBatch = {
        ...identitiesMetaBatchesRef.current,
      };
      delete updatedMetaBatches[key];
      setStateWithRef(
        updatedMetaBatches,
        setIdentitiesMetaBatch,
        identitiesMetaBatchesRef
      );
      if (identitiesSubsRef.current[key] !== undefined) {
        for (const unsub of identitiesSubsRef.current[key]) {
          unsub();
        }
      }
    }

    // store batch addresses
    const batchesUpdated = Object.assign(identitiesMetaBatchesRef.current);
    batchesUpdated[key] = {};
    batchesUpdated[key].addresses = addresses;
    setStateWithRef(
      { ...batchesUpdated },
      setIdentitiesMetaBatch,
      identitiesMetaBatchesRef
    );

    const subscribeToIdentities = async (addr: string[]) => {
      const unsub = await api.query.identity.identityOf.multi<AnyApi>(
        addr,
        (_identities) => {
          const identities = [];
          for (let i = 0; i < _identities.length; i++) {
            identities.push(_identities[i].toHuman());
          }
          const _batchesUpdated = Object.assign(
            identitiesMetaBatchesRef.current
          );
          _batchesUpdated[key].identities = identities;
          setStateWithRef(
            { ..._batchesUpdated },
            setIdentitiesMetaBatch,
            identitiesMetaBatchesRef
          );
        }
      );
      return unsub;
    };

    const subscribeToSuperIdentities = async (addr: string[]) => {
      const unsub = await api.query.identity.superOf.multi<AnyApi>(
        addr,
        async (_supers) => {
          // determine where supers exist
          const supers: AnyApi = [];
          const supersWithIdentity: AnyApi = [];

          for (let i = 0; i < _supers.length; i++) {
            const _super = _supers[i].toHuman();
            supers.push(_super);
            if (_super !== null) {
              supersWithIdentity.push(i);
            }
          }

          // get supers one-off multi query
          const query = supers
            .filter((s: AnyApi) => s !== null)
            .map((s: AnyApi) => s[0]);

          (
            await api.query.identity.identityOf.multi<AnyApi>(
              query,
              (_identities) => {
                for (let j = 0; j < _identities.length; j++) {
                  const _identity = _identities[j].toHuman();
                  // inject identity into super array
                  supers[supersWithIdentity[j]].identity = _identity;
                }
              }
            )
          )();

          const _batchesUpdated = Object.assign(
            identitiesMetaBatchesRef.current
          );
          _batchesUpdated[key].supers = supers;
          setStateWithRef(
            { ..._batchesUpdated },
            setIdentitiesMetaBatch,
            identitiesMetaBatchesRef
          );
        }
      );
      return unsub;
    };

    await Promise.all([
      subscribeToIdentities(addresses),
      subscribeToSuperIdentities(addresses),
    ]).then((unsubs: AnyApi) => {
      addMetaBatchUnsubs(key, unsubs);
    });
  };

  /*
   * Helper function to add mataBatch unsubs by key.
   */
  const addMetaBatchUnsubs = (key: string, unsubs: AnyApi) => {
    const _unsubs = identitiesSubsRef.current;
    const _keyUnsubs = _unsubs[key] ?? [];

    _keyUnsubs.push(...unsubs);
    _unsubs[key] = _keyUnsubs;
    setStateWithRef(_unsubs, setIdentitiesSubs, identitiesSubsRef);
  };

  return (
    <IdentitiesContext.Provider
      value={{
        fetchIdentitiesMetaBatch,
        meta: identitiesMetaBatchesRef.current,
      }}
    >
      {children}
    </IdentitiesContext.Provider>
  );
};
