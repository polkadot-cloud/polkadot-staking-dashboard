// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faArrowDown,
  faArrowRightFromBracket,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import BigNumber from 'bignumber.js';
import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { Spacer } from 'library/Form/Wrappers';
import { SelectItems } from 'library/SelectItems';
import { SelectItem } from 'library/SelectItems/Item';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SetupStepProps } from 'library/SetupSteps/types';
import { useEffect } from 'react';
import { AccountInput } from './AccountInput';

export const Payee = ({ section }: SetupStepProps) => {
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const setup = getSetupProgress('stake', activeAccount);

  const options = ['Staked', 'Stash', 'Account'];
  const buttons = [
    {
      index: 0,
      title: 'Compound',
      subtitle: 'Add payouts to your existing staked balance automatically.',
      icon: faRotate,
    },
    {
      index: 1,
      title: 'To Staking Account',
      subtitle: 'Payouts are sent to your account as free balance.',
      icon: faArrowDown,
    },
    {
      index: 2,
      title: 'To Another Account',
      subtitle: 'Send payouts to another account as free balance.',
      icon: faArrowRightFromBracket,
    },
  ];

  // set initial payee value to `Staked` if not yet set.

  useEffect(() => {
    if (!setup.payee) {
      setActiveAccountSetup('stake', {
        ...setup,
        payee: options[0],
      });
    }
  }, [activeAccount]);

  const handleChangePayee = (i: number) => {
    if (new BigNumber(i).isNaN() || i >= options.length) {
      return;
    }
    // set local value to update input element
    // set setup payee
    setActiveAccountSetup('stake', {
      ...setup,
      payee: options[i],
    });
  };

  return (
    <>
      <Header
        thisSection={section}
        complete={setup.payee !== null}
        title="Payout Destination"
        helpKey="Reward Destination"
        setupType="stake"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <h4 style={{ marginTop: '0.5rem' }}>
          Choose how payouts will be received. Payouts can either be compounded
          or sent to an account as free balance.
        </h4>

        <SelectItems>
          {buttons.map(({ index, title, subtitle, icon }: any, i: number) => (
            <SelectItem
              key={`payee_option_${i}`}
              selected={setup.payee === options[index]}
              title={title}
              subtitle={subtitle}
              icon={icon}
              onClick={() => handleChangePayee(index)}
            />
          ))}
        </SelectItems>
        <Spacer />
        <AccountInput />

        <Footer complete={setup.payee !== null} setupType="stake" />
      </MotionContainer>
    </>
  );
};
