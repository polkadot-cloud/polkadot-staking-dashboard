// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from "./Wrapper";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';

export const StatusButton = (props: any) => {

  const { checked, label, onClick } = props;

  const color = checked ? 'rgba(211, 48, 121, 0.85)' : '#ccc';

  return (
    <Wrapper onClick={() => {
      if (onClick !== undefined) {
        onClick();
      }
    }}>
      <section>
        <FontAwesomeIcon color={color} transform='grow-1' icon={checked ? faCheckCircle : faCircle} />
      </section>
      <section>{label}</section>
    </Wrapper>
  )
}

export default StatusButton;