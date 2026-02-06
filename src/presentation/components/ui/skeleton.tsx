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
        'bg-gray-100',
        animate && 'animate-shimmer',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'default' && 'rounded-lg',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
