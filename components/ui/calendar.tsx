'use client'

import * as React from 'react'
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

type DisabledRange = { before?: Date; after?: Date }

type CalendarClassNames = {
  months?: string
  month?: string
  caption?: string
  caption_label?: string
  nav?: string
  nav_button?: string
  nav_button_previous?: string
  nav_button_next?: string
  table?: string
  head_row?: string
  head_cell?: string
  row?: string
  cell?: string
  day?: string
  day_today?: string
  day_outside?: string
  day_disabled?: string
  day_selected?: string
}

export interface CalendarProps {
  className?: string
  classNames?: CalendarClassNames
  showOutsideDays?: boolean
  mode?: 'single'
  selected?: Date
  onSelect?: (day: Date | undefined) => void
  disabled?: DisabledRange[]
  captionLayout?: 'buttons'
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  mode = 'single',
  selected,
  onSelect,
  disabled,
  captionLayout = 'buttons',
}: CalendarProps) {
  const normalizedSelected = React.useMemo(() => (selected ? startOfDay(selected) : undefined), [selected])
  const initialMonth = React.useMemo(
    () => startOfMonth(normalizedSelected ?? new Date()),
    [normalizedSelected],
  )
  const [displayMonth, setDisplayMonth] = React.useState(initialMonth)

  React.useEffect(() => {
    setDisplayMonth(initialMonth)
  }, [initialMonth])

  const classList = React.useMemo(() => cnClassNames(classNames), [classNames])

  const weeks = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(displayMonth))
    const end = endOfWeek(endOfMonth(displayMonth))

    const currentWeeks: Date[][] = []
    let cursor = start
    let week: Date[] = []

    while (cursor <= end) {
      week.push(cursor)
      if (week.length === 7) {
        currentWeeks.push(week)
        week = []
      }
      cursor = addDays(cursor, 1)
    }

    return currentWeeks
  }, [displayMonth])

  const handleSelect = React.useCallback(
    (day: Date) => {
      if (mode !== 'single') {
        return
      }

      if (isDateDisabled(day, disabled)) {
        return
      }

      const normalized = startOfDay(day)
      onSelect?.(normalized)
      setDisplayMonth(startOfMonth(normalized))
    },
    [disabled, mode, onSelect],
  )

  return (
    <div className={cn('p-3', className)}>
      <div className={classList.months}>
        <div className={classList.month}>
          {captionLayout === 'buttons' && (
            <div className={classList.caption}>
              <button
                type='button'
                className={cn(classList.nav_button, classList.nav_button_previous)}
                onClick={() => setDisplayMonth(current => subMonths(current, 1))}
                aria-label='Previous month'
              >
                <ChevronLeft className='h-4 w-4' aria-hidden />
              </button>
              <span className={classList.caption_label}>{format(displayMonth, 'MMMM yyyy')}</span>
              <button
                type='button'
                className={cn(classList.nav_button, classList.nav_button_next)}
                onClick={() => setDisplayMonth(current => addMonths(current, 1))}
                aria-label='Next month'
              >
                <ChevronRight className='h-4 w-4' aria-hidden />
              </button>
            </div>
          )}
          <div className={classList.table} role='grid' aria-label='Calendar'>
            <div className={classList.head_row} role='row'>
              {WEEKDAYS.map(weekday => (
                <span key={weekday} className={classList.head_cell} role='columnheader'>
                  {weekday}
                </span>
              ))}
            </div>
            {weeks.map((week, index) => (
              <div key={index} className={classList.row} role='row'>
                {week.map(day => {
                  const normalizedDay = startOfDay(day)
                  const outside = !isSameMonth(day, displayMonth)

                  if (!showOutsideDays && outside) {
                    return <div key={normalizedDay.getTime()} className={classList.cell} aria-hidden />
                  }

                  const disabledDay = isDateDisabled(day, disabled)
                  const selectedDay = normalizedSelected ? isSameDay(normalizedDay, normalizedSelected) : false

                  const dayClassName = cn(
                    classList.day,
                    isToday(day) && classList.day_today,
                    outside && classList.day_outside,
                    disabledDay && classList.day_disabled,
                    selectedDay && classList.day_selected,
                  )

                  return (
                    <div key={normalizedDay.getTime()} className={classList.cell} role='gridcell'>
                      <button
                        type='button'
                        className={dayClassName}
                        onClick={() => handleSelect(day)}
                        disabled={disabledDay}
                        aria-pressed={selectedDay}
                        aria-label={format(day, 'PPP')}
                      >
                        {normalizedDay.getDate()}
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function cnClassNames(classNames?: CalendarClassNames) {
  return {
    months: cn('flex flex-col gap-4 sm:flex-row', classNames?.months),
    month: cn('space-y-4', classNames?.month),
    caption: cn('relative flex items-center justify-center pt-1', classNames?.caption),
    caption_label: cn('text-sm font-medium', classNames?.caption_label),
    nav: cn('flex items-center space-x-1', classNames?.nav),
    nav_button: cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-muted/60 text-sm font-medium transition-colors',
      'hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      classNames?.nav_button,
    ),
    nav_button_previous: cn('absolute left-1', classNames?.nav_button_previous),
    nav_button_next: cn('absolute right-1', classNames?.nav_button_next),
    table: cn('w-full border-collapse space-y-1', classNames?.table),
    head_row: cn('flex', classNames?.head_row),
    head_cell: cn('w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground', classNames?.head_cell),
    row: cn('mt-2 flex w-full', classNames?.row),
    cell: cn(
      'relative h-9 w-9 p-0 text-center text-sm',
      'focus-within:relative focus-within:z-20 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      classNames?.cell,
    ),
    day: cn(
      'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors',
      'hover:bg-primary/10 hover:text-primary focus:outline-none',
      classNames?.day,
    ),
    day_today: cn('bg-primary/10 text-primary', classNames?.day_today),
    day_outside: cn('text-muted-foreground/50 opacity-50', classNames?.day_outside),
    day_disabled: cn('text-muted-foreground/50 opacity-40', classNames?.day_disabled),
    day_selected: cn(
      'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
      classNames?.day_selected,
    ),
  }
}

function isDateDisabled(date: Date, disabled?: DisabledRange[]) {
  if (!disabled?.length) {
    return false
  }

  const normalized = startOfDay(date)
  return disabled.some(range => {
    if (range.before && isBefore(normalized, startOfDay(range.before))) {
      return true
    }

    if (range.after && isAfter(normalized, startOfDay(range.after))) {
      return true
    }

    return false
  })
}
