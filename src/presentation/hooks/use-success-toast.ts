'use client'

import { useState } from 'react'

export function useSuccessToast() {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('')

  const showSuccess = (msg: string) => {
    setMessage(msg)
    setShow(true)
  }

  const hideSuccess = () => {
    setShow(false)
  }

  return {
    show,
    message,
    showSuccess,
    hideSuccess,
  }
}
