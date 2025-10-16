'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'

type PopoverContextValue = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.MutableRefObject<HTMLElement | null>
  contentRef: React.MutableRefObject<HTMLDivElement | null>
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

function usePopoverContext(component: string) {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error(`${component} must be used within <Popover>`) 
  }
  return context
}

export interface PopoverProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Popover = ({ open, defaultOpen = false, onOpenChange, children }: PopoverProps) => {
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const isControlled = open !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)

  const isOpen = isControlled ? open : uncontrolledOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  const value = React.useMemo(
    () => ({ isOpen, setOpen, triggerRef, contentRef }),
    [isOpen, setOpen],
  )

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
}

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const PopoverTrigger = React.forwardRef<HTMLElement, PopoverTriggerProps>(
  ({ asChild = false, onClick, ...props }, forwardedRef) => {
    const { isOpen, setOpen, triggerRef } = usePopoverContext('PopoverTrigger')

    const Comp = asChild ? Slot : 'button'

    const composedRef = React.useCallback(
      (node: HTMLElement | null) => {
        triggerRef.current = node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          ;(forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node
        }
      },
      [forwardedRef, triggerRef],
    )

    return (
      <Comp
        {...props}
        ref={composedRef}
        data-state={isOpen ? 'open' : 'closed'}
        onClick={event => {
          onClick?.(event as React.MouseEvent<HTMLButtonElement, MouseEvent>)
          if (!event.defaultPrevented) {
            setOpen(!isOpen)
          }
        }}
      />
    )
  },
)
PopoverTrigger.displayName = 'PopoverTrigger'

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ align = 'center', sideOffset = 4, style, className, ...props }, forwardedRef) => {
    const { isOpen, setOpen, triggerRef, contentRef } = usePopoverContext('PopoverContent')
    const [position, setPosition] = React.useState<{ top: number; left: number; transform?: string }>({
      top: 0,
      left: 0,
    })

    React.useLayoutEffect(() => {
      if (!isOpen) {
        return
      }
      const trigger = triggerRef.current
      if (!trigger) {
        return
      }

      const rect = trigger.getBoundingClientRect()
      const nextPosition: { top: number; left: number; transform?: string } = {
        top: rect.bottom + sideOffset + window.scrollY,
        left: rect.left + window.scrollX,
      }

      if (align === 'center') {
        nextPosition.left = rect.left + rect.width / 2 + window.scrollX
        nextPosition.transform = 'translateX(-50%)'
      } else if (align === 'end') {
        nextPosition.left = rect.right + window.scrollX
        nextPosition.transform = 'translateX(-100%)'
      }

      setPosition(nextPosition)
    }, [align, isOpen, sideOffset, triggerRef])

    React.useEffect(() => {
      if (!isOpen) {
        return
      }

      const handlePointerDown = (event: MouseEvent) => {
        const target = event.target as Node | null
        if (!target) {
          return
        }

        if (contentRef.current?.contains(target)) {
          return
        }

        if (triggerRef.current?.contains(target)) {
          return
        }

        setOpen(false)
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpen(false)
        }
      }

      document.addEventListener('pointerdown', handlePointerDown)
      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('pointerdown', handlePointerDown)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }, [contentRef, isOpen, setOpen, triggerRef])

    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [forwardedRef, contentRef],
    )

    if (!isOpen) {
      return null
    }

    const createPortal = (children: React.ReactNode) => {
      if (typeof document === 'undefined') {
        return null
      }

      return ReactDOM.createPortal(children, document.body)
    }

    return createPortal(
      <div
        ref={composedRef}
        role='dialog'
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(
          'z-50 rounded-lg border border-border/70 bg-popover p-4 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2',
          className,
        )}
        style={{ position: 'absolute', ...position, ...style }}
        {...props}
      />,
    )
  },
)
PopoverContent.displayName = 'PopoverContent'

export { Popover, PopoverTrigger, PopoverContent }
