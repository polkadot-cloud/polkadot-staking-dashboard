// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useList } from 'library/List/context';
import { Select } from 'library/ListItem/Labels/Select';
import { Wrapper, Labels, Separator } from 'library/ListItem/Wrappers';

export const Member = (props: any) => {
  const { member } = props;

  const { selectActive } = useList();

  return (
    <Wrapper format="nomination">
      <div className="inner">
        <div className="row">
          {selectActive && <Select validator={member} />}
          {/*
          <Identity
            validator={validator}
            batchIndex={batchIndex}
            batchKey={batchKey}
          />
          */}
          <div>
            <Labels>
              {/*
              <Oversubscribed
                batchIndex={batchIndex}
                batchKey={batchKey}
              />
              <Blocked prefs={prefs} />
              <Commission commission={commission} />
            */}
            </Labels>
          </div>
        </div>
        <Separator />
        <div className="row status">
          {/* <EraStatus address={address} />
          {inModal && (
            <>
              <Labels>
                <CopyAddress validator={member} />
              </Labels>
            </>
          )} */}
        </div>
      </div>
    </Wrapper>
  );
};
