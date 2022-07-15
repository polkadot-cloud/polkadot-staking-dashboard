// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRowWrapper, GoBackWrapper } from 'Wrappers';
import Button from 'library/Button';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useValidators } from 'contexts/Validators';
import ValidatorList from 'library/ValidatorList';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { ItemsWrapper } from './Wrappers';
import { Item } from './Item';
import { useCommunitySections } from './context';

export const Entity = () => {
  const { isReady } = useApi();
  const { validators: allValidators } = useValidators();
  const { setActiveSection, activeItem } = useCommunitySections();
  const { name, validators } = activeItem;

  // todo: ensure batch is fetched.
  // TODO: create a separate validator batch for this list.
  const entityValidators = allValidators.filter((v: any) =>
    validators.includes(v.address)
  );

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

  return (
    <PageRowWrapper className="page-padding">
      <GoBackWrapper>
        <Button
          inline
          title="Go Back"
          icon={faChevronLeft}
          transform="shrink-3"
          onClick={() => setActiveSection(0)}
        />
      </GoBackWrapper>
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
            {validators.length === 0 && (
              <div className="item">
                <h3>Fetching validators...</h3>
              </div>
            )}
            {validators.length > 0 && (
              <ValidatorList
                validators={entityValidators}
                batchKey="validators_browse"
                title={`${name}'s Validators`}
                selectable={false}
                allowMoreCols
                allowFilters
                pagination
                toggleFavourites
              />
            )}
          </>
        )}
      </CardWrapper>
    </PageRowWrapper>
  );
};

export default Entity;
