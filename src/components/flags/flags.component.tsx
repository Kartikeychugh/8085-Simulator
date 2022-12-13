import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectFlags, setFlag } from "../../features/flags/flagSlice";
import { Table } from "../table/table.component";

export const Flags = () => {
  const flags = useAppSelector(selectFlags);
  const dispatch = useAppDispatch();

  const rows = Object.entries(flags)
    .sort()
    .map((entry, i) => {
      const row = [];
      row.push({
        editable: false,
        value: entry[0].toUpperCase(),
        type: "text",
      });
      row.push({
        editable: true,
        value: entry[1] ? "true" : "",
        onCellChange: (new_value: string) => {
          dispatch(
            setFlag({ flag: entry[0] as any, value: !!parseInt(new_value) })
          );
        },
        type: "checkbox",
      });
      return row;
    });

  return (
    <div style={{}}>
      <Table rows={rows} headers={["Flag", "Set"]} />
    </div>
  );
};
