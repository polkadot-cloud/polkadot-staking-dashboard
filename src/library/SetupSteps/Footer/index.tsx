// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonPrimary } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useSetup } from 'contexts/Setup';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import type { FooterProps } from '../types';
import { Wrapper } from './Wrapper';

export const Footer = ({ complete, bondFor }: FooterProps) => {
  const { t } = useTranslation('library');
  const { activeAccount } = useActiveAccounts();
  const { getSetupProgress, setActiveAccountSetupSection } = useSetup();
  const setup = getSetupProgress(bondFor, activeAccount);

  return (
    <Wrapper>
      <section>
        {complete ? (
          <ButtonPrimary
            lg
            text={t('continue')}
            onClick={() =>
              setActiveAccountSetupSection(bondFor, setup.section + 1)
            }
          />
        ) : (
          <div style={{ opacity: 0.5 }}>
            <ButtonPrimary text={t('continue')} disabled lg />
          </div>
        )}
      </section>
    </Wrapper>
  );
};
