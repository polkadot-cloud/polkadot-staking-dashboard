// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useNetwork } from 'contexts/Network';
import { TxMetaContext, useTxMeta } from 'contexts/TxMeta';
import type { TxMetaContextInterface } from 'contexts/TxMeta/types';
import type { Context } from 'react';
import { Component, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { planckToUnitBn } from 'utils';
import { Wrapper } from './Wrapper';
import type { EstimatedTxFeeProps } from './types';

export const EstimatedTxFeeInner = ({ format }: EstimatedTxFeeProps) => {
  const { t } = useTranslation('library');
  const { unit, units } = useNetwork().networkData;
  const { txFees, resetTxFees } = useTxMeta();

  useEffect(() => () => resetTxFees(), []);

  const txFeesUnit = planckToUnitBn(
    new BigNumber(txFees.toString()),
    units
  ).toFormat();

  return format === 'table' ? (
    <>
      <div>{t('estimatedFee')}:</div>
      <div>{txFees === 0n ? `...` : `${txFeesUnit} ${unit}`}</div>
    </>
  ) : (
    <Wrapper>
      <p>
        <span>{t('estimatedFee')}:</span>
        {txFees === 0n ? `...` : `${txFeesUnit} ${unit}`}
      </p>
    </Wrapper>
  );
};

export class EstimatedTxFee extends Component<EstimatedTxFeeProps> {
  static contextType: Context<TxMetaContextInterface> = TxMetaContext;

  componentWillUnmount(): void {
    const { resetTxFees } = this.context as TxMetaContextInterface;
    resetTxFees();
  }

  render() {
    return <EstimatedTxFeeInner {...this.props} />;
  }
}
