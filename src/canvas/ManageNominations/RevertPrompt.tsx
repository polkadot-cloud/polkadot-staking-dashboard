import { ButtonPrimary } from '@polkadot-cloud/react';
import { Title } from 'library/Prompt/Title';
import { useTranslation } from 'react-i18next';

export const RevertPrompt = ({ onRevert }: { onRevert: () => void }) => {
  const { t } = useTranslation('modals');

  return (
    <>
      <Title title={t('revertNominations')} closeText={t('cancel')} />
      <div className="body">
        <h4 className="definition">{t('revertNominationChanges')}</h4>
        <div
          style={{
            marginTop: '0.75rem',
            marginBottom: '0.5rem',
            display: 'flex',
          }}
        >
          <ButtonPrimary
            marginRight
            text={t('revertChanges')}
            onClick={() => onRevert()}
          />
        </div>
      </div>
    </>
  );
};
