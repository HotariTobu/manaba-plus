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
import { Module } from "../../types/module";

type ModuleItem = {
  id: string
  label: string
  selected: boolean
}

/** A text input whose width is shrunk and grown to fit the content */
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

/** An option of modules */
const ModuleChip = (props: {
  className?: string
  module: string
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
  } = useSortable({ id: props.module, disabled: props.disabled });

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

  const isActive = active?.id === props.module

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
                <AlertDialogTitle>{t('home_courses_module_delete_title', props.label)}</AlertDialogTitle>
                <AlertDialogDescription>{t('home_courses_module_delete_description')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('home_courses_module_delete_cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={props.onDelete}>{t('home_courses_module_delete_action')}</AlertDialogAction>
              </AlertDialogFooter>
            </RootContainer>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div >
  )
}

const ModuleOverlay = (props: {
  item: ModuleItem
}) => <ModuleChip className="h-full cursor-grabbing" module={props.item.id} label={props.item.label} selected={props.item.selected} disabled onSelect={() => { }} onEdit={() => { }} onDelete={() => { }} />

const containerId = 'container-id'

/**
 * Create an items map from an array of modules.
 * @param modules The array of modules
 * @param currentModule The currently selected module
 * @returns An items map of the modules
 */
const modulesToItemsMap = (modules: Module[], currentModule: string) => {
  const items = modules.map<ModuleItem>(module => ({
    ...module,
    selected: module.id === currentModule,
  }))

  return {
    itemsMap: new Map([[containerId, items]]),
    items,
  }
}

/**
 * Extract an array of modules from an items map.
 * @param itemsMap The items map of modules
 * @returns An array of modules
 */
const modulesFromItemsMap = (itemsMap: ItemsMap<ModuleItem>) => {
  const items = itemsMap.get(containerId)
  if (typeof items === 'undefined') {
    return null
  }

  return items.map<Module>(({ id, label }) => ({ id, label }))
}

export const ModuleSelect = (props: {
  module: string;
  setModule: (module: string) => void;
  sortable: boolean
}) => {
  const [modules, setModules] = useState(store.modules)

  const updateModules = (newModules: Module[]) => {
    store.modules = newModules
    setModules(newModules)
  }

  const handleDrop = (itemsMap: ItemsMap<ModuleItem>) => {
    const newModules = modulesFromItemsMap(itemsMap)
    if (newModules === null) {
      return
    }
    updateModules(newModules)
  }

  /**
   * Add a new module with the default label.
   */
  const addModule = () => {
    const id = crypto.randomUUID()
    const label = t('home_courses_module_default')
    const newModules: Module[] = [
      ...modules,
      {
        id,
        label,
      },
    ]
    updateModules(newModules)
  }

  /**
   * Update the label of the specified module.
   * @param id The id of the module
   * @param label The new label of the module
   */
  const editModule = (id: string, label: string) => {
    const newModules = modules.map<Module>(module => {
      if (module.id === id) {
        return {
          id, label
        }
      }
      else {
        return module
      }
    })
    updateModules(newModules)
  }

  /**
   * Delete the specified module.
   * @param id The id of the module
   */
  const deleteModule = (id: string) => {
    const newModules = modules.filter(module => module.id !== id)
    updateModules(newModules)
  }

  const { itemsMap, items } = modulesToItemsMap(modules, props.module)

  return (
    <ScrollArea>
      <SortableContainer itemsMap={itemsMap} setItemsMap={handleDrop} Overlay={ModuleOverlay} modifiers={[restrictToHorizontalAxis, restrictToParentElement]}>
        <SortableZone containerId={containerId} items={items} strategy={horizontalListSortingStrategy}>
          <div className="gap-1 flex items-center">
            {items.map(({ id, label, selected }) => (
              <ModuleChip module={id} label={label} selected={selected} disabled={!props.sortable} onSelect={() => props.setModule(id)} onEdit={label => editModule(id, label)} onDelete={() => deleteModule(id)} key={id} />
            ))}
            {props.sortable && (
              <Button className="w-8 h-8 p-0" variant="ghost" onClick={addModule}>
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
