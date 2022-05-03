// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { planckToDot } from '../../../Utils';
import { useApi } from '../../../contexts/Api';
import { useConnect } from '../../../contexts/Connect';
import { useBalances } from '../../../contexts/Balances';
import { useStaking } from '../../../contexts/Staking';
import { useUi } from '../../../contexts/UI';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { Spacer } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MotionContainer } from '../MotionContainer';
import { Warning, BondStatus } from './Wrappers';
import { RESERVE_AMOUNT_PLANCK } from '../../../constants';
import { BondInput } from '../../../library/Form/BondInput';

export const Bond = (props: any) => {

  const { section } = props;

  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { staking, eraStakers } = useStaking();
  const { getAccountLedger, getBondedAccount, getAccountBalance }: any = useBalances();
  const { getSetupProgress, setActiveAccountSetup } = useUi();

  const { minNominatorBond } = staking;
  const { minActiveBond } = eraStakers;
  const balance = getAccountBalance(activeAccount);
  let { free } = balance;
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { total } = ledger;
  const setup = getSetupProgress(activeAccount);

  let freeAfterReserve: any = free - RESERVE_AMOUNT_PLANCK;
  freeAfterReserve = freeAfterReserve < 0 ? 0 : freeAfterReserve;

  const initialBondValue = setup.bond === 0
    ? freeAfterReserve
    : setup.bond;

  // store local bond amount for form control
  const [bond, setBond] = useState(planckToDot({
    bond: initialBondValue
  }));

  // handle errors

  let errors = [];
  let bondDisabled = false;

  // pre-bond input errors

  if (freeAfterReserve === 0) {
    bondDisabled = true;
    errors.push(`You have no free ${network.unit} to bond.`);
  }

  if (freeAfterReserve < minNominatorBond) {
    bondDisabled = true;
    errors.push(`You do not meet the minimum nominator bond of ${planckToDot(minNominatorBond)} ${network.unit}.`);
  }

  // bond input errors

  if (bond < minNominatorBond && bond !== '' && bond !== 0) {
    errors.push(`Bond amount must be at least ${planckToDot(minNominatorBond)} ${network.unit}.`);
  }

  if (bond > freeAfterReserve) {
    errors.push(`Bond amount is more than your free balance.`);
  }

  const gtMinNominatorBond = bond.bond >= planckToDot(minNominatorBond);
  const gtMinActiveBond = bond.bond >= minActiveBond;

  /*
  // Experimental
  // Get minimum bond for rewards for chosen validators.

  import { useEffect } from 'react';
  import { useNetworkMetrics } from '../../../contexts/Network';
  import { useValidators } from '../../../contexts/Validators';

  const { metrics }: any = useNetworkMetrics();
  const { getMinRewardBond, meta } = useValidators();

  const [minRewardBond, setMinRewardBond] = useState(null);

  useEffect(() => {
    // validator stake batch must be present to continue
    const _stakeExists = meta['validators_browse']?.stake ?? false;
    if (_stakeExists) {
      const minRewardBond = getMinRewardBond(setup.nominations.map((item: any) => item.address));
      setMinRewardBond(minRewardBond);
    }
  });
  */

  return (
    <SectionWrapper transparent>
      <Header
        thisSection={section}
        complete={setup.bond !== 0}
        title={`Bond${total > 0 ? `ed` : ``} ${network.unit}`}
        assistantPage='stake'
        assistantKey='Bonding'
      />

      <MotionContainer
        thisSection={section}
        activeSection={setup.section}
      >
        {errors.map((err: any, index: any) =>
          <Warning key={`setup_error_${index}`}>
            <FontAwesomeIcon icon={faExclamationTriangle} transform="shrink-2" />
            <h4>{err}</h4>
          </Warning>
        )}

        {!errors.length &&
          <h4>Available: {planckToDot(freeAfterReserve)} {network.unit}</h4>
        }
        <Spacer />
        <BondInput
          parentState={setup}
          setParentState={setActiveAccountSetup}
          disabled={bondDisabled}
          setters={[
            {
              set: setActiveAccountSetup,
              current: setup
            }, {
              set: setBond,
              current: bond,
            }
          ]}
        />

        <BondStatus>
          <div className='bars'>
            <section className={gtMinNominatorBond ? `invert` : ``}>
              <h4>&nbsp;</h4>
              <div className='bar'>
                <h5>Inactive</h5>
              </div>
            </section>
            <section className={gtMinNominatorBond ? `invert` : ``}>
              <h4>
                <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
                &nbsp;
                Nominate
              </h4>
              <div className='bar'>
                <h5>{planckToDot(minNominatorBond)} {network.unit}</h5>
              </div>
            </section>
            <section className={gtMinActiveBond ? `invert` : ``}>
              <h4>
                <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
                &nbsp;
                Active
              </h4>
              <div className='bar'>
                <h5>{minActiveBond} {network.unit}</h5>
              </div>
            </section>
          </div>
        </BondStatus>
        <Footer complete={setup.bond !== 0} />
      </MotionContainer>
    </SectionWrapper>
  )
}

export default Bond;