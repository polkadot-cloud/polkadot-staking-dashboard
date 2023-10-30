import { ButtonPrimary } from '@polkadot-cloud/react';
import { Title } from 'library/Prompt/Title';
import { useTranslation } from 'react-i18next';
import { FooterWrapper } from 'library/Prompt/Wrappers';
import type { RevertPromptProps } from '../types';

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
