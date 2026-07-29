import { cn } from '@/lib/utils'

export interface FassPageTitleProps {
  title: string
  description?: string
  className?: string
}

/** Shell 헤더가 h1을 쓰므로 화면 안 제목은 h2로 둔다 */
function FassPageTitle({ title, description, className }: FassPageTitleProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <h2 className="fass-title-page m-0">{title}</h2>
      {description ? <span className="fass-muted leading-snug">{description}</span> : null}
    </div>
  )
}

export { FassPageTitle }
