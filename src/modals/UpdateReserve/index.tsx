// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ButtonPrimaryInvert,
  ModalPadding,
  ModalWarnings,
} from '@polkadotcloud/core-ui';
// import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
// import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { Warning } from 'library/Form/Warning';
// import { PaddingWrapper, WarningsWrapper } from 'modals/Wrappers';
import { useTransferOptions } from 'contexts/TransferOptions';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmButton } from './Wrapper';

export const UpdateReserve = () => {
  const { t } = useTranslation('modals');
  const { reserve } = useTransferOptions();
  //   const { units } = useApi().network;
  const { activeAccount, accountHasSigner } = useConnect();
  //   const { getLocks, getBalance } = useBalances();
  //   const balance = getBalance(activeAccount);
  const { network } = useApi();
  const { setStatus } = useModal();

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(<Warning text={t('readOnlyCannotSign')} />);
  }

  const sliderProps = {
    trackStyle: {
      backgroundColor: 'var(--network-color-primary)',
    },
    handleStyle: {
      backgroundColor: 'var(--background-primary)',
      borderColor: 'var(--network-color-primary)',
      opacity: 1,
    },
  };

  return (
    <ModalPadding>
      <h2 className="title unbounded">Update Reserve</h2>
      {warnings.length ? (
        <ModalWarnings>
          {warnings.map((warning, index) => (
            <React.Fragment key={`warning_${index}`}>{warning}</React.Fragment>
          ))}
        </ModalWarnings>
      ) : null}
      {reserve.toString()}
      <Slider
        value={100}
        step={0.1}
        onChange={(val) => {
          if (typeof val === 'number') {
            console.log();
          }
        }}
        {...sliderProps}
      />

      <ConfirmButton>
        <ButtonPrimaryInvert
          text={t('confirm')}
          onClick={() => {
            setStatus(0);
            localStorage.setItem(
              `${network.name}_${activeAccount}_reserve`,
              reserve.toString()
            );
          }}
          disabled={!accountHasSigner(activeAccount)}
        />
      </ConfirmButton>
    </ModalPadding>
  );
};
