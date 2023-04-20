// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHelp, ButtonPrimaryInvert } from '@polkadotcloud/core-ui';
import { useHelp } from 'contexts/Help';
import { useOverlay } from 'contexts/Overlay';
import type { FunctionComponent } from 'react';
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
  const { t } = useTranslation('library');
  const { closeOverlay } = useOverlay();
  const { openHelp } = useHelp();

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
          {helpKey ? <ButtonHelp onClick={() => openHelp(helpKey)} /> : null}
        </h2>
      </div>
      {hideDone !== true ? (
        <div>
          <ButtonPrimaryInvert
            text={t('done')}
            onClick={() => closeOverlay()}
          />
        </div>
      ) : null}
    </TitleWrapper>
  );
};
