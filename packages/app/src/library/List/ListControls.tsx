// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useList } from 'contexts/List'
import { useUnstaking } from 'hooks/useUnstaking'
import { ButtonMonoInvert, ButtonPrimaryInvert } from 'ui-buttons'
import { SelectableWrapper } from '.'
import type { SelectableProps } from './types'

export const ListControls = ({
  selectHandlers,
  filterHandlers,
}: SelectableProps) => {
  const provider = useList()
  const { isFastUnstaking } = useUnstaking()

  // Get list provider props.
  const { selected } = provider

  return (
    <SelectableWrapper className="list">
      {selected.length > 0 && (
        <>
          {selectHandlers.map((a, i: number) => (
            <ButtonPrimaryInvert
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
      {filterHandlers.map((a, i: number) => (
        <ButtonMonoInvert
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
