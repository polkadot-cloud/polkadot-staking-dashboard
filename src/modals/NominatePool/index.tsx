// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useConnect } from 'contexts/Connect';
import { Warning } from 'library/Form/Warning';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import {
  FooterWrapper,
  Separator,
  NotesWrapper,
  PaddingWrapper,
} from '../Wrappers';

export const NominatePool = () => {
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { selectedActivePool, isOwner, isNominator, targets } =
    useActivePools();
  const { txFeesValid } = useTxFees();
  const { nominations } = targets;
  const { t } = useTranslation('common');

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  const poolId = selectedActivePool?.id ?? null;

  // ensure selected roles are valid
  const isValid =
    (poolId !== null && isNominator() && nominations.length > 0) ?? false;
  useEffect(() => {
    setValid(isValid);
  }, [isValid]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!valid || !api) {
      return _tx;
    }
    const targetsToSubmit = nominations.map((item: any) => item.address);
    _tx = api.tx.nominationPools.nominate(poolId, targetsToSubmit);
    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  // warnings
  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(t('modals.w1'));
  }
  if (!nominations.length) {
    warnings.push(t('modals.w6'));
  }
  if (!isOwner() || !isNominator()) {
    warnings.push(t('modals.w8'));
  }

  return (
    <>
      <Title title={t('modals.nominate')} icon={faPlayCircle} />
      <PaddingWrapper verticalOnly>
        <div
          style={{ padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}
        >
          {warnings.map((text: string, index: number) => (
            <Warning key={`warning_${index}`} text={text} />
          ))}
          <h2>
            You Have {nominations.length} Nomination
            {nominations.length === 1 ? '' : 's'}
          </h2>
          <Separator />
          <NotesWrapper>
            <p>{t('modals.nominate')} </p>
            <EstimatedTxFee />
          </NotesWrapper>
          <FooterWrapper>
            <div>
              <button
                type="button"
                className="submit"
                onClick={() => submitTx()}
                disabled={
                  !valid ||
                  submitting ||
                  warnings.length > 0 ||
                  !accountHasSigner(activeAccount) ||
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
        </div>
      </PaddingWrapper>
    </>
  );
};

export default NominatePool;
