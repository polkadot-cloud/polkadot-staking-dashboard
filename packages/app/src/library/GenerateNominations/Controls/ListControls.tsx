// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useList } from 'contexts/List'
import { useTheme } from 'contexts/Themes'
import { useUnstaking } from 'hooks/useUnstaking'
import { SelectableWrapper } from 'library/List'
import { useState } from 'react'
import { ButtonMonoInvert, ButtonPrimaryInvert } from 'ui-buttons'
import { Popover } from 'ui-core/popover'
import type { ListControlsProps } from './types'

export const ListControls = ({
  selectHandlers,
  filterHandlers,
}: ListControlsProps) => {
  const provider = useList()
  const { themeElementRef } = useTheme()
  const { isFastUnstaking } = useUnstaking()

  // Get selected items
  const { selected, resetSelected } = provider

  // Popover open states
  const [opens, setOpens] = useState<Record<string, boolean>>({})

  return (
    <SelectableWrapper>
      {selected.length > 0 && (
        <>
          {Object.entries(selectHandlers).map(([k, a], i: number) => {
            const open = opens[k] || false
            const Content = a.popover.node
            const text = a.popover.text
            return (
              <Popover
                open={open}
                key={`a_selected_${i}`}
                portalContainer={themeElementRef.current || undefined}
                onTriggerClick={() => {
                  setOpens({ ...opens, [k]: true })
                }}
                content={
                  <Content
                    text={text}
                    controlKey={k}
                    onClose={() => setOpens({ ...opens, [k]: false })}
                    onRevert={() => {
                      a.popover.callback({ selected, callback: resetSelected })
                      setOpens({ ...opens, [k]: false })
                    }}
                  />
                }
              >
                <ButtonPrimaryInvert text={a.title} asLabel marginRight />
              </Popover>
            )
          })}
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
