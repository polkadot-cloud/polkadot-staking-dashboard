// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Wrapper } from './Wrapper';
import { WarningProps } from '../types';

export const Warning = (props: WarningProps) => {
  const { text } = props;

  return (
    <Wrapper>
      <h4>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          transform="shrink-2"
          className="icon"
        />
        {text}
      </h4>
    </Wrapper>
  );
};
