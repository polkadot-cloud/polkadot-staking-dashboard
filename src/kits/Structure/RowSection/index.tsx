// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { appendOr, appendOrEmpty } from '@w3ux/utils';
import type { ComponentBase } from 'types';
import { RowPrimaryWrapper, RowSecondaryWrapper } from './Wrappers';

export type RowSectionProps = ComponentBase & {
  // the css order of the component for vertical layouts.
  vLast?: boolean;
  // true means padding on the left and false means padding on the right.
  hLast?: boolean;
  // true means the secondary element and  false means the primary one.
  secondary?: boolean;
};

/**
 * @name RowSection
 * @summary The primary/secondary module in a PageRow.
 */
export const RowSection = ({
  children,
  style,
  vLast,
  hLast,
  secondary,
}: RowSectionProps) => {
  const Wrapper = secondary ? RowSecondaryWrapper : RowPrimaryWrapper;

  return (
    <Wrapper
      className={`${appendOrEmpty(vLast, 'v-last')}${appendOr(hLast, 'first', 'last')}`}
      style={style}
    >
      {children}
    </Wrapper>
  );
};
