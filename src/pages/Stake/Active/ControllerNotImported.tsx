// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { Button } from '../../../library/Button';
import { useBalances } from '../../../contexts/Balances';
import { useConnect } from '../../../contexts/Connect';
import { useStaking } from '../../../contexts/Staking';
import { PageRowWrapper } from '../../../Wrappers';
import { useModal } from '../../../contexts/Modal';

export const ControllerNotImported = () => {
  const { openModalWith } = useModal();
  const { isControllerImported } = useStaking();
  const { activeAccount } = useConnect();
  const { getBondedAccount }: any = useBalances();
  const controller = getBondedAccount(activeAccount);
  const controllerImported = isControllerImported(controller);

  return (
    <>
      {!controllerImported && (
        <PageRowWrapper noVerticalSpacer>
          <SectionWrapper
            style={{ border: '2px solid rgba(242, 185, 27,0.25)' }}
          >
            <div className="head">
              <h4>
                You have not imported your Controller account. If you have lost
                access to your Controller account, set a new one now.
              </h4>
            </div>
            <Button
              small
              primary
              inline
              title="Set New Controller"
              onClick={() => openModalWith('UpdateController', {}, 'small')}
            />
          </SectionWrapper>
        </PageRowWrapper>
      )}
    </>
  );
};
