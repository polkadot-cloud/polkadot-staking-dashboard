// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import {
  ActionItem,
  ButtonSubmitInvert,
  ModalNotes,
  ModalWarnings,
} from '@polkadot-cloud/react';
import { greaterThanZero, planckToUnit, rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { useOverlay } from '@polkadot-cloud/react/hooks';

export const ClaimCommission = ({ setSection }: any) => {
  const { t } = useTranslation('modals');
  const { api, network } = useApi();
  const { setModalStatus } = useOverlay().modal;
  const { activeAccount } = useConnect();
  const { isOwner, selectedActivePool } = useActivePools();
  const { getSignerWarnings } = useSignerWarnings();
  const poolId = selectedActivePool?.id;
  const pendingCommission = new BigNumber(
    rmCommas(selectedActivePool?.rewardPool?.totalCommissionPending || '0')
  );

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(isOwner() && greaterThanZero(pendingCommission));
  }, [selectedActivePool, pendingCommission]);

  // tx to submit
  const getTx = () => {
    if (!valid || !api) {
      return null;
    }
    return api.tx.nominationPools.claimCommission(poolId);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
    callbackInBlock: () => {},
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
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <ActionItem
          text={`${t('claim')} ${planckToUnit(
            pendingCommission,
            network.units
          )} ${network.unit} `}
        />
        <ModalNotes>
          <p>{t('sentToCommissionPayee')}</p>
        </ModalNotes>
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
