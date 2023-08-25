// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  ModalFooter,
  ModalPadding,
  ModalWarnings,
} from '@polkadot-cloud/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useValidators } from 'contexts/Validators';
import type { Validator } from 'contexts/Validators/types';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { SubmitTx } from 'library/SubmitTx';
import { ValidatorList } from 'library/ValidatorList';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { ListWrapper } from './Wrappers';

export const NominateFromFavorites = () => {
  const { t } = useTranslation('modals');
  const { consts, api } = useApi();
  const { activeAccount } = useConnect();
  const { notEnoughFunds } = useTxMeta();
  const { getBondedAccount } = useBonded();
  const { favoritesList } = useValidators();
  const { getSignerWarnings } = useSignerWarnings();
  const {
    config: { options },
    setModalStatus,
    setModalResize,
  } = useOverlay().modal;
  const { selectedActivePool, isNominator, isOwner } = useActivePools();

  const controller = getBondedAccount(activeAccount);
  const { maxNominations } = consts;
  const { bondFor, nominations } = options;
  const signingAccount = bondFor === 'pool' ? activeAccount : controller;

  // store filtered favorites
  const [availableFavorites, setAvailableFavorites] = useState<Validator[]>([]);

  // store selected favorites in local state
  const [selectedFavorites, setSelectedFavorites] = useState<Validator[]>([]);

  // store filtered favorites
  useEffect(() => {
    if (favoritesList) {
      setAvailableFavorites(
        favoritesList.filter(
          (favorite) =>
            !nominations.find(
              (nomination: string) => nomination === favorite.address
            ) && !favorite.prefs.blocked
        )
      );
    }
  }, []);

  // calculate active + selected favorites
  const nominationsToSubmit = nominations.concat(
    selectedFavorites.map((favorite) => favorite.address)
  );

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => setModalResize(), [notEnoughFunds, selectedFavorites]);

  // ensure selected list is within limits
  useEffect(() => {
    setValid(
      nominationsToSubmit.length > 0 &&
        maxNominations.isGreaterThanOrEqualTo(nominationsToSubmit.length) &&
        selectedFavorites.length > 0
    );
  }, [selectedFavorites]);

  const batchKey = 'nominate_from_favorites';

  const onSelected = (provider: any) => {
    const { selected } = provider;
    setSelectedFavorites(selected);
  };

  const totalAfterSelection = nominations.length + selectedFavorites.length;
  const overMaxNominations = maxNominations.isLessThan(totalAfterSelection);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!valid || !api) {
      return tx;
    }

    const targetsToSubmit = nominationsToSubmit.map((item: any) =>
      bondFor === 'pool'
        ? item
        : {
            Id: item,
          }
    );

    if (bondFor === 'pool') {
      tx = api.tx.nominationPools.nominate(
        selectedActivePool?.id,
        targetsToSubmit
      );
    } else {
      tx = api.tx.staking.nominate(targetsToSubmit);
    }
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
    callbackInBlock: () => {},
  });

  const warnings = getSignerWarnings(
    activeAccount,
    bondFor === 'nominator',
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <Title title={t('nominateFavorites')} />
      <ModalPadding>
        <div style={{ marginBottom: '1rem', width: '100%' }}>
          {warnings.length ? (
            <ModalWarnings withMargin>
              {warnings.map((text, i) => (
                <Warning key={`warning_${i}`} text={text} />
              ))}
            </ModalWarnings>
          ) : null}
        </div>
        <ListWrapper>
          {availableFavorites.length > 0 ? (
            <ValidatorList
              bondFor="nominator"
              validators={availableFavorites}
              batchKey={batchKey}
              title={t('favoriteNotNominated')}
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
            <h3>{t('noFavoritesAvailable')}</h3>
          )}
        </ListWrapper>
        <ModalFooter>
          <h3
            className={
              selectedFavorites.length === 0 ||
              maxNominations.isLessThan(nominationsToSubmit.length)
                ? ''
                : 'active'
            }
          >
            {selectedFavorites.length > 0
              ? overMaxNominations
                ? `${t('willSurpass', {
                    maxNominations: maxNominations.toString(),
                  })}`
                : `${t('addingFavorite', {
                    count: selectedFavorites.length,
                  })}`
              : `${t('noFavoritesSelected')}`}
          </h3>
        </ModalFooter>
      </ModalPadding>
      <SubmitTx
        fromController={bondFor === 'nominator'}
        valid={valid && !(bondFor === 'pool' && !isNominator() && !isOwner())}
        {...submitExtrinsic}
      />
    </>
  );
};
