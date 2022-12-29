// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SetupStepProps } from 'library/SetupSteps/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from './Input';

export const PoolName = (props: SetupStepProps) => {
  const { section } = props;
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const setup = getSetupProgress('pool', activeAccount);
  const { t } = useTranslation('pages');

  const initialValue = setup.metadata;

  // store local pool name for form control
  const [metadata, setMetadata] = useState({
    metadata: initialValue,
  });

  // pool name valid
  const [valid, setValid] = useState<boolean>(initialValue !== '');

  // handler for updating bond
  const handleSetupUpdate = (value: any) => {
    setActiveAccountSetup('pool', value);
  };

  // update bond on account change
  useEffect(() => {
    setMetadata({
      metadata: initialValue,
    });
  }, [activeAccount]);

  // apply initial metadata to setup progress
  useEffect(() => {
    // only update if this section is currently active
    if (setup.section === section) {
      setActiveAccountSetup('pool', {
        ...setup,
        metadata: initialValue,
      });
    }
  }, [setup.section]);

  return (
    <>
      <Header
        thisSection={section}
        complete={setup.metadata !== ''}
        title={t('pools.poolName') || ''}
        // helpKey="Bonding"
        setupType="pool"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <Input
          listenIsValid={setValid}
          defaultValue={initialValue}
          setters={[
            {
              set: handleSetupUpdate,
              current: setup,
            },
            {
              set: setMetadata,
              current: metadata,
            },
          ]}
        />
        <Footer complete={valid} setupType="pool" />
      </MotionContainer>
    </>
  );
};
