// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { SelectableWrapper } from '.';
import { useList } from './context';

export const Selectable = (props: any) => {
  const { actionsAll, actionsSelected } = props;

  const provider = useList();
  // get list provider props
  const { selectActive, setSelectActive, selected, selectToggleable } =
    provider;

  return (
    <SelectableWrapper>
      {actionsAll.map((a: any, i: number) => (
        <button
          key={`a_all_${i}`}
          disabled={a.disabled ?? false}
          type="button"
          onClick={() => a.onClick(provider)}
        >
          {a.title}
        </button>
      ))}
      {selectToggleable === true && (
        <button
          type="button"
          onClick={() => {
            setSelectActive(!selectActive);
          }}
        >
          {selectActive ? 'Cancel Selection' : 'Select'}
        </button>
      )}

      {selected.length > 0 && (
        <>
          {actionsSelected.map((a: any, i: number) => (
            <button
              key={`a_selected_${i}`}
              disabled={a.disabled ?? false}
              type="button"
              onClick={() => a.onClick(provider)}
            >
              {a.title}
            </button>
          ))}
        </>
      )}
    </SelectableWrapper>
  );
};
