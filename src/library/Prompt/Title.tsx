// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHelp, ButtonSecondary } from '@polkadot-cloud/react';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { usePrompt } from 'contexts/Prompt';
import { TitleWrapper } from './Wrappers';

interface TitleProps {
  title: string;
  icon?: IconProp;
  Svg?: FunctionComponent<any>;
  helpKey?: string;
  hideDone?: boolean;
  closeText?: string;
}

export const Title = ({
  helpKey,
  title,
  icon,
  Svg,
  hideDone,
  closeText,
}: TitleProps) => {
  const { t } = useTranslation('library');
  const { closePrompt } = usePrompt();
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
          <ButtonSecondary
            text={closeText || t('done')}
            onClick={() => closePrompt()}
          />
        </div>
      ) : null}
    </TitleWrapper>
  );
};
