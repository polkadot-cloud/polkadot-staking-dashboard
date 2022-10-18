// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import Button from 'library/Button';
import { CardWrapper } from 'library/Graphs/Wrappers';
import ValidatorList from 'library/ValidatorList';
import { useEffect, useState } from 'react';
import { shuffle } from 'Utils';
import { PageRowWrapper, TopBarWrapper } from 'Wrappers';
import { useCommunitySections } from './context';
import { Item } from './Item';
import { ItemsWrapper } from './Wrappers';

export const Entity = () => {
  const { isReady, network } = useApi();
  const { validators: allValidators, removeValidatorMetaBatch } =
    useValidators();
  const { setActiveSection, activeItem } = useCommunitySections();

  const { name, validators: entityAllValidators } = activeItem;
  const validators = entityAllValidators[network.name.toLowerCase()] ?? [];

  // include validators that exist in `erasStakers`
  const [shuffledValidators, setShuffledValidators] = useState(
    shuffle(allValidators.filter((v) => validators.includes(v.address)))
  );

  useEffect(() => {
    setShuffledValidators(
      allValidators.filter((v) => validators.includes(v.address))
    );
  }, [allValidators, network]);

  useEffect(() => {
    removeValidatorMetaBatch(batchKey);
    const newShuffledValidators = shuffle([...shuffledValidators]);
    setShuffledValidators(newShuffledValidators);
  }, [name, network]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  };

  const batchKey = 'community_entity_validators';

  return (
    <PageRowWrapper className="page-padding" noVerticalSpacer>
      <TopBarWrapper>
        <Button
          inline
          title="Go Back"
          icon={faChevronLeft}
          transform="shrink-3"
          onClick={() => setActiveSection(0)}
        />
      </TopBarWrapper>
      <ItemsWrapper variants={container} initial="hidden" animate="show">
        <Item item={activeItem} actionable={false} />
      </ItemsWrapper>
      <CardWrapper>
        {!isReady ? (
          <div className="item">
            <h3>Connecting...</h3>
          </div>
        ) : (
          <>
            {shuffledValidators.length === 0 && (
              <div className="item">
                <h3>
                  {validators.length
                    ? 'Fetching validators...'
                    : 'This entity contains no validators.'}
                </h3>
              </div>
            )}
            {shuffledValidators.length > 0 && (
              <ValidatorList
                bondType="stake"
                validators={shuffledValidators}
                batchKey={batchKey}
                title={`${name}'s Validators`}
                selectable={false}
                allowMoreCols
                pagination
                toggleFavorites
                allowFilters
              />
            )}
          </>
        )}
      </CardWrapper>
    </PageRowWrapper>
  );
};

export default Entity;
