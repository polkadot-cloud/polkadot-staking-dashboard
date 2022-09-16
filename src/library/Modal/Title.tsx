// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TitleWrapper } from './Wrappers';

interface TitleProps {
  title: string;
  icon?: IconProp;
  fixed?: boolean;
}

export const Title = ({ title, icon, fixed }: TitleProps) => {
  return (
    <TitleWrapper fixed={fixed || false}>
      {icon && <FontAwesomeIcon transform="grow-3" icon={icon} />}
      <h2>{title}</h2>
    </TitleWrapper>
  );
};
