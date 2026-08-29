import { cn } from '@/lib/utils'
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'warning' | 'success'
}

export function Alert({ className, variant = 'default', children, ...props }: AlertProps) {
  return (
    <div
      className={cn(
'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:-translate-y-0.75 has-[svg]:pl-11',

        {
          'bg-background text-foreground': variant === 'default',
          'border-destructive/50 text-destructive dark:border-destructive': variant === 'destructive',
          'border-yellow-500/50 text-yellow-700 dark:text-yellow-400': variant === 'warning',
          'border-green-500/50 text-green-700 dark:text-green-400': variant === 'success',
        },
        className
      )}
      {...props}
    >
      {variant === 'destructive' && <AlertCircle className="h-4 w-4" />}
      {variant === 'warning' && <AlertTriangle className="h-4 w-4" />}
      {variant === 'success' && <CheckCircle className="h-4 w-4" />}
      {variant === 'default' && <Info className="h-4 w-4" />}
      <div className="text-sm font-medium">{children}</div>
    </div>
  )
}