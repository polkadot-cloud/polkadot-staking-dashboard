// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { GenerateNominations } from './GenerateNominations';

export const ChooseNominators = () => {

  return (
    <>
      <h2>
        Nominate
        <OpenAssistantIcon page="stake" title="Nominating" />
      </h2>
      <GenerateNominations />
    </>
  )
}

export default ChooseNominators;