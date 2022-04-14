// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { Button } from '../../library/Button';
import { useBalances } from '../../contexts/Balances';
import { useConnect } from '../../contexts/Connect';
import { StakingAccount } from './Wrappers';
import Account from '../../library/Account';
import { useAssistant } from '../../contexts/Assistant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../../contexts/Modal';

export const Controller = () => {

  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { goToDefinition } = useAssistant();
  const { getBondedAccount }: any = useBalances();

  const controller = getBondedAccount(activeAccount);

  return (
    <SectionWrapper transparent>
      <h3 style={{ marginBottom: '1rem' }}>
        Controller
        <button onClick={() => {
          goToDefinition('stake', 'Stash and Controller Accounts');
        }}>
          <FontAwesomeIcon transform='grow-5' icon={faInfoCircle} />
        </button>
      </h3>

      <StakingAccount last>
        <Account
          canClick={false}
          value={controller}
        />
        <Button
          primary
          title='Change Controller'
          onClick={() => openModalWith('ChangeController', {}, 'small')}
        />
      </StakingAccount>
    </SectionWrapper>
  )
}

export default Controller;