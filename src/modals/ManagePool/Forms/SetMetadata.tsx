// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import {
  ButtonSubmitInvert,
  ModalPadding,
  ModalWarnings,
} from '@polkadot-cloud/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';

export const SetMetadata = ({ setSection, section }: any) => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setModalStatus } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { isOwner, selectedActivePool } = useActivePools();
  const { bondedPools, poolsMetaData } = useBondedPools();
  const { getSignerWarnings } = useSignerWarnings();

  const poolId = selectedActivePool?.id;

  // Valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // Updated metadata value
  const [metadata, setMetadata] = useState<string>('');

  // Determine current pool metadata and set in state.
  useEffect(() => {
    const pool = bondedPools.find(
      ({ addresses }) => addresses.stash === selectedActivePool?.addresses.stash
    );
    if (pool) {
      setMetadata(u8aToString(u8aUnwrapBytes(poolsMetaData[Number(pool.id)])));
    }
  }, [section]);

  useEffect(() => {
    setValid(isOwner());
  }, [isOwner()]);

  // tx to submit
  const getTx = () => {
    if (!valid || !api) {
      return null;
    }
    return api.tx.nominationPools.setMetadata(poolId, metadata);
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

  const handleMetadataChange = (e: React.FormEvent<HTMLInputElement>) => {
    setMetadata(e.currentTarget.value);
    setValid(true);
  };

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <ModalPadding horizontalOnly>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <input
          className="textbox"
          style={{ width: '100%' }}
          placeholder={t('poolName')}
          type="text"
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            handleMetadataChange(e)
          }
          value={metadata ?? ''}
        />
        <p>{t('storedOnChain')}</p>
      </ModalPadding>
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
