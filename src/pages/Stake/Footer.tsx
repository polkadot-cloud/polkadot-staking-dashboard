// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FooterWrapper } from './Wrappers';
import { Button } from '../../library/Button';

export const Footer = (props: any) => {

  const { complete, setActiveSection, activeSection } = props;

  return (
    <FooterWrapper>
      <section>
        {complete
          ? <Button inline primary title="Continue" onClick={() => setActiveSection(activeSection + 1)} />
          : <div style={{ opacity: 0.5 }}><Button inline title="Continue" disabled /></div>
        }
      </section>
    </FooterWrapper>
  )
}

export default Footer;