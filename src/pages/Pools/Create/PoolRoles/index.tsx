// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { SetupStepProps } from 'library/SetupSteps/types';
import { SetupType } from 'contexts/UI/types';
import { Header } from 'library/SetupSteps/Header';
import { Footer } from 'library/SetupSteps/Footer';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { poolRoles as defaultPoolRoles } from 'contexts/Pools/ActivePool/defaults';

export const PoolRoles = (props: SetupStepProps) => {
  const { section } = props;
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const setup = getSetupProgress(SetupType.Pool, activeAccount);

  // if no roles in setup already, inject activeAccount to be
  // root and depositor roles.
  const initialValue =
    setup.roles === null
      ? {
          ...defaultPoolRoles,
          root: activeAccount,
          depositor: activeAccount,
        }
      : setup.roles;

  // store local pool name for form control
  const [roles, setRoles] = useState({
    roles: initialValue,
  });

  // TODO: implement check if roles are valid.
  const poolRolesValid = () => {
    return false;
  };

  // pool name valid
  const [rolesValid, setRolesValid] = useState<boolean>(poolRolesValid());

  // handler for updating pool roles
  const handleSetupUpdate = (value: any) => {
    setActiveAccountSetup(SetupType.Pool, value);
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
      setActiveAccountSetup(SetupType.Pool, {
        ...setup,
        roles: initialValue,
      });
    }
  }, [setup.section]);

  return (
    <>
      <Header
        thisSection={section}
        complete={setup.roles !== null}
        title="Pool Roles"
        // assistantPage="stake"
        // assistantKey="Bonding"
        setupType={SetupType.Pool}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {/* Uncomment when component is ready
        <RolesEdit
          listenValid={setRolesValid}
          defaultRoles={initialValue}
          setters={[
            {
              set: handleSetupUpdate,
              current: setup,
            },
            {
              set: setRoles,
              current: roles,
            },
          ]}
        /> */}

        <Footer complete={rolesValid} setupType={SetupType.Pool} />
      </MotionContainer>
    </>
  );
};
