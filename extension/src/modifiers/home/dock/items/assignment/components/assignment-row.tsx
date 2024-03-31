import * as time from '@/utils/time'
import { t } from "@/utils/i18n"
import { Anchor } from "@/components/anchor"
import { Truncated } from "@/components/truncated"
import { Assignment } from "../types/assignment"
import { useEffect, useRef, useState } from "react"
import { dynamicStore } from "../store"
import { cn } from '@/lib/utils'
import { CaretDownIcon, CaretUpIcon, EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { getAssignmentPhase } from '../phase'
import { Phase } from '../types/phase'
import { o } from '@/stores/options'

const classNames: Record<Phase, string> = {
  over: 'bg-purple-200/50',
  moment: 'bg-red-200/50',
  around: 'bg-yellow-200/50',
  about: 'bg-green-200/50',
  long: 'bg-slate-50/50',
}

const columns = ['type', 'title', 'course', 'deadline'] as const
export type Column = (typeof columns)[number]

const AssignmentHeaderCell = (props: {
  column: Column
  ascending: boolean | null
  onClick: (column: Column) => void
}) => (
  <div className='p-2 flex' onClick={() => props.onClick(props.column)} role='button' tabIndex={0}>
    <div className='flex-1'>{t(`home_assignments_assignment_${props.column}`)}</div>
    {props.ascending !== null && (props.ascending ? (
      <CaretUpIcon />
    ) : (
      <CaretDownIcon />
    ))}
  </div>
)

export const AssignmentHeader = (props: {
  sortBy: Column
  setSortBy: (column: Column) => void
  ascending: boolean
  setAscending: (ascending: boolean) => void
}) => {
  const handleClick = (column: Column) => {
    if (props.sortBy === column) {
      props.setAscending(!props.ascending)
    }
    else {
      props.setSortBy(column)
      props.setAscending(true)
    }
  }

  return (
    <div className="bg-primary text-primary-foreground text-center font-bold col-span-full grid grid-cols-subgrid">
      <div className=' col-start-[-5] col-end-[-1] grid grid-cols-subgrid'>
        {columns.map(column => (
          <AssignmentHeaderCell column={column} ascending={props.sortBy === column ? props.ascending : null} onClick={handleClick} key={column} />
        ))}
      </div>
    </div>
  )
}

const Deadline = (props: {
  deadline: Date | null
}) => {
  const getDeadlineParams = (now: number) => {
    if (props.deadline === null) {
      return null
    }

    const delta = props.deadline.getTime() - now
    const dayCount = time.dayCount(delta)

    if (dayCount > 2) {
      return {
        countingDown: false,
        deadlineText: Math.floor(dayCount).toString()
      }
    } else if (dayCount > 0) {
      return {
        countingDown: true,
        deadlineText: time.toString(delta, false)
      }
    }

    return null
  }

  const [now, setNow] = useState(Date.now())
  const deadlineParams = getDeadlineParams(now)

  useEffect(() => {
    if (deadlineParams === null) {
      return
    }

    // Update deadline label per 1 second if `countingDown` is true, otherwise per 1 hour.
    const interval = deadlineParams.countingDown ? 1000 : 3600 * 1000
    const timerId = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(timerId)
  }, [props.deadline, deadlineParams?.countingDown])

  if (deadlineParams === null) {
    return
  }

  const { countingDown, deadlineText } = deadlineParams
  const text = countingDown ? deadlineText : t('home_assignments_assignment_deadline_day_count', deadlineText)

  return (
    <div className={cn(deadlineParams.countingDown ? 'font-bold' : 'space-x-1')}>
      {text}
    </div>
  )
}

export const AssignmentRow = (props: {
  assignment: Assignment
  sortable: boolean
}) => {
  const [hidden, setHidden] = useState(dynamicStore.hidden.get(props.assignment.id))

  if (!props.sortable && hidden) {
    return
  }

  const handleIconClick = () => {
    const newHidden = !hidden
    dynamicStore.hidden.set(props.assignment.id, newHidden)
    setHidden(newHidden)
  }

  const phase = getAssignmentPhase(props.assignment.deadline)
  const Icon = hidden ? EyeClosedIcon : EyeOpenIcon

  const switchable = props.sortable || o.mainPanel.showVisibilityIcon.value

  return (
    <div className={cn("hover:bg-transparent col-span-full grid grid-cols-subgrid", classNames[phase], hidden && 'opacity-50')}>
      <div className="hover:text-destructive m-auto border-primary border-e" onClick={handleIconClick}>
        {switchable && (
          <Icon className='m-1' />
        )}
      </div>
      <Anchor className="p-1 m-auto" href={props.assignment.type?.url} target='_blank'><Truncated text={props.assignment.type?.label} /></Anchor>
      <Anchor className="p-1 border-primary border-s" href={props.assignment.url} target='_blank'><Truncated text={props.assignment.title} /></Anchor>
      <Anchor className="p-1 border-primary border-x" href={props.assignment.course?.url} target='_blank'><Truncated text={props.assignment.course?.title} /></Anchor>
      <div className="p-1 m-auto"><Deadline deadline={props.assignment.deadline} /></div>
    </div>
  )
}
