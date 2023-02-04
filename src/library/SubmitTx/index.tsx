// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useTheme } from 'contexts/Themes';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useEffect } from 'react';
import { defaultThemes } from 'theme/default';
import { SubmitTxProps } from './types';
import { Wrapper } from './Wrappers';

export const SubmitTx = ({
  buttons,
  fromController = false,
}: SubmitTxProps) => {
  const { unit } = useApi().network;
  const { mode } = useTheme();
  const { notEnoughFunds } = useTxFees();
  const { setResize } = useModal();

  const displayNote = notEnoughFunds || fromController;

  useEffect(() => {
    setResize();
  }, [notEnoughFunds, fromController]);

  return (
    <Wrapper>
      {displayNote ? (
        <p className="sign">
          {fromController ? (
            <>
              <FontAwesomeIcon icon={faPenToSquare} transform="shrink-1" />{' '}
              Signed by Controller
            </>
          ) : null}
          {notEnoughFunds ? (
            <>
              {fromController ? ' / ' : null}
              <FontAwesomeIcon
                icon={faWarning}
                transform="shrink-1"
                color={defaultThemes.text.danger[mode]}
              />{' '}
              <span style={{ color: defaultThemes.text.danger[mode] }}>
                Not Enough {unit}
              </span>
            </>
          ) : null}
        </p>
      ) : null}

      <div className="inner">
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
