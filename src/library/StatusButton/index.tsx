// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wrapper } from './Wrapper';
import type { StatusButtonProps } from './types';

export const StatusButton = ({
  checked,
  label,
  onClick,
}: StatusButtonProps) => (
  <Wrapper
    onClick={() => {
      if (onClick !== undefined) {
        onClick();
      }
    }}
  >
    <section className={checked ? 'checked' : undefined}>
      <FontAwesomeIcon
        icon={checked ? faCheck : faCircle}
        transform="shrink-3"
      />
    </section>
    <section>{label}</section>
  </Wrapper>
);
