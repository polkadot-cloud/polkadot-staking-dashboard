// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Title } from 'library/Prompt/Title';
import { useTranslation } from 'react-i18next';
import { FooterWrapper } from 'library/Prompt/Wrappers';
import type { RevertPromptProps } from '../types';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';

export const RevertPrompt = ({ onRevert }: RevertPromptProps) => {
  const { t } = useTranslation('modals');

  return (
    <>
      <Title title={t('revertNominations')} closeText={t('cancel')} />
      <div className="body">
        <h4 className="subheading">{t('revertNominationChanges')}</h4>
        <FooterWrapper>
          <ButtonPrimary
            marginRight
            text={t('revertChanges')}
            onClick={() => onRevert()}
          />
        </FooterWrapper>
      </div>
    </>
  );
};
