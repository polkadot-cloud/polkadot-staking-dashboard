// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from 'contexts/Modal';
import { ReactComponent as CrossSVG } from 'img/cross.svg';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { FunctionComponent } from 'react';
import { TitleWrapper } from './Wrappers';

interface TitleProps {
  title: string;
  icon?: IconProp;
  Svg?: FunctionComponent<any>;
  fixed?: boolean;
  helpKey?: string;
}

export const Title = ({ helpKey, title, icon, fixed, Svg }: TitleProps) => {
  const { setStatus } = useModal();

  const graphic = Svg ? (
    <Svg style={{ width: '1.6rem', height: '1.6rem' }} />
  ) : icon ? (
    <FontAwesomeIcon transform="grow-3" icon={icon} />
  ) : null;

  return (
    <TitleWrapper fixed={fixed || false}>
      <div>
        {graphic}
        <h2>
          {title}
          {helpKey && <OpenHelpIcon helpKey={helpKey} />}
        </h2>
      </div>
      <div>
        <button type="button" onClick={() => setStatus(2)}>
          <CrossSVG style={{ width: '1.4rem', height: '1.4rem' }} />
        </button>
      </div>
    </TitleWrapper>
  );
};
