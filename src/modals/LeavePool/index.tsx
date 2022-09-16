// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { UnbondAll } from 'modals/UpdateBond/Forms/UnbondAll';
import { Title } from 'library/Modal/Title';
import { PaddingWrapper } from '../Wrappers';

export const LeavePool = () => {
  return (
    <>
      <Title title="Leave Pool" icon={faSignOutAlt} />
      <PaddingWrapper>
        <UnbondAll />
      </PaddingWrapper>
    </>
  );
};
