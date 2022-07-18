// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faServer,
  faExternalLink,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ItemWrapper } from './Wrappers';
import { useCommunitySections } from './context';

export const Item = (props: any) => {
  const { network } = useApi();

  const { item, actionable } = props;
  const {
    name,
    email,
    twitter,
    website,
    Thumbnail,
    validators: entityAllValidators,
  } = item;
  const validatorCount =
    entityAllValidators[network.name.toLowerCase()].length ?? 0;

  const { setActiveSection, setActiveItem, setScrollPos } =
    useCommunitySections();

  const listItem = {
    hidden: {
      opacity: 0,
      y: 25,
      transition: {
        duration: 0.4,
      },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        type: 'spring',
        bounce: 0.2,
      },
    },
  };

  return (
    <ItemWrapper
      whileHover={{ scale: actionable ? 1.005 : 1 }}
      variants={listItem}
    >
      <div className="inner">
        <section>{Thumbnail !== null && <Thumbnail />}</section>
        <section>
          <h2>
            {name}
            <button type="button" onClick={() => {}} className="active">
              <span>Bio</span>
            </button>
          </h2>

          <div className="stats">
            <button
              className={actionable ? 'active' : undefined}
              disabled={!actionable}
              type="button"
              onClick={() => {
                if (actionable) {
                  setActiveSection(1);
                  setActiveItem(item);
                  setScrollPos(window.scrollY);
                }
              }}
            >
              <FontAwesomeIcon
                icon={faServer}
                className="icon-left"
                transform="shrink-1"
              />
              <h3>
                {validatorCount} Validator
                {validatorCount !== 1 && 's'}
              </h3>
            </button>
            {email !== undefined && (
              <button
                type="button"
                className="active"
                onClick={() => {
                  window.open(`mailto:${email}`, '_blank');
                }}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  transform="shrink-1"
                  className="icon-left"
                />
                <h3>email</h3>
                <FontAwesomeIcon
                  icon={faExternalLink}
                  className="icon-right"
                  transform="shrink-3"
                />
              </button>
            )}
            {twitter !== undefined && (
              <button
                type="button"
                className="active"
                onClick={() => {
                  window.open(`https://twitter.com/@${twitter}`, '_blank');
                }}
              >
                <FontAwesomeIcon
                  icon={faTwitter as IconProp}
                  className="icon-left"
                />
                <h3>{twitter}</h3>
                <FontAwesomeIcon
                  icon={faExternalLink}
                  className="icon-right"
                  transform="shrink-3"
                />
              </button>
            )}
            {website !== undefined && (
              <button
                type="button"
                className="active"
                onClick={() => {
                  window.open(website, '_blank');
                }}
              >
                <h3>website</h3>
                <FontAwesomeIcon
                  icon={faExternalLink}
                  className="icon-right"
                  transform="shrink-3"
                />
              </button>
            )}
          </div>
        </section>
      </div>
    </ItemWrapper>
  );
};

export default Item;
