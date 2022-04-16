// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from "./Wrapper";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export const StatusButton = (props: any) => {

  const { checked, label, onClick } = props;

  return (
    <Wrapper onClick={() => {
      if (onClick !== undefined) {
        onClick();
      }
    }}>
      <section className={checked ? 'checked' : undefined}>
        <FontAwesomeIcon icon={checked ? faCheck : faCircle} />
      </section>
      <section>{label}</section>
    </Wrapper>
  )
}

export default StatusButton;