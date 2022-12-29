// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useSetup } from 'contexts/Setup';
import { defaultPoolSetup } from 'contexts/Setup/defaults';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SetupStepProps } from 'library/SetupSteps/types';
import { useTranslation } from 'react-i18next';
import { humanNumber, unitToPlanckBn } from 'Utils';
import { SummaryWrapper } from './Wrapper';

export const Summary = (props: SetupStepProps) => {
  const { section } = props;
  const { api, network } = useApi();
  const { units } = network;
  const { activeAccount, accountHasSigner } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const { stats } = usePoolsConfig();
  const { queryPoolMember, addToPoolMembers } = usePoolMembers();
  const { queryBondedPool, addToBondedPools } = useBondedPools();
  const { lastPoolId } = stats;
  const poolId = lastPoolId.add(new BN(1));
  const { txFeesValid } = useTxFees();
  const { t } = useTranslation('pages');

  const setup = getSetupProgress('pool', activeAccount);

  const { metadata, bond, roles, nominations } = setup;

  const getTxs = () => {
    if (
      !activeAccount ||
      !api ||
      !metadata ||
      bond === 0 ||
      !roles ||
      !nominations.length
    ) {
      return null;
    }

    const bondToSubmit = unitToPlanckBn(bond, units).toString();
    const targetsToSubmit = nominations.map((item: any) => item.address);

    // construct a batch of transactions
    const txs = [
      api.tx.nominationPools.create(
        bondToSubmit,
        roles.root,
        roles.nominator,
        roles.stateToggler
      ),
      api.tx.nominationPools.nominate(poolId.toString(), targetsToSubmit),
      api.tx.nominationPools.setMetadata(poolId.toString(), metadata),
    ];
    return api.tx.utility.batch(txs);
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTxs(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {},
    callbackInBlock: async () => {
      // query and add created pool to bondedPools list
      const pool = await queryBondedPool(poolId.toNumber());
      addToBondedPools(pool);

      // query and add account to poolMembers list
      const member = await queryPoolMember(activeAccount);
      addToPoolMembers(member);

      // reset localStorage setup progress
      setActiveAccountSetup('pool', defaultPoolSetup);
    },
  });

  return (
    <>
      <Header
        thisSection={section}
        complete={null}
        title={t('pools.summary') || ''}
        setupType="pool"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {!accountHasSigner(activeAccount) && (
          <Warning text={t('pools.readOnly')} />
        )}
        <SummaryWrapper>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('pools.poolName')}:
            </div>
            <div>{metadata ?? `${t('pools.notSet')}`}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('pools.bondAmount')}:
            </div>
            <div>
              {humanNumber(bond)} {network.unit}
            </div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('pools.nominations')}:
            </div>
            <div>{nominations.length}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('pools.roles')}:
            </div>
            <div>{t('pools.assigned')}</div>
          </section>
          <section>
            <EstimatedTxFee format="table" />
          </section>
        </SummaryWrapper>
        <div
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <ButtonPrimary
            lg
            onClick={() => submitTx()}
            disabled={
              submitting || !accountHasSigner(activeAccount) || !txFeesValid
            }
            text={t('pools.createPool')}
          />
        </div>
      </MotionContainer>
    </>
  );
};

export default Summary;
