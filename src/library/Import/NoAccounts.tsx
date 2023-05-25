// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NoAccountsWrapper } from './Wrappers';

export const NoAccounts = ({ children, text, Icon }: any) => {
  return (
    <NoAccountsWrapper>
      <Icon className="icon" />
      <h3>{text}</h3>
      {children}
    </NoAccountsWrapper>
  );
};
