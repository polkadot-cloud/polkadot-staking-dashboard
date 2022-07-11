// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Number } from 'library/StatBoxList/Number';
import { useApi } from 'contexts/Api';
// import {xistentialAmount } from 'contexts/Balances';

const ReserveAmountBox = () => {
  const { network } = useApi();

  const param = {
    label: 'Reserve Amount',
    value: 10,
    unit: network.unit,
    assistant: {
      page: 'pools',
      key: 'Reserve Amount',
    },
  };
  return <Number {...param} />;
};

export default ReserveAmountBox;
