// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DotLottie } from '@lottiefiles/dotlottie-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import type { AnyJson } from '@w3ux/types'
import { useTheme } from 'contexts/Themes'
import { useEffect, useRef } from 'react'

export const useDotLottieButton = (
  filename: string,
  options: { autoLoop?: boolean } = {}
) => {
  const { mode } = useTheme()
  const lottieRef = useRef<AnyJson>(null)
  const refsInitialised = useRef<boolean>(false)

  const lottieRefCallback = (dotLottie: DotLottie) => {
    lottieRef.current = dotLottie
  }

  const handlePlayAnimation = async () => {
    lottieRef.current?.play()
  }

  const handleComplete = () => {
    if (options?.autoLoop !== true) {
      lottieRef.current?.stop()
    }
  }
  useEffect(() => {
    if (!lottieRef.current || refsInitialised.current) {
      return
    }
    refsInitialised.current = true
    lottieRef.current.addEventListener('loop', () => handleComplete())
  }, [lottieRef.current, refsInitialised.current])

  const icon = (
    <button
      type="button"
      style={{
        height: 'inherit',
        width: 'inherit',
      }}
      onClick={() => handlePlayAnimation()}
    >
      <DotLottieReact
        dotLottieRefCallback={lottieRefCallback}
        loop
        autoplay={options?.autoLoop ? true : undefined}
        src={`${import.meta.env.BASE_URL}lottie/${filename}-${mode}.lottie`}
        renderConfig={{
          autoResize: true,
        }}
      />
    </button>
  )

  return { icon, play: handlePlayAnimation }
}
