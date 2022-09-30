// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from 'contexts/Modal';
import { ReactComponent as CrossSVG } from 'img/cross.svg';
import { TitleWrapper } from './Wrappers';

interface TitleProps {
  title: string;
  icon?: IconProp;
  fixed?: boolean;
}

export const Title = ({ title, icon, fixed }: TitleProps) => {
  const { setStatus } = useModal();

  return (
    <TitleWrapper fixed={fixed || false}>
      <div>
        {icon && <FontAwesomeIcon transform="grow-3" icon={icon} />}
        <h2>{title}</h2>
      </div>
      <div>
        <button type="button" onClick={() => setStatus(2)}>
          <CrossSVG style={{ width: '1.4rem', height: '1.4rem' }} />
        </button>
      </div>
    </TitleWrapper>
  );
};
