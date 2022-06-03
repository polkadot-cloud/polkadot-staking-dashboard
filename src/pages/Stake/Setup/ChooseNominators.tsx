// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { ConnectContextInterface } from 'types/connect';
import { useApi } from 'contexts/Api';
import { APIContextInterface } from 'types/api';
import { GenerateNominations } from '../GenerateNominations';
import { Header } from './Header';
import { Footer } from './Footer';
import { MotionContainer } from './MotionContainer';

export const ChooseNominators = (props: any) => {
  const { consts } = useApi() as APIContextInterface;
  const { section } = props;
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const setup = getSetupProgress(activeAccount);
  const { maxNominations } = consts;

  return (
    <>
      <Header
        thisSection={section}
        complete={setup.nominations.length > 0}
        title="Nominate"
        assistantPage="stake"
        assistantKey="Nominating"
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
                set: setActiveAccountSetup,
                current: setup,
              },
            ]}
            nominations={setup.nominations}
            setSetup={setActiveAccountSetup}
          />
        </div>
        <Footer complete={setup.nominations.length > 0} />
      </MotionContainer>
    </>
  );
};

export default ChooseNominators;
