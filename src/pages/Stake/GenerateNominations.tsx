// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { Wrapper } from '../Overview/Announcements/Wrappers';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useValidators } from '../../contexts/Validators';
import { ValidatorList } from '../../library/ValidatorList';
import { useUi } from '../../contexts/UI';
import { Button } from '../../library/Button';

export const GenerateNominations = (props: any) => {
  // functional props
  const setters = props.setters ?? [];
  const defaultNominations = props.nominations;
  const { batchKey } = props;

  const { isReady }: any = useApi();
  const { activeAccount } = useConnect();
  const { removeValidatorMetaBatch, validators, favouritesList, meta } =
    useValidators();
  const { applyValidatorOrder, applyValidatorFilters }: any = useUi();

  const [method, setMethod]: any = useState(null);
  const [fetching, setFetching] = useState(false);
  const [nominations, setNominations] = useState(defaultNominations);

  const rawBatchKey = 'validators_browse';

  // update selected value on account switch
  useEffect(() => {
    setNominations(defaultNominations);
  }, [activeAccount, defaultNominations]);

  const fetchFavourites = () => {
    let _favs = [];
    if (favouritesList.length) {
      // take subset of up to 16 favourites
      _favs = favouritesList.slice(0, 16);
    }
    return _favs;
  };

  const fetchMostProfitable = () => {
    // generate nominations from validator list
    let _nominations = Object.assign(validators);
    // filter validators to find profitable candidates
    _nominations = applyValidatorFilters(_nominations, rawBatchKey, [
      'all_commission',
      'blocked_nominations',
      'over_subscribed',
      'inactive',
      'missing_identity',
    ]);
    // order validators to find profitable candidates
    _nominations = applyValidatorOrder(_nominations, 'commission');
    // TODO: unbiased shuffle resulting validators
    // _nominations = shuffle(_nominations);
    // choose subset of validators
    if (_nominations.length) {
      _nominations = _nominations.slice(0, 16);
    }
    return _nominations;
  };

  useEffect(() => {
    if (!isReady || !validators.length) {
      return;
    }

    // wait for validator meta data to be fetched
    const batch = meta[rawBatchKey];
    if (batch === undefined) {
      return;
    }
    if (batch.stake === undefined) {
      return;
    }

    // fetch nominations based on method
    let _nominations;
    if (fetching) {
      switch (method) {
        case 'Favourites':
          _nominations = fetchFavourites();
          break;
        default:
          _nominations = fetchMostProfitable();
      }

      // update component state
      setNominations(_nominations);
      setFetching(false);

      // apply update to setters
      for (const s of setters) {
        s.set({
          ...s.current,
          nominations: _nominations,
        });
      }
    }
  });

  return (
    <Wrapper style={{ minHeight: 200 }}>
      <div>
        {nominations.length ? (
          <Button
            inline
            small
            title="Clear Nominations"
            onClick={() => {
              setMethod(null);
              removeValidatorMetaBatch(batchKey);
              setNominations([]);
              for (const s of setters) {
                s.set({
                  ...s.current,
                  nominations: [],
                });
              }
            }}
          />
        ) : (
          <>
            <Button
              inline
              small
              title="Get Most Profitable"
              onClick={() => {
                setMethod('Most Profitable');
                removeValidatorMetaBatch(batchKey);
                setNominations([]);
                setFetching(true);
              }}
            />
            {favouritesList === null ? (
              <></>
            ) : (
              <Button
                small
                title="Get Favourites"
                onClick={() => {
                  setMethod('Favourites');
                  removeValidatorMetaBatch(batchKey);
                  setNominations([]);
                  setFetching(true);
                }}
              />
            )}
          </>
        )}
      </div>
      {fetching ? (
        <></>
      ) : (
        <>
          {isReady && nominations.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <ValidatorList
                validators={nominations}
                batchKey={batchKey}
                allowMoreCols
              />
            </div>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default GenerateNominations;
