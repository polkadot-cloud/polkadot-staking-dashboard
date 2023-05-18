// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { ContentWrapper } from '../Wrappers';
import { Commission } from './Commission';
import { SetMetadata } from './SetMetadata';
import { SetState } from './SetState';

export const Forms = forwardRef(
  ({ setSection, task, section }: any, ref: any) => {
    return (
      <>
        <ContentWrapper>
          <div className="items" ref={ref}>
            {task === 'set_pool_metadata' ? (
              <SetMetadata setSection={setSection} section={section} />
            ) : task === 'manage_commission' ? (
              <Commission setSection={setSection} section={section} />
            ) : (
              <SetState setSection={setSection} task={task} />
            )}
          </div>
        </ContentWrapper>
      </>
    );
  }
);
