// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { Identicon } from 'library/Identicon';
import OpenHelpIcon from 'library/OpenHelpIcon';
import { Wrapper as StatWrapper } from 'library/Stat/Wrapper';
import { clipAddress } from 'Utils';
import { Wrapper } from './Wrapper';

export const Controller = ({ label }: { label: string }) => {
  const { isReady } = useApi();
  const { activeAccount, isReadOnlyAccount, getAccount } = useConnect();
  const { openModalWith } = useModal();
  const { hasController } = useStaking();
  const { getBondedAccount } = useBalances();
  const controller = getBondedAccount(activeAccount);

  let display = 'None';
  if (hasController() && controller) {
    display = clipAddress(controller);
  }

  const displayName = getAccount(controller)?.name;

  return (
    <StatWrapper>
      <h4>
        {label} <OpenHelpIcon helpKey="Stash and Controller Accounts" />
      </h4>
      <Wrapper paddingLeft={hasController()} paddingRight>
        <h2 className="hide-with-padding">
          <div className="icon">
            <Identicon value={controller || ''} size={26} />
          </div>
          {displayName || display}&nbsp;
          <div className="btn">
            <ButtonPrimary
              text="Change"
              iconLeft={faExchangeAlt}
              disabled={
                !isReady || !hasController() || isReadOnlyAccount(activeAccount)
              }
              onClick={() => openModalWith('UpdateController', {}, 'large')}
            />
          </div>
        </h2>
      </Wrapper>
    </StatWrapper>
  );
};
