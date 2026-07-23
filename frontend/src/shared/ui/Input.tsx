import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.memo(React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...rest }, ref) => {
  return <input ref={ref} className={`border rounded px-3 py-2 ${className}`} {...rest} />
}))

Input.displayName = 'Input'
export default Input
