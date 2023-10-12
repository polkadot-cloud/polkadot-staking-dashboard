// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { Default } from './Default';
import { Nomination } from './Nomination';
import type { ValidatorItemProps } from './types';

export const ValidatorInner = (props: ValidatorItemProps) => {
  const { format } = props;

  return format === 'nomination' ? (
    <Nomination {...props} />
  ) : (
    <Default {...props} />
  );
};

export class Validator extends React.Component<ValidatorItemProps> {
  shouldComponentUpdate(nextProps: ValidatorItemProps) {
    return this.props.validator.address !== nextProps.validator.address;
  }

  render() {
    return <ValidatorInner {...this.props} />;
  }
}
