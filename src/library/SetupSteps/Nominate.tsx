// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useSetup } from 'contexts/Setup';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Subheading } from 'pages/Nominate/Wrappers';
import { GenerateNominations } from '../GenerateNominations';
import type { NominationsProps } from './types';

export const Nominate = ({ bondFor, section }: NominationsProps) => {
  const { t } = useTranslation('library');
  const { consts } = useApi();
  const { activeAccount } = useActiveAccounts();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const setup = getSetupProgress(bondFor, activeAccount);
  const { progress } = setup;
  const { maxNominations } = consts;

  // Handler for updating setup.
  const handleSetupUpdate = (value: any) =>
    setActiveAccountSetup(bondFor, value);

  return (
    <>
      <Header
        thisSection={section}
        complete={progress.nominations.length > 0}
        title={t('nominate')}
        helpKey="Nominating"
        bondFor={bondFor}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <Subheading>
          <h4>
            {t('chooseValidators', {
              maxNominations: maxNominations.toString(),
            })}
          </h4>
        </Subheading>
        <GenerateNominations
          setters={[
            {
              current: {
                callable: true,
                fn: () => getSetupProgress(bondFor, activeAccount).progress,
              },
              set: handleSetupUpdate,
            },
          ]}
          nominations={progress.nominations}
        />

        <Footer complete={progress.nominations.length > 0} bondFor={bondFor} />
      </MotionContainer>
    </>
  );
};
