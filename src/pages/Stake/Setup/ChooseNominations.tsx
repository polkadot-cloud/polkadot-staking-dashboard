// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { useApi } from 'contexts/Api';
import { SetupType } from 'contexts/UI/types';
import { Header } from 'library/SetupSteps/Header';
import { Footer } from 'library/SetupSteps/Footer';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { GenerateNominations } from '../GenerateNominations';
import { ChooseNominationsProps } from '../types';

export const ChooseNominations = (props: ChooseNominationsProps) => {
  const { consts } = useApi();
  const { section } = props;
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const setup = getSetupProgress(SetupType.Stake, activeAccount);
  const { maxNominations } = consts;

  const setterFn = () => {
    return getSetupProgress(SetupType.Stake, activeAccount);
  };

  // handler for updating bond
  const handleSetupUpdate = (value: any) => {
    setActiveAccountSetup(SetupType.Stake, value);
  };

  return (
    <>
      <Header
        thisSection={section}
        complete={setup.nominations.length > 0}
        title="Nominate"
        assistantPage="stake"
        assistantKey="Nominating"
        setupType={SetupType.Stake}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <div style={{ marginTop: '0.5rem' }}>
          <h4>
            Choose up to {maxNominations} validators to nominate. Generate your
            nominations automatically or add a selection from your favourites.
          </h4>
          <GenerateNominations
            batchKey="generate_nominations_inactive"
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
        <Footer
          complete={setup.nominations.length > 0}
          setupType={SetupType.Stake}
        />
      </MotionContainer>
    </>
  );
};
