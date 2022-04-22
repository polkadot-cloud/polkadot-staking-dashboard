// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { Spacer } from '../Wrappers';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MotionContainer } from '../MotionContainer';
import { Items, Item } from './Wrappers';
import { isNumeric } from '../../../Utils';

export const Payee = (props: any) => {

  // functional props
  const { setup, setSetup, activeSection, setActiveSection, section } = props;

  const options = ['stake', 'stash', 'controller'];
  const buttons = [
    {
      title: 'Back to Staking',
      subtitle: 'Payouts are automatically bonded to your existing bonded balance.',
      index: 0,
    }, {
      title: 'To Stash',
      subtitle: 'Payouts will be sent to your stash account as free balance.',
      index: 1,
    }, {
      title: 'To Controller',
      subtitle: 'Payouts will be sent to your controller account as free balance.',
      index: 2,
    },
  ];

  const [payee, setPayee]: any = useState(null);

  const handleChangePayee = (i: number) => {

    // not in options
    if (!isNumeric(i)) {
      return;
    }
    if (i >= options.length) {
      return;
    }

    // set local value to update input element
    setPayee(options[i]);
    // set setup payee
    setSetup({
      ...setup,
      payee: options[i],
    });
  }

  return (
    <SectionWrapper transparent>
      <Header
        thisSection={section}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        complete={setup.payee !== null}
        title='Reward Destination'
        assistantPage='stake'
        assistantKey='Reward Destination'
      />
      <MotionContainer
        thisSection={section}
        activeSection={activeSection}
      >
        <Spacer />
        <Items>
          {buttons.map((item: any, index: number) =>
            <Item
              key={`payee_option_${index}`}
              selected={payee === options[item.index]}
              onClick={() => handleChangePayee(item.index)}
            >
              <h3>{item.title}</h3>
              <div>
                <p>{item.subtitle}</p>
              </div>
            </Item>
          )}
        </Items>
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