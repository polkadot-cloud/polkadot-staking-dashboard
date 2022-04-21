// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HeaderWrapper } from './Wrappers';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { Button } from '../../library/Button';

export const Header = (props: any) => {

  const { title, assistantPage, assistantKey, complete, thisSection, activeSection, setActiveSection } = props;

  return (
    <HeaderWrapper>
      <section>
        <h2>
          {title}
          <OpenAssistantIcon page={assistantPage} title={assistantKey} />
        </h2>
      </section>
      <section>
        {complete
          && <>
            {(activeSection !== thisSection && thisSection < activeSection) &&
              <span><Button inline small title="Update" onClick={() => { setActiveSection(thisSection) }} /></span>
            }
            <h4 className='complete'>Complete</h4>
          </>
        }
      </section>
    </HeaderWrapper>
  )
}

export default Header;