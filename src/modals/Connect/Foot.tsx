// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConnectItemFoot } from './Wrappers';

export const Foot = ({ url }: any) => (
  <ConnectItemFoot>
    <a href={`https://${url}`} target="_blank" rel="noreferrer">
      {url}
      <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-6" />
    </a>
  </ConnectItemFoot>
);
