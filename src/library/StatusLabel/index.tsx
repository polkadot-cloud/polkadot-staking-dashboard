// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useUi } from 'contexts/UI';
import { useStaking } from 'contexts/Staking';
import { StakingContextInterface } from 'types/staking';
import { Wrapper } from './Wrapper';

export const StatusLabel = (props: any) => {
  const status = props.status ?? 'sync_or_setup';
  const statusFor = props.statusFor ?? false;

  const { isSyncing, services } = useUi();
  const { inSetup } = useStaking() as StakingContextInterface;

  if (status === 'sync_or_setup') {
    if (isSyncing || !inSetup()) {
      return <></>;
    }
  }

  if (status === 'active_service') {
    if (services.includes(statusFor)) {
      return <></>;
    }
  }

  const { title } = props;
  const topOffset = props.topOffset ?? '40%';

  return (
    <Wrapper topOffset={topOffset}>
      <div>
        <h3>
          <FontAwesomeIcon icon={faExclamationTriangle} transform="grow-1" />
          &nbsp;
          {title}
        </h3>
      </div>
    </Wrapper>
  );
};

export default StatusLabel;
