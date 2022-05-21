// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { Button } from '../../../library/Button';
import { useBalances } from '../../../contexts/Balances';
import { useConnect } from '../../../contexts/Connect';
import { useStaking } from '../../../contexts/Staking';
import { PageRowWrapper } from '../../../Wrappers';
import { useModal } from '../../../contexts/Modal';
import { useUi } from '../../../contexts/UI';

export const ControllerNotImported = () => {
  const { openModalWith } = useModal();
  const { isSyncing } = useUi();
  const { getControllerNotImported } = useStaking();
  const { activeAccount } = useConnect();
  const { getBondedAccount }: any = useBalances();
  const controller = getBondedAccount(activeAccount);

  return (
    <>
      {getControllerNotImported(controller) && !isSyncing() && (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
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
