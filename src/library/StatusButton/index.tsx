// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Wrapper } from './Wrapper';

export const StatusButton = (props: any) => {
  const { checked, label, onClick } = props;

  return (
    <Wrapper
      onClick={() => {
        if (onClick !== undefined) {
          onClick();
        }
      }}
    >
      <section className={checked ? 'checked' : undefined}>
        <FontAwesomeIcon
          icon={checked ? (faCheck as IconProp) : (faCircle as IconProp)}
          transform="shrink-3"
        />
      </section>
      <section>{label}</section>
    </Wrapper>
  );
};

export default StatusButton;
