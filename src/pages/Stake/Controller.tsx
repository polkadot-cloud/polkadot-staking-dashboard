// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { StakingAccount } from './Wrappers';
import { ColumnWrapper, ColumnItem, HalfWrapper, HalfItem } from '../../library/Layout';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { Button, ButtonRow } from '../../library/Button';
import { useBalances } from '../../contexts/Balances';
import Account from '../../library/Account';
import { useConnect } from '../../contexts/Connect';
import { useMessages } from '../../contexts/Messages';
import { GLOBAL_MESSGE_KEYS } from '../../constants';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';

export const Controller = () => {

  const { activeAccount } = useConnect();
  const { getBondedAccount }: any = useBalances();
  const { getMessage }: any = useMessages();
  const controller = getBondedAccount(activeAccount);

  const [controllerNotImported, setControllerNotImported] = useState(getMessage(GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED));

  useEffect(() => {
    setControllerNotImported(getMessage(GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED));
  }, [getMessage(GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED)]);

  return (
    <>
      {/* warning: controller account not present. unable to stake */}
      {controllerNotImported !== null &&
        <SectionWrapper transparent style={{ border: '2px solid rgba(242, 185, 27,0.25)' }}>
          <h3>Import Your Controller Account</h3>
          <p>You have not imported your Controller account. If you have lost access to your Controller account, set a new Controller now.</p>

          <ButtonRow style={{ width: '100%', padding: 0, marginTop: '1rem' }}>
            <Button inline title='Set New Controller' />
          </ButtonRow>
        </SectionWrapper>
      }

      {/* controller management */}
      {controllerNotImported === null &&
        <SectionWrapper transparent>
          <h3>
            Set Controller Account
            <OpenAssistantIcon page="stake" title="Stash and Controller Accounts" />
          </h3>
          <HalfWrapper alignItems='flex-end'>
            <HalfItem>
              <ColumnWrapper>
                <ColumnItem>
                  <StakingAccount last>
                    <Account
                      canClick={false}
                      unassigned={controller === null}
                      address={controller}
                    />
                  </StakingAccount>
                </ColumnItem>
              </ColumnWrapper>
            </HalfItem>
            <HalfItem>
              <Button inline title='Select Controller' />
            </HalfItem>
          </HalfWrapper>
        </SectionWrapper>
      }
    </>
  )
}

export default Controller;