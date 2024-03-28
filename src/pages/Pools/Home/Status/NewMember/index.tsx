// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NewMemberWrapper } from './Wrapper';
import { faChevronRight, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useSetup } from 'contexts/Setup';
import { usePoolsTabs } from '../../context';
import { useStatusButtons } from '../useStatusButtons';

export const NewMember = () => {
  const { setOnPoolSetup } = useSetup();
  const { setActiveTab } = usePoolsTabs();
  const { disableJoin, disableCreate } = useStatusButtons();

  // TODO: update locales.
  // title: `${t('pools.create')}${
  // title: `${t('pools.join')}`,

  return (
    <NewMemberWrapper>
      <div className="inner">
        <section>
          <div className="buttons">
            <button
              className="primary"
              onClick={() => setActiveTab(1)}
              disabled={disableJoin()}
            >
              <span>
                <FontAwesomeIcon icon={faUserPlus} /> Join a Pool
              </span>
            </button>
            <button className="secondary" onClick={() => setActiveTab(1)}>
              <span>
                Browse Pools
                <FontAwesomeIcon icon={faChevronRight} transform={'shrink-4'} />
              </span>
            </button>
          </div>
        </section>
        <section>
          <div className="buttons">
            <button
              className="secondary standalone"
              onClick={() => setOnPoolSetup(true)}
              disabled={disableCreate()}
            >
              <span>
                Create a Pool
                <FontAwesomeIcon icon={faChevronRight} transform={'shrink-4'} />
              </span>
            </button>
          </div>
        </section>
      </div>
    </NewMemberWrapper>
  );
};
