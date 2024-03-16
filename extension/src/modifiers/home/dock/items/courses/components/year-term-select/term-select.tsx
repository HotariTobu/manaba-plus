import { t } from "@/utils/i18n";
import { store } from "../../store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, Cross2Icon, DragHandleDots2Icon, Pencil2Icon, PlusIcon } from "@radix-ui/react-icons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { InputHTMLAttributes, KeyboardEvent, forwardRef, useState } from "react";
import { horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
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
import { SortableContainer } from "@/components/sortable/sortable-container";
import { ItemsMap } from "@/components/sortable/item";
import { SortableZone } from "@/components/sortable/sortable-zone";
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

type Terms = typeof store.terms

interface TermItem {
  id: string
  label: string
  selected: boolean
}

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

const TermChip = (props: {
  className?: string
  term: string
  label: string
  selected: boolean
  disabled: boolean
  onSelect: () => void
  onEdit: (newLabel: string) => void
  onDelete: () => void
}) => {
  const [newLabel, setNewLabel] = useState(props.label)
  const [editing, setEditing] = useState(false)

  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.term, disabled: props.disabled });

  const commonClass = cn("px-2 h-8 text-sm font-medium border rounded-md flex items-center", props.selected ? "bg-primary/50 border-primary" : "bg-background/50")

  const buttonProps = {
    role: "button",
    tabIndex: 0,
  }

  if (props.disabled) {
    return (
      <div className={cn("justify-center", commonClass, props.className)} onClick={props.onSelect} {...buttonProps}>
        {props.label}
      </div>
    )
  }

  const isActive = active?.id === props.term

  const style = {
    opacity: isActive ? 0 : 1,
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
      props.onEdit(newLabel)
    }
    setEditing(!editing)
  }

  return (
    <div className={cn("gap-1 text-transparent hover:text-foreground transition-colors", commonClass, props.className)} style={style} ref={setNodeRef}>
      <DragHandleDots2Icon className="cursor-grab focus:outline-none" {...attributes} {...listeners} />
      <div className="min-w-4 text-foreground whitespace-nowrap">
        {props.selected ? editing ? (
          <FlexibleTextInput className="bg-transparent focus:outline-none" value={newLabel} onKeyDown={handleKeyDown} onChange={e => setNewLabel(e.target.value)} type="text" autoFocus />
        ) : (
          <div className="min-h-4" onDoubleClick={handleEdit}>
            {props.label}
          </div>
        ) : (
          <div className="min-h-4" onClick={props.onSelect} {...buttonProps}>
            {props.label}
          </div>
        )}
      </div>
      {props.selected ? editing ? (
        <CheckIcon className="hover:text-destructive" onClick={handleEdit} {...buttonProps} />
      ) : (
        <Pencil2Icon className="hover:text-destructive" onClick={handleEdit} {...buttonProps} />
      ) : (
        <AlertDialog>
          <AlertDialogTrigger>
            <Cross2Icon className="hover:text-destructive" {...buttonProps} />
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

const TermOverlay = (props: {
  item: TermItem
}) => <TermChip className="h-full cursor-grabbing" term={props.item.id} label={props.item.label} selected={props.item.selected} disabled onSelect={() => { }} onEdit={() => { }} onDelete={() => { }} />

const containerId = 'container-id'

const toItemsMap = (terms: Terms, currentTerm: string) => {
  const items = terms.map<TermItem>(([term, label]) => ({
    id: term,
    label,
    selected: term === currentTerm,
  }))

  return {
    itemsMap: new Map([[containerId, items]]),
    items,
  }
}

const fromItemsMap = (itemsMap: ItemsMap<TermItem>) => {
  const items = itemsMap.get(containerId)
  if (typeof items === 'undefined') {
    return null
  }

  return items.map<[string, string]>(({ id, label }) => [id, label])
}

export const TermSelect = (props: {
  term: string;
  setTerm: (term: string) => void;
  sortable: boolean
}) => {
  const [terms, setTerms] = useState(store.terms)

  const updateTerms = (newTerms: Terms) => {
    store.terms = newTerms
    setTerms(newTerms)
  }

  const handleDrop = (itemsMap: ItemsMap<TermItem>) => {
    const newTerms = fromItemsMap(itemsMap)
    if (newTerms === null) {
      return
    }
    updateTerms(newTerms)
  }

  const addTerm = () => {
    const term = crypto.randomUUID()
    const label = t('home_courses_term_default')
    const newTerms: Terms = [
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

  const { itemsMap, items } = toItemsMap(terms, props.term)

  return (
    <ScrollArea>
      <SortableContainer itemsMap={itemsMap} setItemsMap={handleDrop} Overlay={TermOverlay} modifiers={[restrictToHorizontalAxis, restrictToParentElement]}>
        <SortableZone containerId={containerId} items={items} strategy={horizontalListSortingStrategy}>
          <div className="gap-1 flex items-center">
            {items.map(({ id, label, selected }) => (
              <TermChip term={id} label={label} selected={selected} disabled={!props.sortable} onSelect={() => props.setTerm(id)} onEdit={label => editTerm(id, label)} onDelete={() => deleteTerm(id)} key={id} />
            ))}
            {props.sortable && (
              <Button className="w-8 h-8 p-0" variant="ghost" onClick={addTerm}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SortableZone>
      </SortableContainer>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
