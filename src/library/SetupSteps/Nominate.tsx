// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { useTranslation } from 'react-i18next';
import { GenerateNominations } from '../GenerateNominations';
import { NominationsProps } from './types';

export const Nominate = ({
  batchKey,
  setupType,
  section,
}: NominationsProps) => {
  const { t } = useTranslation('library');
  const { consts } = useApi();
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const setup = getSetupProgress(setupType, activeAccount);
  const progress = setup.setup;
  const { maxNominations } = consts;

  const setterFn = () => {
    return getSetupProgress(setupType, activeAccount).setup;
  };

  // handler for updating setup.bond
  const handleSetupUpdate = (value: any) => {
    setActiveAccountSetup(setupType, value);
  };

  return (
    <>
      <Header
        thisSection={section}
        complete={progress.nominations.length > 0}
        title={t('nominate') || ''}
        helpKey="Nominating"
        setupType={setupType}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <h4 style={{ marginTop: '0.5rem' }}>
          {t('chooseValidators', { maxNominations })}
        </h4>
        <GenerateNominations
          batchKey={batchKey}
          setters={[
            {
              current: {
                callable: true,
                fn: setterFn,
              },
              set: handleSetupUpdate,
            },
          ]}
          nominations={progress.nominations}
        />

        <Footer
          complete={progress.nominations.length > 0}
          setupType={setupType}
        />
      </MotionContainer>
    </>
  );
};
