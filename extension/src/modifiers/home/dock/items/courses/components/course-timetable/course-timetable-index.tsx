export const CourseTimetableIndex = (props: {
  rowCount: number
  startRow: number
}) => (
  <div className="col-start-1 col-end-2 row-start-2 row-end-[1] grid grid-rows-subgrid">
    {[...Array(props.rowCount).keys()].map(i => {
      const period = props.startRow + i + 1
      return (
        <div className="p-2 text-center flex items-center rounded bg-slate-100" key={period}>
          {period}
        </div>
      )
    })}
  </div>
)
