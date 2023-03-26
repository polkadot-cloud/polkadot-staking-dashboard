// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Identicon as IdenticonDefault } from '@polkadot/react-identicon';
import { useApi } from 'contexts/Api';
import styled from 'styled-components';
import type { IdenticonProps } from './types';

const Wrapper = styled.div`
  svg > circle:first-child {
    fill: var(--border-primary-color);
  }
`;
export const Identicon = ({ value, size }: IdenticonProps) => {
  const { ss58 } = useApi().network;
  return (
    <Wrapper>
      <IdenticonDefault
        value={value}
        size={size}
        theme="polkadot"
        style={{ cursor: 'default' }}
        prefix={ss58}
      />
    </Wrapper>
  );
};
