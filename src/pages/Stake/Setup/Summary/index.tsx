// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionWrapper } from '../../../../library/Graphs/Wrappers';
import { Spacer } from '../../Wrappers';
import { Header } from '../Header';
import { MotionContainer } from '../MotionContainer';
import { useUi } from '../../../../contexts/UI';
import { useConnect } from '../../../../contexts/Connect';
import { Wrapper as ButtonWrapper } from '../../../../library/Button';

export const Summary = (props: any) => {

  const { section } = props;

  const { activeAccount } = useConnect();
  const { getSetupProgress } = useUi();
  const setup = getSetupProgress(activeAccount);

  return (
    <SectionWrapper transparent>
      <Header
        thisSection={section}
        complete={setup.payee !== null}
        title='Summary'
      />
      <MotionContainer
        thisSection={section}
        activeSection={setup.section}
      >
        <Spacer />
        <div style={{ flex: 1, width: '100%', display: 'flex' }}>
          <ButtonWrapper
            margin={'0'}
            padding={'0.75rem 1.2rem'}
          >
            Start Staking
          </ButtonWrapper>
        </div>
      </MotionContainer>
    </SectionWrapper>
  )
}

export default Summary;