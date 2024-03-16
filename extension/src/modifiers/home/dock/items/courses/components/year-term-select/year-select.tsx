import { t } from "@/utils/i18n";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { store } from "../../store";

export const YearSelect = (props: {
  year: string;
  setYear: (year: string) => void;
}) => (
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
)
