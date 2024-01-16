// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetup } from 'contexts/Setup';
import { useTxMeta } from 'contexts/TxMeta';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { NominateStatusBar } from 'library/Form/NominateStatusBar';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import type { SetupStepProps } from 'library/SetupSteps/types';
import { useActiveAccounts } from 'contexts/ActiveAccounts';

export const Bond = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages');
  const { activeAccount } = useActiveAccounts();
  const { txFees } = useTxMeta();
  const { getNominatorSetup, setActiveAccountSetup } = useSetup();
  const setup = getNominatorSetup(activeAccount);
  const { progress } = setup;

  // either free to bond or existing setup value
  const initialBondValue = progress.bond || '0';

  // store local bond amount for form control
  const [bond, setBond] = useState<{ bond: string }>({
    bond: initialBondValue,
  });

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // handler for updating bond
  const handleSetBond = (value: { bond: BigNumber }) => {
    // set this form's bond value.
    setBond({
      bond: value.bond.toString() || '0',
    });
    // set nominator progress bond value.
    setActiveAccountSetup('nominator', {
      ...progress,
      bond: value.bond.toString(),
    });
  };

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: initialBondValue,
    });
  }, [activeAccount]);

  // apply initial bond value to setup progress
  useEffect(() => {
    // only update if Bond is currently active
    if (setup.section === section) {
      setActiveAccountSetup('nominator', {
        ...progress,
        bond: initialBondValue,
      });
    }
  }, [setup.section]);

  return (
    <>
      <Header
        thisSection={section}
        complete={progress.bond !== '0' && progress.bond !== ''}
        title={t('nominate.bond')}
        helpKey="Bonding"
        bondFor="nominator"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <BondFeedback
          syncing={txFees.isZero()}
          bondFor="nominator"
          inSetup
          listenIsValid={(valid) => setBondValid(valid)}
          defaultBond={initialBondValue}
          setters={[handleSetBond]}
          txFees={txFees}
          maxWidth
        />
        <NominateStatusBar value={new BigNumber(bond.bond)} />
        <Footer complete={bondValid} bondFor="nominator" />
      </MotionContainer>
    </>
  );
};
