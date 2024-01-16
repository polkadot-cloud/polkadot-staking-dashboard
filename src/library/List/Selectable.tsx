// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { ButtonMonoInvert } from '@polkadot-cloud/react';
import { SelectableWrapper } from '.';
import { useList } from './context';
import type { SelectableProps } from './types';

export const Selectable = ({
  actionsAll,
  actionsSelected,
  canSelect,
  displayFor,
}: SelectableProps) => {
  const { t } = useTranslation('library');
  const provider = useList();
  const { isFastUnstaking } = useUnstaking();

  // Get list provider props.
  const { selectActive, setSelectActive, selected, selectToggleable } =
    provider;

  // Determine button style depending on in canvas. Same for now, may change as design evolves.
  const ButtonType =
    displayFor === 'canvas' ? ButtonMonoInvert : ButtonMonoInvert;

  return (
    <SelectableWrapper>
      {selectToggleable === true ? (
        <ButtonType
          text={selectActive ? t('cancel') : t('select')}
          disabled={!canSelect || isFastUnstaking}
          onClick={() => {
            setSelectActive(!selectActive);
          }}
          marginRight
        />
      ) : null}
      {selected.length > 0 ? (
        <>
          {actionsSelected.map((a, i: number) => (
            <ButtonType
              key={`a_selected_${i}`}
              text={a.title}
              disabled={
                isFastUnstaking || (a?.isDisabled ? a.isDisabled() : false)
              }
              onClick={() => a.onClick(provider)}
              marginRight
            />
          ))}
        </>
      ) : null}
      {actionsAll.map((a, i: number) => (
        <ButtonType
          text={a.title}
          key={`a_all_${i}`}
          disabled={isFastUnstaking || (a?.isDisabled ? a.isDisabled() : false)}
          onClick={() => a.onClick(provider)}
          iconLeft={a.icon ? a.icon : undefined}
          marginRight
        />
      ))}
    </SelectableWrapper>
  );
};
