// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { GenerateNominations } from './GenerateNominations';
import { Header } from './Header';
import { Footer } from './Footer';
import { MotionContainer } from './MotionContainer';

export const ChooseNominators = (props: any) => {

  // functional props
  const { setup, setSetup, activeSection, setActiveSection, section } = props;

  return (
    <>
      <Header
        thisSection={section}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        complete={setup.nominations.length > 0}
        title='Nominate'
        assistantPage='stake'
        assistantKey='Nominating'
      />
      <MotionContainer
        thisSection={section}
        activeSection={activeSection}
      >
        <GenerateNominations />
        <Footer
          complete={setup.nominations.length > 0}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </MotionContainer>
    </>
  )
}

export default ChooseNominators;