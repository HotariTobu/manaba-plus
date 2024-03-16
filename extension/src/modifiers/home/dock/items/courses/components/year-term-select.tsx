import { t } from "@/utils/i18n";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { store } from "../store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CheckIcon, Cross1Icon, Cross2Icon, DragHandleDots2Icon, Pencil2Icon, PlusIcon } from "@radix-ui/react-icons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HTMLAttributes, InputHTMLAttributes, KeyboardEvent, forwardRef, useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResize } from "@/hooks/useResize";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RootContainer } from "@/components/root-container";

const FlexibleTextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ style, ...props }, ref) => {
  const [width, setWidth] = useState<number | undefined>()

  const updateWidth = (element: HTMLElement) => {
    setWidth(element.clientWidth)
  }

  const { setNodeRef } = useResize(updateWidth)

  const mergedStyle = {
    minWidth: 1,
    width,
    ...style,
  }

  return (
    <div className="contents">
      <div className="w-fit h-0 overflow-y-hidden whitespace-pre" ref={setNodeRef}>{props.value}</div>
      <input style={mergedStyle} {...props} ref={ref} />
    </div>
  )
})

const TermItem = (props: {
  term: string
  label: string
  selected: boolean
  onSelect: () => void
  onEdit: (newLabel: string) => void
  onDelete: () => void
}) => {
  const [label, setLabel] = useState(props.label)
  const [editing, setEditing] = useState(false)

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

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      handleEdit()
    }
  }

  const handleEdit = () => {
    if (editing) {
      props.onEdit(label)
    }
    setEditing(!editing)
  }

  return (
    <div className={cn("px-2 h-8 gap-1 text-transparent hover:text-foreground text-sm font-medium border rounded-md flex items-center transition-colors", props.selected && "bg-primary/50 border-primary")} style={style} ref={setNodeRef}>
      < DragHandleDots2Icon {...attributes} {...listeners} />
      <div className="min-w-4 text-foreground whitespace-nowrap">
        {props.selected ? editing ? (
          <FlexibleTextInput className="bg-transparent focus:outline-none" value={label} onKeyDown={handleKeyDown} onChange={e => setLabel(e.target.value)} type="text" autoFocus />
        ) : (
          <div className="min-h-4" onDoubleClick={handleEdit}>
            {props.label}
          </div>
        ) : (
          <div className="min-h-4" onClick={props.onSelect} role="button" tabIndex={0}>
            {props.label}
          </div>
        )}
      </div>
      {props.selected ? editing ? (
        <CheckIcon className="hover:text-destructive" onClick={handleEdit} role="button" tabIndex={0} />
      ) : (
        <Pencil2Icon className="hover:text-destructive" onClick={handleEdit} role="button" tabIndex={0} />
      ) : (
        <AlertDialog>
          <AlertDialogTrigger>
            <Cross2Icon className="hover:text-destructive" role="button" tabIndex={0} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <RootContainer>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('home_courses_term_delete_title', props.label)}</AlertDialogTitle>
                <AlertDialogDescription>{t('home_courses_term_delete_description')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('home_courses_term_delete_cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={props.onDelete}>{t('home_courses_term_delete_action')}</AlertDialogAction>
              </AlertDialogFooter>
            </RootContainer>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div >
  )
}

export const YearTermSelect = (props: {
  year: string;
  setYear: (year: string) => void;
  term: string;
  setTerm: (term: string) => void;
}) => {
  const [terms, setTerms] = useState(store.terms)

  const updateTerms = (newTerms: typeof terms) => {
    store.terms = newTerms
    setTerms(newTerms)
  }

  const addTerm = () => {
    const term = crypto.randomUUID()
    const label = t('home_courses_term_default')
    const newTerms: [string, string][] = [
      ...terms,
      [term, label],
    ]
    updateTerms(newTerms)
  }

  const editTerm = (term: string, label: string) => {
    const newTerms = terms.map<[string, string]>(p => p[0] === term ? [term, label] : p)
    updateTerms(newTerms)
  }

  const deleteTerm = (term: string) => {
    const newTerms = terms.filter(p => p[0] !== term)
    updateTerms(newTerms)
  }

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
          {terms.map(([term, label]) => (
            <TermItem term={term} label={label} selected={props.term === term} onSelect={() => props.setTerm(term)} onEdit={label => editTerm(term, label)} onDelete={() => deleteTerm(term)} key={term} />
          ))}
          <Button className="w-8 h-8 p-0" variant="ghost" onClick={addTerm}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
