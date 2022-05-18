// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faUserSlash,
  faChartLine,
  faThumbtack,
} from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Wrapper } from './Wrapper';
import Identicon from '../Identicon';
import { clipAddress } from '../../Utils';
import { useApi } from '../../contexts/Api';
import { useModal } from '../../contexts/Modal';
import { useValidators } from '../../contexts/Validators/Validators';
import { getIdentityDisplay } from './Utils';
import { useNotifications } from '../../contexts/Notifications';

export const ValidatorInner = (props: any) => {
  const { consts, network }: any = useApi();
  const { openModalWith } = useModal();
  const { addNotification } = useNotifications();
  const { favourites, addFavourite, removeFavourite } = useValidators();
  const {
    initial,
    validator,
    synced,
    identity,
    superIdentity,
    stake,
    toggleFavourites,
  } = props;

  const { address, prefs } = validator;

  const display = getIdentityDisplay(identity, superIdentity);
  const commission = prefs?.commission ?? null;
  const blocked = prefs?.blocked ?? null;

  const total_nominations = stake?.total_nominations ?? 0;
  const lowest = stake?.lowest ?? 0;

  // copy address notification
  const notificationCopyAddress =
    address == null
      ? {}
      : {
          title: 'Address Copied to Clipboard',
          subtitle: address,
        };

  // favourite toggle notification
  const notificationFavourite = !favourites.includes(address)
    ? {
        title: 'Favourite Validator Added',
        subtitle: address,
      }
    : {
        title: 'Favourite Validator Removed',
        subtitle: address,
      };

  return (
    <Wrapper>
      <div>
        <Identicon value={address} size={26} />

        {synced.identities && (
          <>
            {display !== null && (
              <>
                {initial ? (
                  <motion.div
                    className="identity"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4>{display}</h4>
                  </motion.div>
                ) : (
                  <div className="identity">
                    <h4>{display}</h4>
                  </div>
                )}
              </>
            )}
            {display === null && (
              <>
                {initial ? (
                  <motion.div
                    className="identity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4>{clipAddress(address)}</h4>
                  </motion.div>
                ) : (
                  <div className="identity">
                    <h4>{clipAddress(address)}</h4>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <div className="labels">
          {synced.stake &&
            total_nominations >= consts.maxNominatorRewardedPerValidator && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                <div className="label warning">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    transform="shrink-2"
                  />
                  &nbsp;
                  {lowest} {network.unit}
                </div>
              </motion.div>
            )}
          {prefs !== undefined && (
            <>
              {blocked && (
                <div className="label">
                  <FontAwesomeIcon
                    icon={faUserSlash}
                    color="#d2545d"
                    transform="shrink-1"
                  />
                </div>
              )}
              <div className="label">{commission}%</div>
            </>
          )}
          <div className="label">
            <button
              type="button"
              onClick={() =>
                openModalWith('EraPoints', {
                  address,
                  identity: display,
                })
              }
            >
              <FontAwesomeIcon icon={faChartLine} />
            </button>
          </div>
          <div className="label">
            <button
              type="button"
              onClick={() => addNotification(notificationCopyAddress)}
            >
              <CopyToClipboard text={address}>
                <FontAwesomeIcon icon={faCopy as IconProp} />
              </CopyToClipboard>
            </button>
          </div>
          {toggleFavourites && (
            <div className="label">
              <button
                type="button"
                className={favourites.includes(address) ? 'active' : undefined}
                onClick={() => {
                  if (favourites.includes(address)) {
                    removeFavourite(address);
                  } else {
                    addFavourite(address);
                  }
                  addNotification(notificationFavourite);
                }}
              >
                <FontAwesomeIcon icon={faThumbtack} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export class Validator extends React.Component<any, any> {
  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      this.props.validator.address !== nextProps.validator.address ||
      this.props.synced !== nextProps.synced ||
      this.props.stake !== nextProps.stake
    );
  }

  render() {
    return <ValidatorInner {...this.props} />;
  }
}

export default Validator;
