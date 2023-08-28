// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { forwardRef } from 'react';
import { ContentWrapper } from '../Wrappers';
import { ClaimCommission } from './ClaimCommission';
import { Commission } from './Commission';
import { LeavePool } from './LeavePool';
import { SetClaimPermission } from './SetClaimPermission';
import { SetMetadata } from './SetMetadata';
import { SetState } from './SetState';

export const Forms = forwardRef(
  ({ setSection, task, section, incrementCalculateHeight }: any, ref: any) => {
    return (
      <>
        <ContentWrapper>
          <div className="items" ref={ref}>
            {task === 'set_pool_metadata' ? (
              <SetMetadata setSection={setSection} section={section} />
            ) : task === 'manage_commission' ? (
              <Commission
                setSection={setSection}
                section={section}
                incrementCalculateHeight={incrementCalculateHeight}
              />
            ) : task === 'set_claim_permission' ? (
              <SetClaimPermission setSection={setSection} section={section} />
            ) : task === 'leave_pool' ? (
              <LeavePool setSection={setSection} />
            ) : task === 'claim_commission' ? (
              <ClaimCommission setSection={setSection} />
            ) : (
              <SetState setSection={setSection} task={task} />
            )}
          </div>
        </ContentWrapper>
      </>
    );
  }
);
