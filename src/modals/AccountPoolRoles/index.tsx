// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight, faTasks } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from 'contexts/Modal';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { Title } from 'library/Modal/Title';
import { PaddingWrapper } from '../Wrappers';
import { StyledButton, ContentWrapper } from './Wrappers';

export const AccountPoolRoles = () => {
  const { getAccountRoles, getAccountPools } = useBondedPools();
  const { config } = useModal();
  const { who } = config;

  // TODO: refactor lists with accountPools
  const roles = getAccountRoles(who);
  const { root, nominator, stateToggler } = roles;

  const accountPools = getAccountPools(who);

  return (
    <>
      <Title title="Your Pool Roles" icon={faTasks} />
      <PaddingWrapper>
        <ContentWrapper>
          {root.length > 0 && (
            <>
              <h4>Root</h4>
              <div className="items">
                {root.map((id: string, i: number) => (
                  <Button poolId={id} key={`all_roles_root_${i}`} />
                ))}
              </div>
            </>
          )}
          {nominator.length > 0 && (
            <>
              <h4>Nominator</h4>
              <div className="items">
                {nominator.map((id: string, i: number) => (
                  <Button poolId={id} key={`all_roles_nominator_${i}`} />
                ))}
              </div>
            </>
          )}
          {stateToggler.length > 0 && (
            <>
              <h4>State Toggler</h4>
              <div className="items">
                {stateToggler.map((id: string, i: number) => (
                  <Button poolId={id} key={`all_roles_state_toggler_${i}`} />
                ))}
              </div>
            </>
          )}
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};

const Button = ({ poolId }: { poolId: string }) => {
  return (
    <StyledButton
      disabled={false}
      type="button"
      className="action-button"
      onClick={() => {
        /* TODO: switch active pool being displayed. */
      }}
    >
      <div style={{ width: '1.75rem' }}>
        {/* <Svg
          width={item.brand.inline.size}
          height={item.brand.inline.size}
        /> */}
      </div>
      <h3>{poolId}</h3>
      {/* {networkKey === key && (
        <h4 className="selected">Selected</h4>
      )} */}
      <div>
        <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
      </div>
    </StyledButton>
  );
};

export default AccountPoolRoles;
