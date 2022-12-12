// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { useTranslation } from 'react-i18next';
import { GenerateNominations } from '../GenerateNominations';
import { NominationsProps } from './types';

export const Nominate = (props: NominationsProps) => {
  const { batchKey, setupType, section } = props;

  const { consts } = useApi();
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const setup = getSetupProgress(setupType, activeAccount);
  const { maxNominations } = consts;
  const { t } = useTranslation('library');

  const setterFn = () => {
    return getSetupProgress(setupType, activeAccount);
  };

  // handler for updating bond
  const handleSetupUpdate = (value: any) => {
    setActiveAccountSetup(setupType, value);
  };

  return (
    <>
      <Header
        thisSection={section}
        complete={setup.nominations.length > 0}
        title={t('nominate') || ''}
        helpKey="Nominating"
        setupType={setupType}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <div style={{ marginTop: '0.5rem' }}>
          <h4>{t('chooseValidators', { maxNominations })}</h4>
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
            nominations={setup.nominations}
          />
        </div>
        <Footer complete={setup.nominations.length > 0} setupType={setupType} />
      </MotionContainer>
    </>
  );
};
