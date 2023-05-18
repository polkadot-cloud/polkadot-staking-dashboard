// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ActionItem, ButtonSubmitInvert } from '@polkadotcloud/core-ui';
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

export const Commission = ({ setSection }: any) => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount } = useConnect();
  const { getBondedPool } = useBondedPools();
  const { isOwner, selectedActivePool } = useActivePools();
  const { getSignerWarnings } = useSignerWarnings();

  const poolId = selectedActivePool?.id;
  const bondedPool = getBondedPool(poolId || 0);

  // Store the current commission value.
  const [commission, setCommission] = useState<number>(
    bondedPool?.commission?.current[0] || 0
  );

  // Store the commission payee.
  const [payee, setPayee] = useState<MaybeAccount>(
    bondedPool?.commission?.current[1] || null
  );

  // Valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(isOwner());
  }, [isOwner()]);

  // tx to submit.
  // TODO: update to set real commission.
  const getTx = () => {
    if (!valid || !api) {
      return null;
    }

    return api.tx.nominationPools.setCommission(
      poolId,
      payee && commission !== 0 ? [commission, payee] : null
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
      // TODO: update commission setting in `bondedPools` entry.
      // const pool = getBondedPool(poolId);
      // if (pool) {
      //   updateBondedPools([
      //     {
      //       ...pool,
      //       state: poolStateFromTask(task),
      //     },
      //   ]);
      // }
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

        <div
          style={{
            padding: '1rem 0.5rem 0.25rem 0.5rem',
          }}
        >
          <h4>{commission}% </h4>
          <div style={{ padding: '0.5rem 0.25rem' }}>
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
        </div>
        <AccountInput
          defaultLabel="Payee Account"
          successCallback={async (input) => {
            setPayee(input);
          }}
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
            onClick={() => setSection(0)}
          />,
        ]}
        {...submitExtrinsic}
      />
    </>
  );
};
