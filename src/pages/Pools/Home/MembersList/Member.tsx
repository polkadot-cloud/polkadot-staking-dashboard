// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useList } from 'library/List/context';
import { Identity } from 'library/ListItem/Labels/Identity';
import { Select } from 'library/ListItem/Labels/Select';
import { Wrapper, Labels, Separator } from 'library/ListItem/Wrappers';

export const Member = (props: any) => {
  const { meta } = usePoolMembers();
  const { selectActive } = useList();

  const { member, batchKey, batchIndex } = props;
  const { who } = member;

  return (
    <Wrapper format="nomination">
      <div className="inner">
        <div className="row">
          {selectActive && <Select item={member} />}
          <Identity
            meta={meta}
            address={who}
            batchIndex={batchIndex}
            batchKey={batchKey}
          />

          <div>
            <Labels>{/* TODO: Labels here */}</Labels>
          </div>
        </div>
        <Separator />
        <div className="row status">
          {/* TODO: Membership Status / Actions here */}
        </div>
      </div>
    </Wrapper>
  );
};
