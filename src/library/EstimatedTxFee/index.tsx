// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useTheme } from 'contexts/Themes';
import { EstimatedFeeContext, TxFeesContext, useTxFees } from 'contexts/TxFees';
import React, { Context, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultThemes } from 'theme/default';
import { humanNumber, planckBnToUnit } from 'Utils';
import { EstimatedTxFeeProps } from './types';
import { Wrapper } from './Wrapper';

export const EstimatedTxFeeInner = ({ format }: EstimatedTxFeeProps) => {
  const {
    network: { unit, units },
  } = useApi();
  const { mode } = useTheme();
  const { txFees, resetTxFees, notEnoughFunds } = useTxFees();
  const { t } = useTranslation('library');

  useEffect(() => {
    return () => {
      resetTxFees();
    };
  }, []);

  const txFeesBase = humanNumber(planckBnToUnit(txFees, units));

  return (
    <>
      {format === 'table' ? (
        <>
          <div>{t('estimatedFee')}:</div>
          <div>{txFees.isZero() ? '...' : `${txFeesBase} ${unit}`}</div>
        </>
      ) : (
        <Wrapper>
          <p>
            {t('estimatedFee')}:{' '}
            {txFees.isZero() ? '...' : `${txFeesBase} ${unit}`}
          </p>
          {notEnoughFunds === true && (
            <p style={{ color: defaultThemes.text.danger[mode] }}>
              {t('notEnoughFunds', { unit })}
            </p>
          )}
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
