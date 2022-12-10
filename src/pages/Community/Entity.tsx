// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ButtonSecondary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import ValidatorList from 'library/ValidatorList';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper, TopBarWrapper } from 'Wrappers';
import { useCommunitySections } from './context';
import { Item } from './Item';
import { ItemsWrapper } from './Wrappers';

export const Entity = () => {
  const { isReady, network } = useApi();
  const { validators: allValidators, removeValidatorMetaBatch } =
    useValidators();
  const { setActiveSection, activeItem } = useCommunitySections();
  const { t } = useTranslation('pages');

  const { name, validators: entityAllValidators } = activeItem;
  const validators = entityAllValidators[network.name.toLowerCase()] ?? [];

  // include validators that exist in `erasStakers`
  const [activeValidators, setActiveValidators] = useState(
    allValidators.filter((v) => validators.includes(v.address))
  );

  useEffect(() => {
    setActiveValidators(
      allValidators.filter((v) => validators.includes(v.address))
    );
  }, [allValidators, network]);

  useEffect(() => {
    removeValidatorMetaBatch(batchKey);
    const newValidators = [...activeValidators];
    setActiveValidators(newValidators);
  }, [name, activeItem, network]);

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
        <ButtonSecondary
          lg
          text={t('community.go_back')}
          iconLeft={faChevronLeft}
          iconTransform="shrink-3"
          onClick={() => setActiveSection(0)}
        />
      </TopBarWrapper>
      <ItemsWrapper variants={container} initial="hidden" animate="show">
        <Item item={activeItem} actionable={false} />
      </ItemsWrapper>
      <CardWrapper>
        {!isReady ? (
          <div className="item">
            <h3>{t('community.connecting')}...</h3>
          </div>
        ) : (
          <>
            {activeValidators.length === 0 && (
              <div className="item">
                <h3>
                  {validators.length
                    ? `${t('community.fetching_validators')}...`
                    : t('community.no_validators')}
                </h3>
              </div>
            )}
            {activeValidators.length > 0 && (
              <ValidatorList
                bondType="stake"
                validators={activeValidators}
                batchKey={batchKey}
                title={`${name} ${t('community.validators')}`}
                selectable={false}
                allowMoreCols
                pagination
                toggleFavorites
                allowFilters
                refetchOnListUpdate
              />
            )}
          </>
        )}
      </CardWrapper>
    </PageRowWrapper>
  );
};

export default Entity;
