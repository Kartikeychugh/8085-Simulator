import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectMemory,
  setMemoryLocation,
} from "../../features/memory/memorySlice";
import {
  DecToHex,
  HexToDec,
  representWithRadix,
} from "../../utils/hexadecimal-representation";
import { readNumber } from "../../utils/reading-numbers";
import { Table } from "../table/table.component";

export const MainMemory = () => {
  const memory = useAppSelector(selectMemory);
  const dispatch = useAppDispatch();

  const rows = memory.map((entry, i) => {
    const row = [];
    row.push({
      editable: false,
      value: representWithRadix(DecToHex(i), 4),
      type: "text",
    });
    row.push({
      type: "text",
      editable: true,
      value: `0x${representWithRadix(DecToHex(entry), 2)}`,
      onCellChange: (new_value: string) => {
        const result = readNumber(new_value);
        if (result.valid) {
          dispatch(
            setMemoryLocation({ location: i, value: HexToDec(result.value!) })
          );
        } else {
          console.warn("Invalid number entered");
        }
      },
    });
    return row;
  });
  return (
    <div style={{ width: "300px" }}>
      <Table height={500} rows={rows} headers={["Address", "Value"]} />
    </div>
  );
};
