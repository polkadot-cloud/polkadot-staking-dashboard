// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Default } from './Default';
import { Nomination } from './Nomination';

export const ValidatorInner = (props: any) => {
  const { format } = props;

  return format === 'nomination' ? (
    <Nomination {...props} />
  ) : (
    <Default {...props} />
  );
};

export class Validator extends React.Component<any, any> {
  shouldComponentUpdate(nextProps: any) {
    return (
      this.props.validator.address !== nextProps.validator.address ||
      this.props.batchIndex !== nextProps.batchIndex ||
      this.props.batchKey !== nextProps.batchKey
    );
  }

  render() {
    return <ValidatorInner {...this.props} />;
  }
}

export default Validator;
