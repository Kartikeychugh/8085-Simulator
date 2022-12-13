interface IAssemblerCodeInterface {
  compiledCodes: string[][];
}
export const AssemblerCode = (props: IAssemblerCodeInterface) => {
  const { compiledCodes } = props;
  return (
    <div
      style={{
        margin: "0 10px 0 10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontFamily: "monospace" }}>Assembler output:</div>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          width: "200px",
          background: "#faf5f5",
          padding: "10px",
          border: "1px solid lightgrey",
          fontFamily: "monospace",
          fontSize: "1em",
        }}
      >
        <code style={{ fontSize: "13px" }}>
          {compiledCodes.map((codes, i) => {
            return (
              <div key={i}>
                {i}: {codes.join(" ")}
              </div>
            );
          })}
        </code>
      </div>
    </div>
  );
};
