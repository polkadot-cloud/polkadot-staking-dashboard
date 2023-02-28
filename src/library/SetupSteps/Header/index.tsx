// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp, ButtonSecondary } from '@rossbulat/polkadot-dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { useHelp } from 'contexts/Help';
import { useSetup } from 'contexts/Setup';
import { useTranslation } from 'react-i18next';
import { HeaderProps } from '../types';
import { Wrapper } from './Wrapper';

export const Header = ({
  title,
  helpKey,
  complete,
  thisSection,
  bondFor,
}: HeaderProps) => {
  const { t } = useTranslation('library');
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetupSection } = useSetup();
  const setup = getSetupProgress(bondFor, activeAccount);
  const { openHelp } = useHelp();

  return (
    <Wrapper>
      <section>
        <h2>
          {title}
          {helpKey !== undefined && (
            <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
          )}
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
