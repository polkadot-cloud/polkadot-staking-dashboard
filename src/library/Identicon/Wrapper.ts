// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.div<{
  $disableCursorCopy?: boolean;
  $disableClipboardCopy?: boolean;
}>`
  svg > circle:first-child {
    fill: var(--border-primary-color);
  }

  .copy {
    cursor: ${(props) =>
      !(props.$disableCursorCopy || props.$disableClipboardCopy)
        ? 'copy'
        : 'default'};
  }
`;
