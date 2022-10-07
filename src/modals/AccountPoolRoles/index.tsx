// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from 'contexts/Modal';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { BondedPool } from 'contexts/Pools/types';
import { Title } from 'library/Modal/Title';
import Identicon from 'library/Identicon';
import { PaddingWrapper } from '../Wrappers';
import { StyledButton, ContentWrapper } from './Wrappers';

export const AccountPoolRoles = () => {
  const { getAccountPools } = useBondedPools();
  const { config } = useModal();
  const { who } = config;

  const accountPools = getAccountPools(who);
  const totalAccountPools = Object.entries(accountPools).length;

  return (
    <>
      <Title title="All Pool Roles" icon={faBars} />
      <PaddingWrapper>
        <ContentWrapper>
          <h4>
            You have active roles in <b>{totalAccountPools}</b> pool
            {totalAccountPools === 1 ? '' : 's'}
          </h4>
          <div className="items">
            {Object.entries(accountPools).map(([key, item]: any, i: number) => (
              <Button item={item} poolId={key} key={`all_roles_root_${i}`} />
            ))}
          </div>
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};

const Button = ({ item, poolId }: { item: Array<string>; poolId: string }) => {
  const { bondedPools } = useBondedPools();

  const pool = bondedPools.find((b: BondedPool) => String(b.id) === poolId);
  const stash = pool?.addresses?.stash || '';

  return (
    <StyledButton
      disabled={false}
      type="button"
      className="action-button"
      onClick={() => {
        /* TODO: switch active pool being displayed. */
      }}
    >
      <div className="icon">
        <Identicon value={stash} size={30} />
      </div>

      <div className="details">
        <h3>Pool {poolId}</h3>
        <h4>
          {item.includes('root') && <span>Root</span>}
          {item.includes('nominator') && <span>Nominator</span>}
          {item.includes('stateToggler') && <span>State Toggler</span>}
        </h4>
      </div>
      <div>
        <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
      </div>
    </StyledButton>
  );
};

export default AccountPoolRoles;
