import { PointerEvent } from "react";
import { YearSelect } from "./year-select";
import { TermSelect } from "./term-select";

export const YearTermSelect = (props: {
  year: number;
  setYear: (year: number) => void;
  term: string;
  setTerm: (term: string) => void;
  sortable: boolean
}) => {
  const handlePointerDown = (event: PointerEvent) => {
    event.stopPropagation()
  }

  return (
    <div className="me-auto gap-2 flex items-center" onPointerDown={handlePointerDown}>
      <YearSelect {...props} />
      <TermSelect {...props} />
    </div>
  )
}
