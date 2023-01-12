// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonInvertRounded } from '@rossbulat/polkadot-dashboard-ui';
import { useOverlay } from 'contexts/Overlay';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleWrapper } from './Wrappers';

interface TitleProps {
  title: string;
  icon?: IconProp;
  Svg?: FunctionComponent<any>;
  helpKey?: string;
  hideDone?: boolean;
}

export const Title = ({ helpKey, title, icon, Svg, hideDone }: TitleProps) => {
  const { closeOverlay } = useOverlay();
  const { t } = useTranslation('library');

  const graphic = Svg ? (
    <Svg style={{ width: '1.5rem', height: '1.5rem' }} />
  ) : icon ? (
    <FontAwesomeIcon transform="grow-3" icon={icon} />
  ) : null;

  return (
    <TitleWrapper>
      <div>
        {graphic}
        <h2>
          {title}
          {helpKey && <OpenHelpIcon helpKey={helpKey} />}
        </h2>
      </div>
      {hideDone !== true ? (
        <div>
          <ButtonInvertRounded
            text={t('done')}
            onClick={() => closeOverlay()}
          />
        </div>
      ) : null}
    </TitleWrapper>
  );
};
