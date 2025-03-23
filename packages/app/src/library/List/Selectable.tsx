// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useList } from 'contexts/List'
import { useUnstaking } from 'hooks/useUnstaking'
import { ButtonMonoInvert } from 'ui-buttons'
import { SelectableWrapper } from '.'
import type { SelectableProps } from './types'

export const Selectable = ({
  actionsAll,
  actionsSelected,
  displayFor,
}: SelectableProps) => {
  const provider = useList()
  const { isFastUnstaking } = useUnstaking()

  // Get list provider props.
  const { selected } = provider

  // Determine button style depending on in canvas. Same for now, may change as design evolves.
  const ButtonType =
    displayFor === 'canvas' ? ButtonMonoInvert : ButtonMonoInvert

  return (
    <SelectableWrapper className="list">
      {selected.length > 0 && (
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
      )}
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
  )
}
