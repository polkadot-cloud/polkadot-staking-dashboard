// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Wrapper } from './Wrapper';

export const Warning = (props: any) => {
  const { text } = props;

  return (
    <Wrapper>
      <FontAwesomeIcon icon={faExclamationTriangle} transform="shrink-2" className='icon' />
      <h4>{text}</h4>
    </Wrapper>
  )
}