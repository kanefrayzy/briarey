'use client'

import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

const fieldClass =
  'w-full bg-transparent px-4 py-3 text-white text-sm placeholder:text-white/70 focus:outline-none transition-colors rounded'
const defaultStyle = { border: '1px solid white' }

interface BaseProps {
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  multiline?: false
  rows?: never
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  multiline: true
  rows?: number
}

type CheckoutFieldProps = InputProps | TextareaProps

export default function CheckoutField(props: CheckoutFieldProps) {
  if (props.multiline) {
    const { multiline: _m, className = '', rows = 4, style, ...rest } = props as TextareaProps
    return (
      <textarea
        rows={rows}
        className={`${fieldClass} resize-none ${className}`}
        style={{ ...defaultStyle, ...style }}
        {...rest}
      />
    )
  }
  const { multiline: _m, className = '', style, ...rest } = props as InputProps
  return (
    <input
      className={`${fieldClass} ${className}`}
      style={{ ...defaultStyle, ...style }}
      {...rest}
    />
  )
}
