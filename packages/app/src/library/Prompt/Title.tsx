// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FunctionComponent, SVGProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { usePrompt } from 'contexts/Prompt';
import { TitleWrapper } from './Wrappers';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { ButtonSecondary } from 'kits/Buttons/ButtonSecondary';

interface TitleProps {
  title: string;
  icon?: IconProp;
  Svg?: FunctionComponent<SVGProps<SVGElement>>;
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
