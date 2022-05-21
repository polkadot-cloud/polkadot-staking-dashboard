// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Separator, RowPrimaryWrapper } from '../../Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { useApi } from '../../contexts/Api';
import { Button } from '../../library/Button';
import { usePools } from '../../contexts/Pools';
import { useConnect } from '../../contexts/Connect';

export const Status = () => {
  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { getAccountActivePool } = usePools();
  const activePool = getAccountActivePool(activeAccount);

  return (
    <RowPrimaryWrapper paddingLeft>
      <SectionWrapper style={{ height: 360 }}>
        <div className="head">
          <h4>
            Status
            <OpenAssistantIcon page="pools" title="Pool Status" />
          </h4>
          <h2>
            {activePool === undefined ? 'Not in a Pool' : 'Active in Pool'}{' '}
            &nbsp;
            <div>
              {activePool === undefined ? (
                <Button
                  small
                  inline
                  primary
                  title="Create Pool"
                  onClick={() => {}}
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
            {activePool === undefined ? (
              `0 ${network.unit}`
            ) : (
              <>
                {activePool.bondedAmount} {network.unit} &nbsp;
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
            {activePool === undefined ? (
              `0 ${network.unit}`
            ) : (
              <>
                {activePool.unclaimedRewards} {network.unit} &nbsp;
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
    </RowPrimaryWrapper>
  );
};

export default Status;
