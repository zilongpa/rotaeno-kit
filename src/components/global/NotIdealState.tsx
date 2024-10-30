import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { CircleSlashedIcon } from 'lucide-react'
import { forwardRef, HTMLAttributes } from 'react'

const notIdealStateVariants = cva(
  'flex flex-col items-center justify-center gap-2 text-muted-foreground',
  {
    variants: {
      variant: {
        default: '',
        filled: 'bg-muted/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface NotIdealStateProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notIdealStateVariants> {}

export const NotIdealState = forwardRef<HTMLDivElement, NotIdealStateProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div className={cn(notIdealStateVariants({ variant, className }))} ref={ref} {...props}>
      <CircleSlashedIcon className="size-4" />
      <div>{children}</div>
    </div>
  )
)
NotIdealState.displayName = 'NotIdealState'
