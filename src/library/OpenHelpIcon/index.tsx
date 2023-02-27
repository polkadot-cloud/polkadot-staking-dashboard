// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@rossbulat/polkadot-dashboard-ui';
import { useHelp } from 'contexts/Help';

export const OpenHelpIcon = ({
  helpKey,
  backgroundSecondary = false,
}: {
  helpKey: string;
  backgroundSecondary?: boolean;
}) => {
  const { openHelp } = useHelp();

  return (
    <ButtonHelp
      onClick={() => openHelp(helpKey)}
      backgroundSecondary={backgroundSecondary || false}
    />
  );
};
