// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { UnbondAll } from 'modals/UpdateBond/Forms/UnbondAll';
import { HeadingWrapper, PaddingWrapper } from '../Wrappers';

export const LeavePool = () => {
  return (
    <PaddingWrapper>
      <HeadingWrapper noPadding>
        <FontAwesomeIcon transform="grow-2" icon={faSignOutAlt} />
        Leave Pool
      </HeadingWrapper>
      <UnbondAll />
    </PaddingWrapper>
  );
};
