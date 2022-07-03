// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { useModal } from 'contexts/Modal';
import { PoolState } from 'contexts/Pools/types';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { HeadingWrapper, PaddingWrapper } from '../Wrappers';
import { Forms } from './Forms';

export const ChangePoolState = () => {
  const { config } = useModal();
  const { state } = config;

  let title;
  let icon;
  switch (state) {
    case PoolState.Open:
      title = 'Unlock Pool';
      icon = faUnlock;
      break;
    case PoolState.Block:
      title = 'Lock Pool';
      icon = faLock;
      break;
    default: {
      title = 'Destroy Pool';
      icon = faTimesCircle;
    }
  }
  return (
    <PaddingWrapper>
      <HeadingWrapper noPadding>
        <FontAwesomeIcon transform="grow-2" icon={icon as IconProp} />
        {title}
      </HeadingWrapper>
      <Forms />
    </PaddingWrapper>
  );
};
