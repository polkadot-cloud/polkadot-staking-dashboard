// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from 'contexts/Modal';
import { ValidatorList } from 'library/ValidatorList';
import { Title } from 'library/Modal/Title';
import { PaddingWrapper } from '../Wrappers';
import { ListWrapper } from './Wrappers';

export const PoolNominations = () => {
  const { config } = useModal();
  const { nominator, targets } = config;
  const batchKey = 'pool_nominations';

  return (
    <>
      <Title title="Pool Nominations" />
      <PaddingWrapper>
        <ListWrapper>
          {targets.length > 0 ? (
            <ValidatorList
              bondType="pool"
              validators={targets}
              nominator={nominator}
              batchKey={batchKey}
              title="Pool Nominations"
              showMenu={false}
              inModal
            />
          ) : (
            <h3>Pool is Not Nominating.</h3>
          )}
        </ListWrapper>
      </PaddingWrapper>
    </>
  );
};

export default PoolNominations;
