'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, useEffect, useState } from 'react'

interface BaseProps {
  label: string
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  multiline?: false
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  multiline: true
  rows?: number
}

type FormInputProps = InputProps | TextareaProps

export default function FormInput(props: FormInputProps) {
  const { label } = props
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState('')

  // Sync internal label-float state when external value changes (e.g. programmatic prefill)
  const externalValue = (props as { value?: unknown }).value
  useEffect(() => {
    if (externalValue !== undefined) setValue(String(externalValue ?? ''))
  }, [externalValue])

  const floated = focused || value.length > 0

  const inputClass =
    'w-full bg-transparent border-b border-white/20 pt-5 pb-2 text-white text-sm focus:outline-none focus:border-white/60 transition-colors'

  if (props.multiline) {
    const { label: _l, multiline: _m, rows = 3, onChange, onFocus, onBlur, ...rest } = props as TextareaProps
    return (
      <div className="relative">
        <label
          className="absolute left-0 transition-all duration-200 pointer-events-none"
          style={{
            top: floated ? 0 : '20px',
            fontSize: floated ? '11px' : '14px',
            color: focused ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)',
          }}
        >
          {label}
        </label>
        <textarea
          rows={rows}
          value={value}
          className={`${inputClass} resize-none`}
          onFocus={(e) => { setFocused(true); onFocus?.(e) }}
          onBlur={(e) => { setFocused(false); onBlur?.(e) }}
          onChange={(e) => { setValue(e.target.value); onChange?.(e) }}
          {...rest}
        />
      </div>
    )
  }

  const { label: _l, multiline: _m, onChange, onFocus, onBlur, ...rest } = props as InputProps
  return (
    <div className="relative">
      <label
        className="absolute left-0 transition-all duration-200 pointer-events-none"
        style={{
          top: floated ? 0 : '20px',
          fontSize: floated ? '11px' : '14px',
          color: focused ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)',
        }}
      >
        {label}
      </label>
      <input
        value={value}
        className={inputClass}
        onFocus={(e) => { setFocused(true); onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); onBlur?.(e) }}
        onChange={(e) => { setValue(e.target.value); onChange?.(e) }}
        {...rest}
      />
    </div>
  )
}
