// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useValidators } from 'contexts/Validators';
import { ValidatorList } from 'library/ValidatorList';
import { useApi } from 'contexts/Api';
import { APIContextInterface } from 'types/api';
import { useStaking } from 'contexts/Staking';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import {
  ActivePoolContextState,
  PoolMembershipsContextState,
} from 'types/pools';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface } from 'types/connect';
import { useBalances } from 'contexts/Balances';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { NotesWrapper, PaddingWrapper, FooterWrapper } from '../Wrappers';
import { ListWrapper } from './Wrappers';

export const NominateFromFavourites = () => {
  const { consts, api } = useApi() as APIContextInterface;
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { getBondedAccount }: any = useBalances();
  const { config, setStatus: setModalStatus, setResize } = useModal();
  const { favouritesList } = useValidators();
  const { getControllerNotImported } = useStaking();
  const { isNominator, isOwner } = useActivePool() as ActivePoolContextState;
  const controller = getBondedAccount(activeAccount);
  const { membership } = usePoolMemberships() as PoolMembershipsContextState;
  const { maxNominations } = consts;
  const { bondType, nominations }: any = config;
  const signingAccount = bondType === 'pool' ? activeAccount : controller;

  // store selected favourites in local state
  const [selectedFavourites, setSelectedFavourites] = useState([]);

  // store filtered favourites
  const [nonActiveFavourites, setNonActiveFavourites] = useState([]);

  // store filtered favourites
  useEffect(() => {
    const _nonActiveFavourites = favouritesList.filter(
      (favourite: any) =>
        !nominations.find((nomination: any) => nomination === favourite.address)
    );
    setNonActiveFavourites(_nonActiveFavourites);
  }, []);

  // calculate active + selected favourites
  const nominationsToSubmit = nominations.concat(
    selectedFavourites.map((favourite: any) => favourite.address)
  );

  // valid to submit transaction
  const [valid, setValid]: any = useState(false);

  useEffect(() => {
    setResize();
  }, [selectedFavourites]);

  // ensure selected list is within limits
  useEffect(() => {
    setValid(
      nominationsToSubmit.length > 0 &&
        nominationsToSubmit.length <= maxNominations &&
        selectedFavourites.length > 0
    );
  }, [selectedFavourites]);

  const batchKey = 'nominate_from_favourites';

  const onSelected = (provider: any) => {
    const { selected } = provider;
    setSelectedFavourites(selected);
  };

  const totalAfterSelection = nominations.length + selectedFavourites.length;
  const overMaxNominations = totalAfterSelection > maxNominations;

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!valid || !api) {
      return _tx;
    }

    const targetsToSubmit = nominationsToSubmit.map((item: any) =>
      bondType === 'pool'
        ? item
        : {
            Id: item,
          }
    );

    if (bondType === 'pool') {
      _tx = api.tx.nominationPools.nominate(
        membership?.poolId,
        targetsToSubmit
      );
    } else {
      _tx = api.tx.staking.nominate(targetsToSubmit);
    }
    return _tx;
  };

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  return (
    <PaddingWrapper>
      <h2>Nominate From Favourites</h2>
      <ListWrapper>
        {nonActiveFavourites.length > 0 ? (
          <ValidatorList
            validators={nonActiveFavourites}
            batchKey={batchKey}
            title="Favourite Validators / Not Nominated"
            selectable
            selectActive
            selectToggleable={false}
            onSelected={onSelected}
            refetchOnListUpdate
            showMenu={false}
            inModal
          />
        ) : (
          <h3>No Favourites.</h3>
        )}
      </ListWrapper>
      <NotesWrapper style={{ paddingBottom: 0 }}>
        <p style={{ textAlign: 'right' }}>
          Estimated Tx Fee: {estimatedFee === null ? '...' : `${estimatedFee}`}
        </p>
      </NotesWrapper>
      <FooterWrapper>
        <h3
          className={
            selectedFavourites.length === 0 ||
            nominationsToSubmit.length > maxNominations
              ? ''
              : 'active'
          }
        >
          {selectedFavourites.length > 0
            ? overMaxNominations
              ? `Adding this many favourites will surpass ${maxNominations} nominations.`
              : `Adding ${selectedFavourites.length} Nomination${
                  selectedFavourites.length !== 1 ? `s` : ``
                }`
            : `No Favourites Selected`}
        </h3>
        <div>
          <button
            type="button"
            className="submit"
            onClick={() => submitTx()}
            disabled={
              !valid ||
              submitting ||
              (bondType === 'stake' && getControllerNotImported(controller)) ||
              (bondType === 'pool' && !isNominator() && !isOwner())
            }
          >
            <FontAwesomeIcon
              transform="grow-2"
              icon={faArrowAltCircleUp as IconProp}
            />
            Submit
          </button>
        </div>
      </FooterWrapper>
    </PaddingWrapper>
  );
};

export default NominateFromFavourites;
