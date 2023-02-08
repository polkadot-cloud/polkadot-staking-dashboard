// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faPenToSquare, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitTxProps } from './types';
import { Wrapper } from './Wrappers';

export const SubmitTx = ({
  buttons,
  fromController = false,
}: SubmitTxProps) => {
  const { t } = useTranslation('library');
  const { unit } = useApi().network;
  const { notEnoughFunds } = useTxFees();
  const { setResize } = useModal();

  const displayNote = notEnoughFunds || fromController;

  useEffect(() => {
    setResize();
  }, [notEnoughFunds, fromController]);

  return (
    <Wrapper>
      <div className="inner">
        {displayNote ? (
          <p className="sign">
            {fromController ? (
              <>
                <FontAwesomeIcon icon={faPenToSquare} className="icon" />
                {t('signedByController')}
              </>
            ) : null}
            {notEnoughFunds ? (
              <>
                {fromController ? ' / ' : null}
                <FontAwesomeIcon
                  icon={faWarning}
                  className="danger"
                  transform="shrink-1"
                />{' '}
                <span className="danger">
                  {t('notEnough')} {unit}
                </span>
              </>
            ) : null}
          </p>
        ) : null}
        <section className="foot">
          <div>
            <EstimatedTxFee />
          </div>
          <div>
            <div>{buttons}</div>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};
