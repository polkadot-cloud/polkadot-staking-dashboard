// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper as StatWrapper } from 'library/Stat/Wrapper';
import { Identicon } from 'library/Identicon';
import { clipAddress } from 'Utils';
import Button from 'library/Button';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { useBalances } from 'contexts/Balances';
import OpenHelpIcon from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { Wrapper } from './Wrapper';

export const Controller = ({ label }: { label: string }) => {
  const { isReady } = useApi();
  const { activeAccount, isReadOnlyAccount, getAccount } = useConnect();
  const { openModalWith } = useModal();
  const { hasController } = useStaking();
  const { getBondedAccount } = useBalances();
  const controller = getBondedAccount(activeAccount);
  const { t } = useTranslation('common');

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
            <Identicon value={controller || ''} size={30} />
          </div>
          {displayName || display}
          <div className="btn">
            <Button
              primary
              inline
              title={t('pages.Nominate.change')}
              icon={faExchangeAlt}
              small
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
