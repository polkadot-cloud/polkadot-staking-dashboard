// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
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
import { useTranslation } from 'react-i18next';
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
  const getTx = () => {
    let tx = null;
    if (!valid || !api) {
      return tx;
    }

    const targetsToSubmit = nominationsToSubmit.map((item: any) =>
      bondType === 'pool'
        ? item
        : {
            Id: item,
          }
    );

    if (bondType === 'pool') {
      tx = api.tx.nominationPools.nominate(
        selectedActivePool?.id,
        targetsToSubmit
      );
    } else {
      tx = api.tx.staking.nominate(targetsToSubmit);
    }
    return tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  return (
    <>
      <Title title={t('modals.nominate_favorites')} />
      <PaddingWrapper>
        <div style={{ marginBottom: '1rem' }}>
          {!accountHasSigner(signingAccount) && (
            <Warning
              text={`{t('modals.s1')}${
                bondType === 'stake' ? ' controller ' : ' '
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
              showMenu={false}
              inModal
              allowMoreCols
              refetchOnListUpdate
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
                ? `${t('modals.will_surpass')}`
                : `${t('modals.adding_favorite', {
                    count: selectedFavorites.length,
                  })}`
              : `${t('modals.no_favorites_selected')}`}
          </h3>
          <div>
            <ButtonSubmit
              text={`Submit${submitting ? 'ting' : ''}`}
              iconLeft={faArrowAltCircleUp}
              iconTransform="grow-2"
              onClick={() => submitTx()}
              disabled={
                !valid ||
                submitting ||
                (bondType === 'pool' && !isNominator() && !isOwner()) ||
                !accountHasSigner(signingAccount) ||
                !txFeesValid
              }
            />
          </div>
        </FooterWrapper>
      </PaddingWrapper>
    </>
  );
};

export default NominateFromFavorites;
