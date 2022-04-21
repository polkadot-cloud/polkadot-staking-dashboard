// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { Button, ButtonRow } from '../../library/Button';
import { useBalances } from '../../contexts/Balances';
import { useConnect } from '../../contexts/Connect';
import { useMessages } from '../../contexts/Messages';
import { GLOBAL_MESSGE_KEYS } from '../../constants';
import { AccountSelect } from '../../library/Form/AccountSelect';
import { Header } from './Header';
import { Footer } from './Footer';
import { Spacer } from './Wrappers';
import { MotionContainer } from './MotionContainer';

export const SetController = (props: any) => {

  // functional props
  const { setup, setSetup, activeSection, setActiveSection } = props;

  const { activeAccount, accounts, getAccount } = useConnect();
  const { getBondedAccount }: any = useBalances();
  const { getMessage }: any = useMessages();
  const controller = getBondedAccount(activeAccount);
  const account = getAccount(controller);

  const [controllerNotImported, setControllerNotImported] = useState(getMessage(GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED));
  const [selected, setSelected] = useState(account);

  useEffect(() => {
    setControllerNotImported(getMessage(GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED));
  }, [getMessage(GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED)]);

  const handleOnChange = (selected: any) => {
    setSelected(selected);

    setSetup({
      ...setup,
      controller: selected?.address ?? null
    })
  }

  const thisSection = 1;

  return (
    <>
      {/* TODO: integrate this into the below section.
      warning: controller account not present. unable to stake */}
      {controllerNotImported !== null &&
        <SectionWrapper transparent style={{ border: '2px solid rgba(242, 185, 27,0.25)' }}>
          <h3>Import Your Controller Account</h3>
          <p>You have not imported your Controller account. If you have lost access to your Controller account, set a new Controller now.</p>

          <ButtonRow style={{ width: '100%', padding: 0, marginTop: '1rem' }}>
            <Button inline title='Set New Controller' />
          </ButtonRow>
        </SectionWrapper>
      }

      {/* controller management */}
      {controllerNotImported === null &&
        <SectionWrapper transparent>
          <Header
            thisSection={thisSection}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            title='Set Controller Account'
            assistantPage='stake'
            assistantKey='Stash and Controller Accounts'
            complete={setup.controller !== null}
          />
          <MotionContainer
            thisSection={thisSection}
            activeSection={activeSection}
          >
            <Spacer />
            <AccountSelect
              items={accounts.filter((acc: any) => acc.address !== activeAccount)}
              onChange={handleOnChange}
              placeholder='Search Account'
              value={selected}
            />
            <Footer
              complete={setup.controller !== null}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </MotionContainer>

        </SectionWrapper>
      }
    </>
  )
}

export default SetController;