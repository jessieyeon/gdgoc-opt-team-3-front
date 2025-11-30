import { Button } from '@/components/ui/button'

export function SubjectFilter({ subjects = [], selected = '전체', onSelect = () => {} }) {
  const list = subjects.length ? subjects : ['전체']

  return (
    <div className="flex flex-wrap gap-2">
      {list.map((subject) => {
        const isActive = selected === subject
        return (
          <Button
            key={subject}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(subject)}
            className={isActive ? 'rounded-full bg-[#0f4a84] hover:bg-[#0f4a84]/90 text-white' : 'rounded-full'}
          >
            {subject}
          </Button>
        )
      })}
    </div>
  )
}

