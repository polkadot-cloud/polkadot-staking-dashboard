// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { SetupType } from 'contexts/Setup/types';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SetupStepProps } from 'library/SetupSteps/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isNumeric } from 'Utils';
import { Spacer } from '../../Wrappers';
import { Item, Items } from './Wrappers';

export const Payee = (props: SetupStepProps) => {
  const { section } = props;

  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const setup = getSetupProgress(SetupType.Stake, activeAccount);
  const { t } = useTranslation('pages');

  const options = ['Staked', 'Stash', 'Controller'];
  const buttons = [
    {
      title: t('nominate.backToStaking'),
      subtitle: t('nominate.automaticallyBonded'),
      index: 0,
    },
    {
      title: t('nominate.toStash'),
      subtitle: t('nominate.sentToStash'),
      index: 1,
    },
    {
      title: t('nominate.toController'),
      subtitle: t('nominate.sentToController'),
      index: 2,
    },
  ];

  const [payee, setPayee]: any = useState(setup.payee);

  // update selected value on account switch
  useEffect(() => {
    setPayee(setup.payee);
  }, [activeAccount]);

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
    setActiveAccountSetup(SetupType.Stake, {
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
        setupType={SetupType.Stake}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <Spacer />
        <Items>
          {buttons.map((item: any, index: number) => {
            return (
              <Item
                key={`payee_option_${index}`}
                selected={payee === options[item.index]}
                onClick={() => handleChangePayee(item.index)}
              >
                <div>
                  <h3>{item.title}</h3>
                  <div>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
              </Item>
            );
          })}
        </Items>
        <Footer complete={setup.payee !== null} setupType={SetupType.Stake} />
      </MotionContainer>
    </>
  );
};

export default Payee;
