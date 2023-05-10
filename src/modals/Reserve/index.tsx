// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { greaterThanZero } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { SubmitTx } from 'library/SubmitTx';
import { PaddingWrapper } from 'modals/Wrappers';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SliderWrapper } from './Wrapper';

export const UpdateReserve = () => {
  const { t } = useTranslation('modals');
  const [reserve, setReserve] = useState(1);
  const { activeAccount, accountHasSigner } = useConnect();
  const { setStatus: setModalStatus } = useModal();
  const { api } = useApi();

  const updateReserve = (e: ChangeEvent<HTMLInputElement>) => {
    setReserve(Number(e.currentTarget.value));
  };

  const [reserveValid, setreserveValid] = useState(false);

  const isValid = (() => greaterThanZero(new BigNumber(300)))();
  useEffect(() => {
    setreserveValid(isValid);
  }, [isValid]);

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(<Warning text={t('readOnlyCannotSign')} />);
  }

  // tx to submit
  const getTx = () => {
    const tx = null;
    if (!reserveValid || !api || !activeAccount) {
      return tx;
    }

    // tx = api.tx.nominationPools.unbond(activeAccount, bondAsString);
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: reserveValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  return (
    <>
      <PaddingWrapper>
        <Title title="Update Reserve" />
        {warnings.length ? (
          <div>
            {warnings.map((warning, index) => (
              <React.Fragment key={`warning_${index}`}>
                {warning}
              </React.Fragment>
            ))}
          </div>
        ) : null}
        <SliderWrapper>
          <input
            className="slider"
            type="range"
            min="1"
            max="100"
            value={reserve}
            onChange={updateReserve}
          />
          <p>Reserve: {reserve}</p>
        </SliderWrapper>
      </PaddingWrapper>
      <SubmitTx valid={reserveValid} {...submitExtrinsic} />
    </>
  );
};
