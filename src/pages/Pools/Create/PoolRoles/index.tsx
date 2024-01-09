// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSetup } from 'contexts/Setup';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import type { SetupStepProps } from 'library/SetupSteps/types';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Roles } from '../../Roles';
import type { PoolProgress } from 'contexts/Setup/types';
import type { PoolRoles as PoolRolesInterface } from 'contexts/Pools/ActivePools/types';

export const PoolRoles = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages');
  const { activeAccount } = useActiveAccounts();
  const { getPoolSetup, setActiveAccountSetup } = useSetup();
  const setup = getPoolSetup(activeAccount);
  const { progress } = setup;

  // if no roles in setup already, inject `activeAccount` to be
  // root and depositor roles.
  const initialValue = progress.roles ?? {
    root: activeAccount,
    depositor: activeAccount,
    nominator: activeAccount,
    bouncer: activeAccount,
  };

  // store local pool name for form control
  const [roles, setRoles] = useState<{ roles: PoolRolesInterface }>({
    roles: initialValue,
  });

  // pool name valid
  const [rolesValid, setRolesValid] = useState<boolean>(true);

  // handler for updating pool roles
  const handleSetupUpdate = (value: PoolProgress) => {
    setActiveAccountSetup('pool', value);
  };

  // update pool roles on account change
  useEffect(() => {
    setRoles({
      roles: initialValue,
    });
  }, [activeAccount]);

  // apply initial pool roles to setup progress
  useEffect(() => {
    // only update if this section is currently active
    if (setup.section === section) {
      setActiveAccountSetup('pool', {
        ...progress,
        roles: initialValue,
      });
    }
  }, [setup.section]);

  return (
    <>
      <Header
        thisSection={section}
        complete={progress.roles !== null}
        title={t('pools.roles')}
        helpKey="Pool Roles"
        bondFor="pool"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <h4 style={{ margin: '0.5rem 0' }}>
          <Trans defaults={t('pools.poolCreator')} components={{ b: <b /> }} />
        </h4>
        <h4 style={{ margin: '0.5rem 0 1.5rem 0' }}>
          <Trans
            defaults={t('pools.assignedToAnyAccount')}
            components={{ b: <b /> }}
          />
        </h4>
        <Roles
          inline
          batchKey="pool_roles_create"
          listenIsValid={setRolesValid}
          defaultRoles={initialValue}
          setters={[
            {
              set: handleSetupUpdate,
              current: progress,
            },
            {
              set: setRoles,
              current: roles,
            },
          ]}
        />
        <Footer complete={rolesValid} bondFor="pool" />
      </MotionContainer>
    </>
  );
};
