// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from '../../contexts/Modal';
import { useApi } from '../../contexts/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ContentWrapper } from './Wrapper';

export const Tasks = (props: any) => {
  const { setSection, setTask } = props;

  const { network }: any = useApi();
  const { config, }: any = useModal();
  const { fn } = config;

  return (
    <ContentWrapper>
      <div className='items'>
        {fn === 'add' &&
          <>
            <button
              className='action-button'
              onClick={() => {
                setSection(1);
                setTask('bond_some');
              }}>
              <div>
                <h3>Bond Extra</h3>
                <p>Bond more {network.unit}.</p>
              </div>
              <div>
                <FontAwesomeIcon transform='shrink-2' icon={faChevronRight} />
              </div>
            </button>
            <button
              className='action-button'
              onClick={() => {
                setSection(1);
                setTask('bond_all');
              }}>
              <div>
                <h3>Bond All</h3>
                <p>Bond all available {network.unit}.</p>
              </div>
              <div>
                <FontAwesomeIcon transform='shrink-2' icon={faChevronRight} />
              </div>
            </button>
          </>
        }
        {fn === 'remove' &&
          <>
            <button
              className='action-button'
              onClick={() => {
                setSection(1);
                setTask('unbond_some');
              }}>
              <div>
                <h3>Unbond</h3>
                <p>Unbond some of your {network.unit}.</p>
              </div>
              <div>
                <FontAwesomeIcon transform='shrink-2' icon={faChevronRight} />
              </div>
            </button>
            <button
              className='action-button'
              onClick={() => {
                setSection(1);
                setTask('unbond_all');
              }}>
              <div>
                <h3>Unbond All</h3>
                <p>Exit your staking position.</p>
              </div>
              <div>
                <FontAwesomeIcon transform='shrink-2' icon={faChevronRight} />
              </div>
            </button>
          </>
        }
      </div>
    </ContentWrapper>
  )
}

export default Tasks;