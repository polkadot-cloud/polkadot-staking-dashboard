import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonPrimary } from '@polkadot-cloud/react';
import { useApi } from 'contexts/Api';
import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators';
import type { Validator } from 'contexts/Validators/types';
import { Identity } from 'library/ListItem/Labels/Identity';
import { SelectWrapper } from 'library/ListItem/Wrappers';
import { Title } from 'library/Prompt/Title';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FooterWrapper, PromptListItem } from 'library/Prompt/Wrappers';
import type { FavoritesPromptProps } from '../types';
import { NotificationsController } from 'static/NotificationsController';

export const FavoritesPrompt = ({
  callback,
  nominations,
}: FavoritesPromptProps) => {
  const { t } = useTranslation('modals');
  const { consts } = useApi();
  const { favoritesList } = useFavoriteValidators();
  const { maxNominations } = consts;

  // Store the total number of selected favorites.
  const [selected, setSelected] = useState<Validator[]>([]);

  const addToSelected = (item: Validator) =>
    setSelected([...selected].concat(item));

  const removeFromSelected = (items: Validator[]) =>
    setSelected([...selected].filter((item) => !items.includes(item)));

  const remaining = maxNominations
    .minus(nominations.length)
    .minus(selected.length);

  const canAdd = remaining.isGreaterThan(0);

  return (
    <>
      <Title title={t('nominateFavorites')} closeText={t('cancel')} />
      <div className="padded">
        {remaining.isLessThanOrEqualTo(0) ? (
          <h4 className="subheading">
            {t('moreFavoritesSurpassLimit', {
              max: maxNominations.toString(),
            })}
          </h4>
        ) : (
          <h4 className="subheading">
            {t('addUpToFavorites', { count: remaining.toNumber() })}.
          </h4>
        )}

        {favoritesList?.map((favorite: Validator, i) => {
          const inInitial = !!nominations.find(
            ({ address }) => address === favorite.address
          );
          const isDisabled =
            selected.includes(favorite) || !canAdd || inInitial;

          return (
            <PromptListItem
              key={`favorite_${i}`}
              className={isDisabled && inInitial ? 'inactive' : undefined}
            >
              <SelectWrapper
                disabled={inInitial}
                onClick={() => {
                  if (selected.includes(favorite)) {
                    removeFromSelected([favorite]);
                  } else {
                    addToSelected(favorite);
                  }
                }}
              >
                {(inInitial || selected.includes(favorite)) && (
                  <FontAwesomeIcon icon={faCheck} transform="shrink-2" />
                )}
              </SelectWrapper>
              <Identity key={`favorite_${i}`} address={favorite.address} />
            </PromptListItem>
          );
        })}

        <FooterWrapper>
          <ButtonPrimary
            text={t('addToNominations')}
            onClick={() => {
              callback(nominations.concat(selected));
              NotificationsController.emit({
                title: t('favoritesAddedTitle', { count: selected.length }),
                subtitle: t('favoritesAddedSubtitle', {
                  count: selected.length,
                }),
              });
            }}
            disabled={selected.length === 0}
          />
        </FooterWrapper>
      </div>
    </>
  );
};
