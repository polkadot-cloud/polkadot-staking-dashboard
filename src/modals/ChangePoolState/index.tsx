// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useModal } from 'contexts/Modal';
import { PoolState } from 'contexts/Pools';
import { HeadingWrapper, PaddingWrapper } from '../Wrappers';
import { Forms } from './Forms';

export const ChangePoolState = () => {
  const { config } = useModal();
  const { state } = config;
  return (
    <PaddingWrapper>
      <HeadingWrapper noPadding>
        <FontAwesomeIcon transform="grow-2" icon={faPlus} />
        {state === PoolState.Open && 'Unlock Pool'}
        {state === PoolState.Block && 'Lock Pool'}
        {state === PoolState.Destroy && 'Destroy Pool'}
      </HeadingWrapper>
      <Forms />
    </PaddingWrapper>
  );
};
