import { PointerEvent } from "react";
import { YearSelect } from "./year-select";
import { ModuleSelect } from "./module-select";

export const YearModuleSelect = (props: {
  year: number;
  setYear: (year: number) => void;
  module: string;
  setModule: (module: string) => void;
  sortable: boolean
}) => {
  const handlePointerDown = (event: PointerEvent) => {
    event.stopPropagation()
  }

  return (
    <div className="me-auto gap-2 flex items-center" onPointerDown={handlePointerDown}>
      <YearSelect {...props} />
      <ModuleSelect {...props} />
    </div>
  )
}
