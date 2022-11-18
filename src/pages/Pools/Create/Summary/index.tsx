// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useTxFees } from 'contexts/TxFees';
import { useUi } from 'contexts/UI';
import { defaultPoolSetup } from 'contexts/UI/defaults';
import { SetupType } from 'contexts/UI/types';
import { Button } from 'library/Button';
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
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const { stats } = usePoolsConfig();
  const { queryPoolMember, addToPoolMembers } = usePoolMembers();
  const { queryBondedPool, addToBondedPools } = useBondedPools();
  const { lastPoolId } = stats;
  const poolId = lastPoolId.add(new BN(1));
  const { txFeesValid } = useTxFees();
  const { t } = useTranslation('common');

  const setup = getSetupProgress(SetupType.Pool, activeAccount);

  const { metadata, bond, roles, nominations } = setup;

  const txs = () => {
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
    const _txs = [
      api.tx.nominationPools.create(
        bondToSubmit,
        roles.root,
        roles.nominator,
        roles.stateToggler
      ),
      api.tx.nominationPools.nominate(poolId.toString(), targetsToSubmit),
      api.tx.nominationPools.setMetadata(poolId.toString(), metadata),
    ];
    return api.tx.utility.batch(_txs);
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: txs(),
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
      setActiveAccountSetup(SetupType.Pool, defaultPoolSetup);
    },
  });

  return (
    <>
      <Header
        thisSection={section}
        complete={null}
        title={t('pages.pools.summary') || ''}
        setupType={SetupType.Pool}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {!accountHasSigner(activeAccount) && (
          <Warning text={t('pages.pools.w1')} />
        )}
        <SummaryWrapper>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('pages.pools.pool_name')}
            </div>
            <div>{metadata ?? `Not Set`}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('pages.pools.bond_amount')}
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
              &nbsp; {t('pages.pools.nominations')}
            </div>
            <div>{nominations.length}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('pages.pools.roles')}
            </div>
            <div>{t('pages.pools.assigned')}</div>
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
          <Button
            onClick={() => submitTx()}
            disabled={
              submitting || !accountHasSigner(activeAccount) || !txFeesValid
            }
            title={t('pages.pools.create_pool')}
            primary
          />
        </div>
      </MotionContainer>
    </>
  );
};

export default Summary;
