import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FassButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const VARIANT_CLASS = {
  primary: 'is-primary',
  secondary: 'is-secondary',
  danger: 'is-danger',
  ghost: 'is-ghost',
}

const SIZE_CLASS = { xs: 'is-xs', sm: 'is-sm', md: '', lg: 'is-lg' }

/** 차세대 소스의 FassButton 계약을 앱의 .fass-btn 토큰 클래스로 잇는 어댑터 */
function FassButton({
  variant = 'secondary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: FassButtonProps) {
  return (
    <button
      type={type}
      className={cn('fass-btn', VARIANT_CLASS[variant], SIZE_CLASS[size], className)}
      {...props}
    />
  )
}

export { FassButton }
