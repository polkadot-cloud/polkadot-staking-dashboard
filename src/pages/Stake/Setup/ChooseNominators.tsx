// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { GenerateNominations } from './GenerateNominations';
import { Header } from './Header';
import { Footer } from './Footer';
import { MotionContainer } from './MotionContainer';
import { useConnect } from '../../../contexts/Connect';
import { useUi } from '../../../contexts/UI';

export const ChooseNominators = (props: any) => {
  const { section } = props;
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const setup = getSetupProgress(activeAccount);

  return (
    <>
      <Header
        thisSection={section}
        complete={setup.nominations.length > 0}
        title='Nominate'
        assistantPage='stake'
        assistantKey='Nominating'
      />
      <MotionContainer
        thisSection={section}
        activeSection={setup.section}
      >
        <GenerateNominations
          setters={[
            {
              set: setActiveAccountSetup,
              current: setup
            },
          ]}
          nominations={setup.nominations}
          setSetup={setActiveAccountSetup}
        />
        <Footer complete={setup.nominations.length > 0} />
      </MotionContainer>
    </>
  )
}

export default ChooseNominators;