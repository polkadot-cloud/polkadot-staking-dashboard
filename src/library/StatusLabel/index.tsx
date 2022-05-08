// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Wrapper } from './Wrapper';
import { useUi } from '../../contexts/UI';
import { useStaking } from '../../contexts/Staking';

export const StatusLabel = (props: any) => {

  const { isSyncing } = useUi();
  const { inSetup } = useStaking();

  if (isSyncing() || !inSetup()) {
    return (<></>);
  }

  const { title } = props;
  const topOffset = props.topOffset ?? '40%';

  return (
    <Wrapper topOffset={topOffset}>
      <div>
        <h3>
          <FontAwesomeIcon icon={faExclamationTriangle} transform="grow-1" />&nbsp;
          {title}
        </h3>
      </div>
    </Wrapper>
  )
}

export default StatusLabel;