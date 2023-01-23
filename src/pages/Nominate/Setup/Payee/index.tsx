// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faArrowRightToBracket,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import BigNumber from 'bignumber.js';
import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { SelectItem } from 'library/SelectItem';
import { SelectItemsWrapper } from 'library/SelectItem/Wrapper';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SetupStepProps } from 'library/SetupSteps/types';
import { useTranslation } from 'react-i18next';
import { Spacer } from '../../Wrappers';

export const Payee = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages');
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const setup = getSetupProgress('stake', activeAccount);

  const options = ['Staked', 'Stash', 'Controller'];
  const buttons = [
    {
      index: 0,
      title: t('nominate.backToStaking'),
      subtitle: 'Automatically bond payouts to your existing staked balance',
      icon: faRotate,
    },
    {
      index: 1,
      title: t('nominate.toStash'),
      subtitle: t('nominate.sentToStash'),
      icon: faArrowRightToBracket,
    },
    {
      index: 2,
      title: t('nominate.toController'),
      subtitle: t('nominate.sentToController'),
      icon: faArrowRightToBracket,
    },
  ];

  // set initial payee value to `Staked` if not yet set.
  if (!setup.payee) {
    setActiveAccountSetup('stake', {
      ...setup,
      payee: options[0],
    });
  }

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
        title={t('nominate.rewardDestination') || ''}
        helpKey="Reward Destination"
        setupType="stake"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <Spacer />
        <SelectItemsWrapper>
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
        </SelectItemsWrapper>
        <Footer complete={setup.payee !== null} setupType="stake" />
      </MotionContainer>
    </>
  );
};
