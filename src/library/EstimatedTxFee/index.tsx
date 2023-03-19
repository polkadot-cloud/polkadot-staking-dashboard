// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToUnit } from 'Utils';
import { useApi } from 'contexts/Api';
import { TxFeesContext, useTxFees } from 'contexts/TxFees';
import type { EstimatedFeeContext } from 'contexts/TxFees/types';
import type { Context } from 'react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wrapper } from './Wrapper';
import type { EstimatedTxFeeProps } from './types';

export const EstimatedTxFeeInner = ({ format }: EstimatedTxFeeProps) => {
  const { t } = useTranslation('library');
  const { unit, units } = useApi().network;
  const { txFees, resetTxFees } = useTxFees();

  useEffect(() => () => resetTxFees(), []);

  const txFeesUnit = planckToUnit(txFees, units).toFormat();

  return (
    <>
      {format === 'table' ? (
        <>
          <div>{t('estimatedFee')}:</div>
          <div>{txFees.isZero() ? `...` : `${txFeesUnit} ${unit}`}</div>
        </>
      ) : (
        <Wrapper>
          <p>
            <span>{t('estimatedFee')}:</span>
            {txFees.isZero() ? `...` : `${txFeesUnit} ${unit}`}
          </p>
        </Wrapper>
      )}
    </>
  );
};

export class EstimatedTxFee extends React.Component<EstimatedTxFeeProps> {
  static contextType: Context<EstimatedFeeContext> = TxFeesContext;

  componentDidMount(): void {
    const { resetTxFees } = this.context as EstimatedFeeContext;
    resetTxFees();
  }

  componentWillUnmount(): void {
    const { resetTxFees } = this.context as EstimatedFeeContext;
    resetTxFees();
  }

  render() {
    return <EstimatedTxFeeInner {...this.props} />;
  }
}
