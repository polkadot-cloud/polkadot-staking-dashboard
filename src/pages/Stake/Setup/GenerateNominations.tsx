// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { Wrapper } from '../../Overview/Announcements/Wrappers';
import { useApi } from '../../../contexts/Api';
import { useValidators } from '../../../contexts/Validators';
import { ValidatorList } from '../../../library/ValidatorList';
import { useUi } from '../../../contexts/UI';
import { Button } from '../../../library/Button';

export const GenerateNominations = (props: any) => {

  // functional props
  const { setup, setSetup } = props;
  const { isReady }: any = useApi();
  const { removeValidatorMetaBatch, validators, favouritesList, meta } = useValidators();

  const {
    applyValidatorOrder,
    applyValidatorFilters,
  }: any = useUi();

  const [method, setMethod]: any = useState(null);
  const [fetching, setFetching] = useState(false);
  const [nominations, setNominations] = useState(setup.nominations);

  const rawBatchKey = 'validators_browse';
  const batchKey = 'generated_nominations';

  const fetchFavourites = () => {
    let _favs = [];
    if (favouritesList.length) {
      // take subset of up to 16 favourites
      _favs = favouritesList.slice(0, 16);
    }
    return _favs;
  }

  const fetchMostProfitable = () => {
    // generate nominations from validator list
    let _nominations = Object.assign(validators);
    // filter validators to find profitable candidates
    _nominations = applyValidatorFilters(_nominations, rawBatchKey, ['all_commission', 'blocked_nominations', 'over_subscribed', 'inactive']);
    // order validators to find profitable candidates
    _nominations = applyValidatorOrder(_nominations, 'commission');
    // TODO: unbiased shuffle resulting validators
    // _nominations = shuffle(_nominations);
    // choose subset of validators
    if (_nominations.length) {
      _nominations = _nominations.slice(0, 16);
    }
    return _nominations;
  }

  useEffect(() => {
    if (!isReady || !validators.length) {
      return;
    }

    // wait for validator meta data to be fetched
    let batch = meta[rawBatchKey];
    if (batch === undefined) {
      return;
    } else {
      if (batch.stake === undefined) {
        return;
      }
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

      // update setup state
      setSetup({
        ...setup,
        nominations: _nominations,
      });
    }
  });

  return (
    <Wrapper style={{ minHeight: 200 }}>
      <div style={{ margin: '1rem 0' }}>
        <>
          <Button inline title="Get Most Profitable" onClick={() => {
            setMethod('Most Profitable Validators');
            removeValidatorMetaBatch(batchKey);
            setNominations([]);
            setFetching(true);
          }}
          />
          {favouritesList === null ? <></> :
            <Button title="Get Favourites" onClick={() => {
              setMethod('Favourites');
              removeValidatorMetaBatch(batchKey);
              setNominations([]);
              setFetching(true);
            }}
            />
          }
        </>
      </div>
      {fetching
        ?
        <div style={{ marginTop: '0.5rem' }}>
          <h3>Fetching your nominations...</h3>
        </div>
        :
        <>
          {isReady &&
            nominations.length > 0 &&
            <div style={{ marginTop: '1rem' }}>
              <ValidatorList
                validators={nominations}
                batchKey={batchKey}
                title={method}
                allowMoreCols
              />
            </div>
          }
        </>
      }
    </Wrapper>
  );
}

export default GenerateNominations;
