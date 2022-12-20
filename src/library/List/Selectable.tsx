// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useUnstaking from 'library/Hooks/useUnstaking';
import { useTranslation } from 'react-i18next';
import { SelectableWrapper } from '.';
import { useList } from './context';

export const Selectable = ({ actionsAll, actionsSelected, canSelect }: any) => {
  const provider = useList();
  const { isFastUnstaking } = useUnstaking();

  const { t } = useTranslation('library');
  // get list provider props
  const { selectActive, setSelectActive, selected, selectToggleable } =
    provider;

  return (
    <SelectableWrapper>
      {selectToggleable === true ? (
        <button
          type="button"
          disabled={!canSelect || isFastUnstaking}
          onClick={() => {
            setSelectActive(!selectActive);
          }}
        >
          {selectActive ? t('cancel') : t('select')}
        </button>
      ) : null}
      {selected.length > 0 ? (
        <>
          {actionsSelected.map((a: any, i: number) => (
            <button
              key={`a_selected_${i}`}
              disabled={
                isFastUnstaking || (a?.isDisabled ? a.isDisabled() : false)
              }
              type="button"
              onClick={() => a.onClick(provider)}
            >
              {a.title}
            </button>
          ))}
        </>
      ) : null}
      {actionsAll.map((a: any, i: number) => (
        <button
          key={`a_all_${i}`}
          disabled={isFastUnstaking || (a?.isDisabled ? a.isDisabled() : false)}
          type="button"
          onClick={() => a.onClick(provider)}
        >
          {a.icon ? <FontAwesomeIcon icon={a.icon} /> : null}
          {a.title}
        </button>
      ))}
    </SelectableWrapper>
  );
};
