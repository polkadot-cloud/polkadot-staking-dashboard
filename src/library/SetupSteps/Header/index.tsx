// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp, ButtonSecondary } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useSetup } from 'contexts/Setup';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import type { HeaderProps } from '../types';
import { Wrapper } from './Wrapper';

export const Header = ({
  title,
  helpKey,
  complete,
  thisSection,
  bondFor,
}: HeaderProps) => {
  const { t } = useTranslation('library');
  const { activeAccount } = useActiveAccounts();
  const { getSetupProgress, setActiveAccountSetupSection } = useSetup();
  const setup = getSetupProgress(bondFor, activeAccount);
  const { openHelp } = useHelp();

  return (
    <Wrapper>
      <section>
        <h2>
          {title}
          {helpKey !== undefined ? (
            <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
          ) : null}
        </h2>
      </section>
      <section>
        {complete && (
          <>
            {setup.section !== thisSection && thisSection < setup.section && (
              <span>
                <ButtonSecondary
                  text={t('update')}
                  onClick={() => {
                    setActiveAccountSetupSection(bondFor, thisSection);
                  }}
                />
              </span>
            )}
            <h4 className="complete">{t('complete')}</h4>
          </>
        )}
      </section>
    </Wrapper>
  );
};
