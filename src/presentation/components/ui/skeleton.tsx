import { cn } from "@/shared/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circle' | 'text'
  animate?: boolean
}

function Skeleton({
  className,
  variant = 'default',
  animate = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-muted',
        animate && 'animate-pulse',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'default' && 'rounded-md',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
