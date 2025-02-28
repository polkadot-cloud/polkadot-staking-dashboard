// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import { ContentWrapper } from '../Wrappers';
import { ClaimCommission } from './ClaimCommission';
import { ManageCommission } from './ManageCommission';
import { LeavePool } from './LeavePool';
import { SetClaimPermission } from './SetClaimPermission';
import { RenamePool } from './RenamePool';
import { SetPoolState } from './SetPoolState';
import { PoolCommissionProvider } from './ManageCommission/provider';
import type { FormsProps } from './types';

export const Forms = forwardRef(
  (
    { setSection, task, section, incrementCalculateHeight }: FormsProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => (
    <PoolCommissionProvider>
      <ContentWrapper>
        <div className="items" ref={ref}>
          {task === 'set_pool_metadata' ? (
            <RenamePool setSection={setSection} section={section} />
          ) : task === 'manage_commission' ? (
            <ManageCommission
              setSection={setSection}
              incrementCalculateHeight={incrementCalculateHeight}
            />
          ) : task === 'set_claim_permission' ? (
            <SetClaimPermission setSection={setSection} section={section} />
          ) : task === 'leave_pool' ? (
            <LeavePool setSection={setSection} />
          ) : task === 'claim_commission' ? (
            <ClaimCommission setSection={setSection} />
          ) : (
            <SetPoolState setSection={setSection} task={task} />
          )}
        </div>
      </ContentWrapper>
    </PoolCommissionProvider>
  )
);

Forms.displayName = 'Forms';
