// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionWrapper } from './Wrappers';

export const Action = ({ text }: { text: string }) => (
  <ActionWrapper>
    <FontAwesomeIcon icon={faChevronRight} transform="shrink-7" />
    {text}
  </ActionWrapper>
);
