// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHelp } from '@polkadot-cloud/react';
import { useHelp } from 'contexts/Help';
import { usePlugins } from 'contexts/Plugins';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { Wrapper } from './Wrapper';
import type { StatusLabelProps } from './types';

export const StatusLabel = ({
  title,
  helpKey,
  hideIcon,
  statusFor,
  topOffset = '40%',
  status = 'sync_or_setup',
}: StatusLabelProps) => {
  const { isSyncing } = useUi();
  const { plugins } = usePlugins();
  const { inSetup } = useStaking();
  const { membership } = usePoolMemberships();
  const { openHelp } = useHelp();

  // syncing or not staking
  if (status === 'sync_or_setup') {
    if (isSyncing || !inSetup() || membership !== null) {
      return <></>;
    }
  }

  if (status === 'active_service' && statusFor)
    if (plugins.includes(statusFor)) {
      return <></>;
    }

  return (
    <Wrapper $topOffset={topOffset}>
      <div>
        {hideIcon !== true && <FontAwesomeIcon icon={faExclamationTriangle} />}
        <h2>
          &nbsp;&nbsp;
          {title}
          {helpKey ? (
            <span>
              <ButtonHelp
                marginLeft
                onClick={() => openHelp(helpKey)}
                background="secondary"
              />
            </span>
          ) : null}
        </h2>
      </div>
    </Wrapper>
  );
};
