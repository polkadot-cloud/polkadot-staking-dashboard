// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { StatusLabelWrapper } from './Wrappers';
import { useStaking } from '../../contexts/Staking';

export const StatusLabel = (props: any) => {

  const { inSetup } = useStaking();

  if (!inSetup()) {
    return (<></>);
  }

  const topOffset = props.topOffset ?? '40%';

  return (
    <StatusLabelWrapper topOffset={topOffset}>
      <div>
        <h3>
          <FontAwesomeIcon icon={faExclamationTriangle} transform="grow-1" />&nbsp;
          Not Yet Staking
        </h3>
      </div>
    </StatusLabelWrapper>
  )
}

export default StatusLabel;