// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTxFees } from 'contexts/TxFees';
import { useValidators } from 'contexts/Validators';
import { Validator } from 'contexts/Validators/types';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { ValidatorList } from 'library/ValidatorList';
import { useEffect, useState } from 'react';
import { FooterWrapper, NotesWrapper, PaddingWrapper } from '../Wrappers';
import { ListWrapper } from './Wrappers';

export const NominateFromFavorites = () => {
  const { consts, api } = useApi();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getBondedAccount } = useBalances();
  const { config, setStatus: setModalStatus, setResize } = useModal();
  const { favoritesList } = useValidators();
  const { selectedActivePool, isNominator, isOwner } = useActivePools();
  const controller = getBondedAccount(activeAccount);
  const { txFeesValid } = useTxFees();

  const { maxNominations } = consts;
  const { bondType, nominations } = config;
  const signingAccount = bondType === 'pool' ? activeAccount : controller;

  // store filtered favorites
  const [availableFavorites, setAvailableFavorites] = useState<
    Array<Validator>
  >([]);

  // store selected favorites in local state
  const [selectedFavorites, setSelectedFavorites] = useState<Array<Validator>>(
    []
  );

  // store filtered favorites
  useEffect(() => {
    if (favoritesList) {
      const _availableFavorites = favoritesList.filter(
        (favorite: Validator) =>
          !nominations.find(
            (nomination: string) => nomination === favorite.address
          ) && !favorite.prefs.blocked
      );
      setAvailableFavorites(_availableFavorites);
    }
  }, []);

  // calculate active + selected favorites
  const nominationsToSubmit = nominations.concat(
    selectedFavorites.map((favorite: Validator) => favorite.address)
  );

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setResize();
  }, [selectedFavorites]);

  // ensure selected list is within limits
  useEffect(() => {
    setValid(
      nominationsToSubmit.length > 0 &&
        nominationsToSubmit.length <= maxNominations &&
        selectedFavorites.length > 0
    );
  }, [selectedFavorites]);

  const batchKey = 'nominate_from_favorites';

  const onSelected = (provider: any) => {
    const { selected } = provider;
    setSelectedFavorites(selected);
  };

  const totalAfterSelection = nominations.length + selectedFavorites.length;
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
        selectedActivePool?.id,
        targetsToSubmit
      );
    } else {
      _tx = api.tx.staking.nominate(targetsToSubmit);
    }
    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  return (
    <>
      <Title title="Nominate Favorites" />
      <PaddingWrapper>
        <div style={{ marginBottom: '1rem' }}>
          {!accountHasSigner(signingAccount) && (
            <Warning
              text={`You must have your${
                bondType === 'stake' ? ' controller' : ' '
              }account imported to add nominations.`}
            />
          )}
        </div>
        <ListWrapper>
          {availableFavorites.length > 0 ? (
            <ValidatorList
              bondType="stake"
              validators={availableFavorites}
              batchKey={batchKey}
              title="Favorite Validators / Not Nominated"
              selectable
              selectActive
              selectToggleable={false}
              onSelected={onSelected}
              refetchOnListUpdate
              showMenu={false}
              inModal
              allowMoreCols
            />
          ) : (
            <h3>No Favorites Available.</h3>
          )}
        </ListWrapper>
        <NotesWrapper style={{ paddingBottom: 0 }}>
          <EstimatedTxFee />
        </NotesWrapper>
        <FooterWrapper>
          <h3
            className={
              selectedFavorites.length === 0 ||
              nominationsToSubmit.length > maxNominations
                ? ''
                : 'active'
            }
          >
            {selectedFavorites.length > 0
              ? overMaxNominations
                ? `Adding this many favorites will surpass ${maxNominations} nominations.`
                : `Adding ${selectedFavorites.length} Nomination${
                    selectedFavorites.length !== 1 ? `s` : ``
                  }`
              : `No Favorites Selected`}
          </h3>
          <div>
            <button
              type="button"
              className="submit"
              onClick={() => submitTx()}
              disabled={
                !valid ||
                submitting ||
                (bondType === 'pool' && !isNominator() && !isOwner()) ||
                !accountHasSigner(signingAccount) ||
                !txFeesValid
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
    </>
  );
};

export default NominateFromFavorites;
