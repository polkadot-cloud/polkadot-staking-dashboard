// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { Spacer } from './Wrappers';
import { Header } from './Header';
import { Footer } from './Footer';
import { MotionContainer } from './MotionContainer';

export const Payee = (props: any) => {

  // functional props
  const { setup, setSetup, activeSection, setActiveSection } = props;

  // staked, stash, controller, account, none

  const thisSection = 3;

  return (
    <SectionWrapper transparent>
      <Header
        thisSection={thisSection}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        complete={setup.payee !== null}
        title='Reward Destination'
        assistantPage='stake'
        assistantKey='Reward Destination'
      />
      <MotionContainer
        thisSection={thisSection}
        activeSection={activeSection}
      >
        <Spacer />
        <Footer
          complete={setup.payee !== null}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </MotionContainer>

    </SectionWrapper>
  )
}

export default Payee;