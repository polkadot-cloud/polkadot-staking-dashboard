// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Separator } from '../../Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { useApi } from '../../contexts/Api';
import { MainWrapper } from '../../library/Layout';
import { Button } from '../../library/Button';
import { usePools } from '../../contexts/Pools';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';

export const Status = () => {
  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { membership } = usePools();
  const { openModalWith } = useModal();

  return (
    <MainWrapper paddingLeft>
      <SectionWrapper style={{ height: 360 }}>
        <div className="head">
          <h4>
            Status
            <OpenAssistantIcon page="pools" title="Pool Status" />
          </h4>
          <h2>
            {membership === undefined ? 'Not in a Pool' : 'Active in Pool'}{' '}
            &nbsp;
            <div>
              {membership === undefined ? (
                <Button
                  small
                  inline
                  primary
                  title="Create Pool"
                  onClick={() => openModalWith('CreatePool', {}, 'small')}
                />
              ) : (
                <Button small inline primary title="Leave" onClick={() => {}} />
              )}
            </div>
          </h2>
          <Separator />
          <h4>
            Bonded in Pool
            <OpenAssistantIcon page="pools" title="Bonded in Pool" />
          </h4>
          <h2>
            {membership === undefined ? (
              `0 ${network.unit}`
            ) : (
              <>
                {membership.bondedAmount} {network.unit} &nbsp;
                <div>
                  <Button small primary inline title="+" onClick={() => {}} />
                  <Button small primary title="-" onClick={() => {}} />
                </div>
              </>
            )}
          </h2>
          <Separator />
          <h4>
            Unclaimed Rewards
            <OpenAssistantIcon page="pools" title="Pool Rewards" />
          </h4>
          <h2>
            {membership === undefined ? (
              `0 ${network.unit}`
            ) : (
              <>
                {membership.unclaimedRewards} {network.unit} &nbsp;
                <div>
                  <Button
                    small
                    primary
                    inline
                    title="Claim"
                    onClick={() => {}}
                  />
                </div>
              </>
            )}
          </h2>
        </div>
      </SectionWrapper>
    </MainWrapper>
  );
};

export default Status;
