import { t } from "@/utils/i18n";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { store } from "../store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Cross1Icon, Cross2Icon, DragHandleDots2Icon, PlusIcon } from "@radix-ui/react-icons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HTMLAttributes, InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const FlexibleTextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({style, ...props}, ref) => {
  const [width, setWidth] = useState()

  const updateWidth = () => {
    const element = internalRef.current
    if (element === null) {
      return
    }

    setWidth(element.clientWidth)
  }

  useEffect(() => {
    const element = internalRef.current
    if (element === null) {
      return
    }

    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)
    return () => observer.unobserve(element)
  }, [])

  return (
    <div>
      <div ref={internalRef}>{props.value}</div>
      <input width={} type="text" {...props} ref={ref} />
    </div>
  )
})

const getTermLabel = (term: string) => {
  const label = t(`home_courses_term_${term}`)
  if (label.length === 0) {
    return term
  }
  else {
    return label
  }
}

const TermItem = (props: {
  term: string
  selected: boolean
  onSelect: () => void
  onEdit: (newTerm: string) => void
  onDelete: () => void
}) => {
  const label = getTermLabel(props.term)
  const [newTerm, setNewTerm] = useState(label)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.term });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div className={cn("px-2 h-8 gap-1 text-transparent hover:text-foreground text-sm font-medium border rounded-md flex items-center transition-colors", props.selected && "bg-primary/50 border-primary")} style={style} ref={setNodeRef}>
      < DragHandleDots2Icon {...attributes} {...listeners} />
      <div className="text-foreground whitespace-nowrap">
        {props.selected ? (
          <input className="bg-transparent focus:outline-none" value={newTerm} type="text" />
        ) : (
          <div onClick={props.onSelect} role="button" tabIndex={0}>
            {label}
          </div>
        )}
      </div>
      <Cross2Icon className=" hover:text-destructive" onClick={props.onDelete} role="button" tabIndex={0} />
    </div >
  )
}

export const YearTermSelect = (props: {
  year: string;
  setYear: (year: string) => void;
  term: string;
  setTerm: (term: string) => void;
}) => {
  const [terms, setTerms] = useState(Array.from(store.terms).concat('fir', 'その他'))

  return (
    <div className="gap-2 flex items-center">
      <Select value={props.year} onValueChange={props.setYear}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder={t('home_courses_course_year')} />
        </SelectTrigger>
        <SelectContent>
          {Array.from(store.years).map(year => (
            <SelectItem value={year} key={year}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ScrollArea>
        <div className="gap-1 flex items-center">
          {terms.map(term => {
            const handleSelect = () => {
              props.setTerm(term)
            }

            const handleEdit = () => { }
            const handleDelete = () => { }

            return (
              <TermItem term={term} selected={props.term === term} onSelect={handleSelect} onEdit={handleEdit} onDelete={handleDelete} key={term} />
            )
          })}
          <div className="px-2">
            <PlusIcon />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
