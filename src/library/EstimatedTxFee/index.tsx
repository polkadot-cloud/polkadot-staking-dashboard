// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToUnit } from '@polkadotcloud/utils';
import type { Context } from 'react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { TxMetaContext, useTxMeta } from 'contexts/TxMeta';
import type { TxMetaContextInterface } from 'contexts/TxMeta/types';
import { Wrapper } from './Wrapper';
import type { EstimatedTxFeeProps } from './types';

export const EstimatedTxFeeInner = ({ format }: EstimatedTxFeeProps) => {
  const { t } = useTranslation('library');
  const { unit, units } = useApi().network;
  const { txFees, resetTxFees } = useTxMeta();

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
  static contextType: Context<TxMetaContextInterface> = TxMetaContext;

  componentDidMount(): void {
    const { resetTxFees } = this.context as TxMetaContextInterface;
    resetTxFees();
  }

  componentWillUnmount(): void {
    const { resetTxFees } = this.context as TxMetaContextInterface;
    resetTxFees();
  }

  render() {
    return <EstimatedTxFeeInner {...this.props} />;
  }
}
