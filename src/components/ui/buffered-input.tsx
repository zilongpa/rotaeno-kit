import { Input, InputProps } from '@/components/ui/input'
import { closeTo } from '@/lib/number'
import { forwardRef, useEffect, useRef, useState } from 'react'

export type BufferedInputProps<T> = Omit<InputProps, 'defaultValue' | 'value'> & {
  value: T
  transformFromT: (value: T) => string
  transformToT: (value: string) => T
  renderValue?: (value: T) => string
  onValueChange?: (value: T) => void
  selectAllOnClick?: boolean
}

const BufferedInputImpl = <T = string,>(
  {
    value,
    transformFromT,
    transformToT,
    renderValue,
    onValueChange,
    ...props
  }: BufferedInputProps<T>,
  ref: React.Ref<HTMLInputElement>
) => {
  const [focused, setFocused] = useState(false)
  const [inputValue, setInputValue] = useState(transformFromT(value))
  const lastMouseDownPosition = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    setInputValue(transformFromT(value))
  }, [value, transformFromT])

  const displayValue = renderValue ? renderValue(value) : inputValue

  return (
    <Input
      {...props}
      ref={ref}
      value={focused ? inputValue : displayValue}
      onPointerDown={(e) => {
        lastMouseDownPosition.current = { x: e.clientX, y: e.clientY }
        props.onPointerDown?.(e)
      }}
      onPointerUp={(e) => {
        if (
          lastMouseDownPosition.current &&
          closeTo(lastMouseDownPosition.current.x, e.clientX, 5) &&
          closeTo(lastMouseDownPosition.current.y, e.clientY, 5) &&
          props.selectAllOnClick
        ) {
          e.currentTarget.select()
        }
        lastMouseDownPosition.current = null
        props.onPointerUp?.(e)
      }}
      onChange={(e) => {
        setInputValue(e.target.value)
      }}
      onFocus={(e) => {
        setFocused(true)
        props.onFocus?.(e)
        // select all text
        e.target.select()
      }}
      onBlur={(e) => {
        setFocused(false)
        if (onValueChange && transformToT) {
          onValueChange(transformToT(inputValue))
        }
        props.onBlur?.(e)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onValueChange && transformToT) {
          onValueChange(transformToT(inputValue))
          e.currentTarget.blur()
        }
        props.onKeyDown?.(e)
      }}
    />
  )
}

// https://stackoverflow.com/a/58473012/8829241
export const BufferedInput = forwardRef(BufferedInputImpl) as <T>(
  p: BufferedInputProps<T> & { ref?: React.Ref<HTMLInputElement> }
) => React.ReactElement
