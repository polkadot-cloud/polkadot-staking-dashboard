// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Wrapper } from './Wrapper';
import Identicon from '../Identicon';
import { clipAddress } from '../../Utils';
import { motion } from 'framer-motion';
import { useApi } from '../../contexts/Api';
import { useModal } from '../../contexts/Modal';
import { useStaking } from '../../contexts/Staking';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIdentityDisplay } from './Utils';
import { faExclamationTriangle, faUserSlash, faChartLine, faThumbtack } from '@fortawesome/free-solid-svg-icons';

export const ValidatorInner = (props: any) => {

  const { consts, network }: any = useApi();
  const { openModalWith } = useModal();
  const { addFavourite, removeFavourite, favourites } = useStaking();
  const { initial, validator, synced, identity, superIdentity, stake, toggleFavourites } = props;

  let { address, prefs } = validator;

  let display = getIdentityDisplay(identity, superIdentity);
  let commission = prefs?.commission ?? null;
  let blocked = prefs?.blocked ?? null;

  let total_nominations = stake?.total_nominations ?? 0;
  let lowest = stake?.lowest ?? 0;

  return (
    <Wrapper>
      <div>
        <Identicon
          value={address}
          size={26}
        />

        {synced.identities &&
          <>
            {display !== null && <>
              {initial
                ?
                <motion.div
                  className='identity'
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4>{display}</h4>
                </motion.div>
                :
                <div className='identity'>
                  <h4>{display}</h4>
                </div>
              }
            </>
            }
            {display === null && <>
              {initial
                ?
                <motion.div
                  className='identity'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h4>{clipAddress(address)}</h4>
                </motion.div>
                :
                <div className='identity'>
                  <h4>{clipAddress(address)}</h4>
                </div>
              }
            </>
            }
          </>
        }

        <div className='labels'>
          {(synced.stake && total_nominations >= consts.maxNominatorRewardedPerValidator) &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <label className='warning'>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  transform="shrink-2"
                />
                &nbsp;{lowest} {network.unit}
              </label>
            </motion.div>
          }
          {prefs !== undefined &&
            <>
              {blocked &&
                <label>
                  <FontAwesomeIcon
                    icon={faUserSlash}
                    color='#d2545d'
                    transform="shrink-1"
                  />
                </label>
              }
              <label>
                {commission}%
              </label>
            </>
          }
          <label>
            <button onClick={() => openModalWith('EraPoints', {
              address: address,
              identity: display,
            })}>
              <FontAwesomeIcon icon={faChartLine} />
            </button>
          </label>

          {toggleFavourites &&
            <label>
              <button
                className={favourites.includes(address) ? 'active' : undefined}
                onClick={() => {
                  favourites.includes(address)
                    ? removeFavourite(address)
                    : addFavourite(address);
                }}>
                <FontAwesomeIcon icon={faThumbtack} />
              </button>
            </label>
          }
        </div>
      </div>
    </Wrapper>
  )
}

export class Validator extends React.Component<any, any> {

  shouldComponentUpdate (nextProps: any, nextState: any) {
    return (
      this.props.validator.address !== nextProps.validator.address ||
      this.props.synced !== nextProps.synced ||
      this.props.stake !== nextProps.stake
    );
  }

  render () {
    return (
      <ValidatorInner {...this.props} />
    )
  }
}

export default Validator;
