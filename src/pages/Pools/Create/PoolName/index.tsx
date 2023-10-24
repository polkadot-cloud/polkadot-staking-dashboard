// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetup } from 'contexts/Setup';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import type { SetupStepProps } from 'library/SetupSteps/types';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Input } from './Input';

export const PoolName = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages');
  const { activeAccount } = useActiveAccounts();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const setup = getSetupProgress('pool', activeAccount);
  const { progress } = setup;

  const initialValue = progress.metadata;

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
        ...progress,
        metadata: initialValue,
      });
    }
  }, [setup.section]);

  return (
    <>
      <Header
        thisSection={section}
        complete={progress.metadata !== ''}
        title={t('pools.poolName')}
        bondFor="pool"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <Input
          listenIsValid={setValid}
          defaultValue={initialValue}
          setters={[
            {
              set: handleSetupUpdate,
              current: progress,
            },
            {
              set: setMetadata,
              current: metadata,
            },
          ]}
        />
        <Footer complete={valid} bondFor="pool" />
      </MotionContainer>
    </>
  );
};
