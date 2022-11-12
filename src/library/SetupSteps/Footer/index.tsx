// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { FooterProps } from '../types';
import { Wrapper } from './Wrapper';

export const Footer = (props: FooterProps) => {
  const { complete, setupType } = props;

  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetupSection } = useUi();
  const setup = getSetupProgress(setupType, activeAccount);

  return (
    <Wrapper>
      <section>
        {complete ? (
          <ButtonPrimary
            lg
            text="Continue"
            onClick={() =>
              setActiveAccountSetupSection(setupType, setup.section + 1)
            }
          />
        ) : (
          <div style={{ opacity: 0.5 }}>
            <ButtonPrimary text="Continue" disabled lg />
          </div>
        )}
      </section>
    </Wrapper>
  );
};

export default Footer;
