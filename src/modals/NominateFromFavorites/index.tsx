// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useValidators } from 'contexts/Validators';
import { ValidatorList } from 'library/ValidatorList';
import { useApi } from 'contexts/Api';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useConnect } from 'contexts/Connect';
import { useBalances } from 'contexts/Balances';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { Warning } from 'library/Form/Warning';
import { Validator } from 'contexts/Validators/types';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { NotesWrapper, PaddingWrapper, FooterWrapper } from '../Wrappers';
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
  const { t } = useTranslation('common');

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
    callbackInBlock: () => { },
  });

  return (
    <>
      <Title title={t('modals.nominate_favorites')} />
      <PaddingWrapper>
        <div style={{ marginBottom: '1rem' }}>
          {!accountHasSigner(signingAccount) && (
            <Warning
              text={`{t('modals.s1')}${bondType === 'stake' ? ' controller ' : ' '
                }{t('modals.s3')}`}
            />
          )}
        </div>
        <ListWrapper>
          {availableFavorites.length > 0 ? (
            <ValidatorList
              bondType="stake"
              validators={availableFavorites}
              batchKey={batchKey}
              title={t('modals.f_not_nominated')}
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
            <h3>{t('modals.no_favorites_available')}</h3>
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
                : `Adding ${selectedFavorites.length} Nomination${selectedFavorites.length !== 1 ? `s` : ``
                }`
              : `${t('modals.no_favorites_selected')}`}
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
              {t('modals.submit')}
            </button>
          </div>
        </FooterWrapper>
      </PaddingWrapper>
    </>
  );
};

export default NominateFromFavorites;
