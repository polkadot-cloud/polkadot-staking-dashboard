// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ActionItem, ButtonSubmitInvert } from '@polkadotcloud/core-ui';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { AccountInput } from 'library/AccountInput';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { WarningsWrapper } from 'modals/Wrappers';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MaybeAccount } from 'types';
import { CommissionWrapper } from '../Wrappers';

export const Commission = ({ setSection }: any) => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount } = useConnect();
  const { getBondedPool, updateBondedPools } = useBondedPools();
  const { isOwner, selectedActivePool } = useActivePools();
  const { getSignerWarnings } = useSignerWarnings();

  const poolId = selectedActivePool?.id || 0;
  const bondedPool = getBondedPool(poolId);
  const initialCommission = Number(
    (bondedPool?.commission?.current?.[0] || '0%').slice(0, -1)
  );
  const initialPayee = bondedPool?.commission?.current?.[1] || null;

  // Store the current commission value.
  const [commission, setCommission] = useState<number>(initialCommission);

  // Store the commission payee.
  const [payee, setPayee] = useState<MaybeAccount>(initialPayee);

  // Valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  const resetToDefault = () => {
    setCommission(initialCommission);
    setPayee(initialPayee);
  };

  const hasCurrentCommission = payee && commission !== 0;

  const commissionCurrent = () => {
    return hasCurrentCommission ? [`${commission}%`, payee] : null;
  };
  const invalidCurrentCommission =
    (commission === 0 && payee !== null) ||
    (commission !== 0 && payee === null);

  const noChange = commission === initialCommission;

  useEffect(() => {
    setValid(isOwner() && !invalidCurrentCommission && !noChange);
  }, [isOwner(), invalidCurrentCommission, bondedPool, noChange]);

  useEffect(() => {
    setCommission(initialCommission);
    setPayee(initialPayee);
  }, [bondedPool]);

  // tx to submit.
  const getTx = () => {
    if (!valid || !api) {
      return null;
    }

    return api.tx.nominationPools.setCommission(
      poolId,
      hasCurrentCommission
        ? [new BigNumber(commission).multipliedBy(10000000).toString(), payee]
        : null
    );
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {
      const pool = getBondedPool(poolId);
      if (pool) {
        updateBondedPools([
          {
            ...pool,
            commission: {
              ...pool.commission,
              current: commissionCurrent(),
            },
          },
        ]);
      }
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <div className="padding">
        {warnings.length > 0 ? (
          <WarningsWrapper>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </WarningsWrapper>
        ) : null}

        <ActionItem text="Set Commission" />

        <CommissionWrapper>
          <h4 className="current">{commission}% </h4>
          <div className="slider">
            <Slider
              value={commission}
              step={0.25}
              onChange={(val) => {
                if (typeof val === 'number') {
                  setCommission(val);
                }
              }}
              trackStyle={{
                backgroundColor: 'var(--network-color-primary)',
              }}
              railStyle={{
                backgroundColor: 'var(--button-secondary-background)',
              }}
              handleStyle={{
                backgroundColor: 'var(--background-primary)',
                borderColor: 'var(--network-color-primary)',
                opacity: 1,
              }}
              activeDotStyle={{
                backgroundColor: 'var(--background-primary)',
              }}
            />
          </div>
        </CommissionWrapper>
        <AccountInput
          defaultLabel="Input Payee Account"
          successLabel="Payee Added"
          locked={payee !== null}
          successCallback={async (input) => {
            setPayee(input);
          }}
          resetCallback={() => {
            setPayee(null);
          }}
          disallowAlreadyImported={false}
          initialValue={payee}
          inactive={commission === 0}
        />
      </div>
      <SubmitTx
        valid={valid}
        buttons={[
          <ButtonSubmitInvert
            key="button_back"
            text={t('back')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-1"
            onClick={() => {
              setSection(0);
              resetToDefault();
            }}
          />,
        ]}
        {...submitExtrinsic}
      />
    </>
  );
};
