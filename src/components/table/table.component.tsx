export interface ITableProps {
  height?: number;
  headers: string[];
  rows: {
    type: string;
    editable: boolean;
    value: string;
    onCellChange?: (newValue: string) => void;
  }[][];
}

export const Table = (props: ITableProps) => {
  const { rows, headers, height } = props;

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid lightgrey",
          height: "25px",
        }}
      >
        {headers.map((header, i) => {
          return (
            <div
              key={i}
              style={{
                fontWeight: 600,
                textAlign: "left",
                width: "100%",
              }}
            >
              {header}
            </div>
          );
        })}
      </div>
      <div
        style={{
          ...(height ? { height: `${height}px`, overflowY: "scroll" } : {}),
          width: "100%",
        }}
      >
        {rows.map((row, i) => {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                borderBottom: "1px solid lightgrey",
                height: "25px",
              }}
            >
              {row.map((cell, j) => {
                return (
                  <input
                    style={{
                      width: "100%",
                      ...(cell.editable ? {} : { outline: "none" }),
                      border: "none",
                    }}
                    {...(cell.type === "checkbox"
                      ? { checked: !!cell.value }
                      : {})}
                    key={j}
                    type={cell.type}
                    readOnly={true}
                    value={cell.value.toString()}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
