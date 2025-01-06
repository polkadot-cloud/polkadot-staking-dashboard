// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DotLottie } from '@lottiefiles/dotlottie-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import type { AnyJson } from '@w3ux/types'
import { useTheme } from 'contexts/Themes'
import { useEffect, useRef } from 'react'

export const useDotLottieButton = (filename: string, options: AnyJson = {}) => {
  const { mode } = useTheme()

  const lottieRef = useRef<AnyJson>(null)
  const refsInitialised = useRef<boolean>(false)

  const lottieRefCallback = (dotLottie: DotLottie) => {
    lottieRef.current = dotLottie
  }

  const handlePlayAnimation = async () => {
    if (!lottieRef.current) {
      return
    }
    lottieRef.current.play()
  }

  const handleComplete = (r: AnyJson) => {
    if (options?.autoLoop !== true) {
      r?.stop()
    }
  }
  useEffect(() => {
    if (!lottieRef.current || refsInitialised.current) {
      return
    }
    refsInitialised.current = true
    lottieRef.current.addEventListener('loop', () =>
      handleComplete(lottieRef.current)
    )
  }, [lottieRef.current, refsInitialised.current])

  useEffect(() => {
    refsInitialised.current = false
  }, [options?.deps])

  const autoplay = options?.autoLoop ? true : undefined

  const icon = (
    <button
      type="button"
      style={{
        ...options?.style,
        height: 'inherit',
        width: 'inherit',
      }}
      onClick={() => handlePlayAnimation()}
    >
      <DotLottieReact
        dotLottieRefCallback={lottieRefCallback}
        loop
        autoplay={autoplay}
        src={`${import.meta.env.BASE_URL}lottie/${filename}-${mode}.lottie`}
        renderConfig={{
          autoResize: true,
        }}
      />
    </button>
  )

  return { icon, play: handlePlayAnimation }
}
