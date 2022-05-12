// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Wrapper } from './Wrapper';
import Identicon from '../Identicon';
import { clipAddress } from '../../Utils';
import { motion } from 'framer-motion';
import { useApi } from '../../contexts/Api';
import { useModal } from '../../contexts/Modal';
import { useValidators } from '../../contexts/Validators/Validators';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIdentityDisplay } from './Utils';
import { faExclamationTriangle, faUserSlash, faChartLine, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useNotifications } from '../../contexts/Notifications';

export const ValidatorInner = (props: any) => {

  const { consts, network }: any = useApi();
  const { openModalWith } = useModal();
  const { addNotification } = useNotifications();
  const { favourites, addFavourite, removeFavourite } = useValidators();
  const { initial, validator, synced, identity, superIdentity, stake, toggleFavourites } = props;

  let { address, prefs } = validator;

  let display = getIdentityDisplay(identity, superIdentity);
  let commission = prefs?.commission ?? null;
  let blocked = prefs?.blocked ?? null;

  let total_nominations = stake?.total_nominations ?? 0;
  let lowest = stake?.lowest ?? 0;

  // click to copy notification
  let notification = {};
  if (address !== null) {
    notification = {
      title: 'Address Copied to Clipboard',
      subtitle: address,
    };
  }

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
                  transition={{ duration: 0.3 }}
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
              transition={{ duration: 0.1 }}
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
          <label>
            <button onClick={() => addNotification(notification)}>
              <CopyToClipboard text={address}>
                <FontAwesomeIcon icon={faCopy} />
              </CopyToClipboard>
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
