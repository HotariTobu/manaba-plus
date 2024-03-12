import { t } from "@/utils/i18n";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { store } from "../store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Cross1Icon, Cross2Icon, DragHandleDots2Icon, PlusIcon } from "@radix-ui/react-icons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
}) => {
  return (
    <div className="px-2 h-8 gap-1 text-sm font-medium border rounded-md flex items-center">
      <DragHandleDots2Icon />
      <div className="whitespace-nowrap">{getTermLabel(props.term)}</div>
      <Cross2Icon />
    </div>
  )
}

export const YearTermSelect = (props: {
  year: string;
  setYear: (year: string) => void;
  term: string;
  setTerm: (term: string) => void;
}) => {
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
          {Array.from(store.terms).concat('fir', 'その他').map(term => (
            <TermItem term={term} selected={props.term === term} key={term} />
          ))}
          <div className="">
            <PlusIcon/>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
