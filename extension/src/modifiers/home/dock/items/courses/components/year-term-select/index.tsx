import { YearSelect } from "./year-select";
import { TermSelect } from "./term-select";

export const YearTermSelect = (props: {
  year: string;
  setYear: (year: string) => void;
  term: string;
  setTerm: (term: string) => void;
  sortable: boolean
}) => (
  <div className="gap-2 flex items-center">
    <YearSelect {...props} />
    <TermSelect {...props} />
  </div>
)
