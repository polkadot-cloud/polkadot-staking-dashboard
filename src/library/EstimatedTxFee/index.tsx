// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { useApi } from 'contexts/Api';
import { useTxFees, TxFeesContext, EstimatedFeeContext } from 'contexts/TxFees';
import { humanNumber, planckBnToUnit } from 'Utils';
import { EstimatedTxFeeProps } from './types';

export const EstimatedTxFeeInner = ({ format }: EstimatedTxFeeProps) => {
  const {
    network: { unit, units },
  } = useApi();
  const { txFees, resetTxFees } = useTxFees();

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
          <div>Estimated Tx Fee:</div>
          <div>{txFees.isZero() ? '...' : `${txFeesBase} ${unit}`}</div>
        </>
      ) : (
        <p>
          Estimated Tx Fee: {txFees.isZero() ? '...' : `${txFeesBase} ${unit}`}
        </p>
      )}
    </>
  );
};

export class EstimatedTxFee extends React.Component<EstimatedTxFeeProps> {
  static contextType = TxFeesContext;

  componentDidMount(): void {
    const { resetTxFees } = this.context as EstimatedFeeContext;
    resetTxFees();
  }

  componentWillUnmount(): void {
    const { resetTxFees }: any = this.context;
    resetTxFees();
  }

  render() {
    return <EstimatedTxFeeInner {...this.props} />;
  }
}
