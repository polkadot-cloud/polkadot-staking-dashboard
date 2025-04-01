// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePrompt } from 'contexts/Prompt'
import { Html5Qrcode } from 'html5-qrcode'
import type { ReactElement } from 'react'
import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { ScanWrapper } from './Wrappers.js'
import type { ScanProps } from './types.js'
import { createImgSize } from './util.js'

const DEFAULT_ERROR = (error: string): void => {
  throw new Error(error)
}

const QrScanInner = ({
  className = '',
  onError = DEFAULT_ERROR,
  onScan,
  size,
}: ScanProps): ReactElement<ScanProps> => {
  const containerStyle = useMemo(() => createImgSize(size), [size])

  const onErrorCallback = useCallback(
    (error: string) => onError(error),
    [onError]
  )

  const onScanCallback = useCallback(
    (data: string | null) => data && onScan(data),
    [onScan]
  )

  return (
    <ScanWrapper className={className} style={containerStyle}>
      <Html5QrCodePlugin
        fps={10}
        qrCodeSuccessCallback={onScanCallback}
        qrCodeErrorCallback={onErrorCallback}
      />
    </ScanWrapper>
  )
}

export const QrScan = memo(QrScanInner)

interface Html5QrScannerProps {
  fps: number
  qrCodeSuccessCallback: (data: string | null) => void
  qrCodeErrorCallback: (error: string) => void
}

export const Html5QrCodePlugin = ({
  fps,
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
}: Html5QrScannerProps) => {
  const { setOnClosePrompt } = usePrompt()

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)

  // Reference of the HTML element used to scan the QR code.
  const ref = useRef<HTMLDivElement | null>(null)

  const handleHtmlQrCode = async (): Promise<void> => {
    if (!ref.current || !html5QrCodeRef.current) {
      return
    }

    try {
      const devices = await Html5Qrcode.getCameras()

      if (devices && devices.length) {
        const cameraId = devices[0].id
        await html5QrCodeRef.current.start(
          cameraId,
          {
            fps,
          },
          (decodedText) => {
            // do something when code is read
            qrCodeSuccessCallback(decodedText)
          },
          (errorMessage) => {
            // parse error
            qrCodeErrorCallback(errorMessage)
          }
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (ref.current) {
      html5QrCodeRef.current = new Html5Qrcode(ref.current.id)
      setOnClosePrompt(() => {
        html5QrCodeRef.current?.stop()
      })
      handleHtmlQrCode()
    }
    return () => {
      try {
        if (html5QrCodeRef.current) {
          html5QrCodeRef.current.stop()
        }
      } catch (err) {
        // Silently ignore error
      }
    }
  }, [])

  return <div ref={ref} id="html5qr-code-full-region" />
}
