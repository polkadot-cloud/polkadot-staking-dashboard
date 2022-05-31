// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { Button } from 'library/Button';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { ConnectContextInterface } from 'types/connect';
import { HeaderWrapper } from '../Wrappers';

export const Header = (props: any) => {
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { getSetupProgress, setActiveAccountSetupSection } = useUi();
  const setup = getSetupProgress(activeAccount);

  const { title, assistantPage, assistantKey, complete, thisSection } = props;

  return (
    <HeaderWrapper>
      <section>
        <h2>
          {title}
          {assistantPage !== undefined && assistantKey !== undefined && (
            <OpenAssistantIcon page={assistantPage} title={assistantKey} />
          )}
        </h2>
      </section>
      <section>
        {complete && (
          <>
            {setup.section !== thisSection && thisSection < setup.section && (
              <span>
                <Button
                  inline
                  small
                  title="Update"
                  onClick={() => {
                    setActiveAccountSetupSection(thisSection);
                  }}
                />
              </span>
            )}
            <h4 className="complete">Complete</h4>
          </>
        )}
      </section>
    </HeaderWrapper>
  );
};

export default Header;
