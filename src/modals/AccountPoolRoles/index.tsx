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
  const { getAccountRoles } = useBondedPools();
  const { config } = useModal();
  const { who } = config;

  const roles = getAccountRoles(who);
  const { root, nominator, stateToggler } = roles;

  return (
    <>
      <Title title="Your Pool Roles" icon={faTasks} />
      <PaddingWrapper>
        <ContentWrapper>
          {root.length > 0 && (
            <>
              <h4>You have the root role in {root.length} pools</h4>
              <div className="items">
                {Object.entries(root).map(([key, item]: any, index: number) => {
                  return (
                    <Button
                      item={item}
                      index={index}
                      key={`network_switch_${index}`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};

const Button = (item: any, index: number) => {
  return (
    <StyledButton
      disabled={false}
      key={`network_switch_${index}`}
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
      <h3>{item}</h3>
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
