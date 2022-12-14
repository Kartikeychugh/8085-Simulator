import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  loadRegister,
  Registers,
  selectRegisters,
} from "../../features/registers/registerSlice";
import {
  DecToHex,
  representWithRadix,
} from "../../utils/hexadecimal-representation";
import { Table } from "../table/table.component";

export const RegisterMemory = () => {
  const registers = useAppSelector(selectRegisters);
  const dispatch = useAppDispatch();

  const rows = Object.entries(registers).map((entry, i) => {
    const row = [];
    row.push({
      editable: false,
      value: entry[0],
      type: "text",
    });
    row.push({
      editable: true,
      value: `0x${representWithRadix(
        DecToHex(entry[1]),
        entry[0] == "SP" ? 4 : 2
      )}`,
      onCellChange: (new_value: string) => {
        dispatch(
          loadRegister({
            register: entry[0] as Registers,
            value: parseInt(new_value),
          })
        );
      },
      type: "text",
    });
    return row;
  });

  return (
    <div style={{ marginBottom: 20 }}>
      <Table headers={["Register", "Value"]} rows={rows} />
    </div>
  );
};
