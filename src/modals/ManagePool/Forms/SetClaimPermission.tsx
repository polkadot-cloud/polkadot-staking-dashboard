// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ActionItem, ButtonSubmitInvert } from '@polkadotcloud/core-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import type { ClaimPermission } from 'contexts/Pools/types';
import { TabWrapper, TabsWrapper } from 'library/Filter/Wrappers';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { WarningsWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const SetClaimPermission = ({ setSection, section }: any) => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount } = useConnect();
  const { isOwner, isMember } = useActivePools();
  const { getSignerWarnings } = useSignerWarnings();
  const { membership, claimPermissionConfig } = usePoolMemberships();

  // Valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // Updated claim permission value
  const [claimPermission, setClaimPermission] = useState<
    ClaimPermission | undefined
  >(membership?.claimPermission);

  // Max commission enabled.
  const [claimPermissionEnabled, setClaimPermissionEnabled] =
    useState<boolean>(false);

  // Determine current pool metadata and set in state.
  useEffect(() => {
    const current = membership?.claimPermission;
    if (current) {
      setClaimPermission(current);
      setClaimPermissionEnabled(current !== 'Permissioned');
    }
  }, [section, membership]);

  useEffect(() => {
    setValid(isOwner() || (isMember() && claimPermission !== undefined));
  }, [isOwner(), isMember()]);

  // tx to submit.
  const getTx = () => {
    if (!valid || !api) {
      return null;
    }
    return api.tx.nominationPools.setClaimPermission(claimPermission);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  const activeTab = claimPermissionConfig.find(
    ({ value }) => value === claimPermission
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

        <ActionItem
          style={{
            marginTop: '1rem',
          }}
          text="Enable Permissionless Claiming"
          toggled={claimPermissionEnabled}
          onToggle={(val) => {
            // toggle enable claim permission.
            setClaimPermissionEnabled(val);

            if (!claimPermissionEnabled) {
              // if current val is not Permissioned, slot in the current value.
              setClaimPermission(
                membership?.claimPermission === 'Permissioned'
                  ? claimPermissionConfig[0].value
                  : membership?.claimPermission ||
                      claimPermissionConfig[0].value
              );
            } else {
              setClaimPermission('Permissioned');
            }
          }}
        />

        <TabsWrapper
          style={{
            margin: '1rem 0',
            opacity: claimPermissionEnabled ? 1 : 0.5,
          }}
        >
          {claimPermissionConfig.map(({ label, value }: any, i) => (
            <TabWrapper
              key={`pools_tab_filter_${i}`}
              active={value === claimPermission && claimPermissionEnabled}
              disabled={value === claimPermission || !claimPermissionEnabled}
              onClick={() => setClaimPermission(value)}
            >
              {label}
            </TabWrapper>
          ))}
        </TabsWrapper>
        {activeTab ? (
          <p>{activeTab.description}</p>
        ) : (
          <p>Permissionless claiming is turned off.</p>
        )}
      </div>
      <SubmitTx
        valid={valid && claimPermission !== membership?.claimPermission}
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
