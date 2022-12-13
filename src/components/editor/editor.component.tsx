import { useCallback, useRef, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useExecutor, useExecutorLineByLine } from "../../executor/executor";
import { resetFlags } from "../../features/flags/flagSlice";
import { resetMemory } from "../../features/memory/memorySlice";
import { resetRegisters } from "../../features/registers/registerSlice";
import { useCompiler } from "../../hooks/use-compiler";
import { useLoader } from "../../hooks/use-loader";

import { AssemblerCode } from "../assembler-code/assembler-code.component";
import "./editor.css";

export const Editor = () => {
  const dispatch = useAppDispatch();

  const [compiledCode, setCompiledCode] = useState<string[][] | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null!);

  const compiler = useCompiler();
  const loader = useLoader();

  const { setStart } = useExecutor();
  const execute = useExecutorLineByLine();

  const onCompile = useCallback(() => {
    const value = ref.current.value;
    const lines = value.trim().split("\n");
    const compilerResponse = compiler.compile(lines);

    if (compilerResponse.compiled) {
      setCompiledCode(compilerResponse.compiledCode);
      loader.load(compilerResponse.compiledCode!);
    }
  }, [ref, compiler, loader, setCompiledCode]);

  const onExecuteByLine = useCallback(() => {
    execute();
  }, [execute]);

  const onExecute = useCallback(() => {
    setStart(true);
  }, [setStart]);

  const onReset = useCallback(() => {
    dispatch(resetFlags());
    dispatch(resetRegisters());
    dispatch(resetMemory());
    setCompiledCode(null);
  }, [dispatch, setCompiledCode]);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          margin: "0px 10px 0px 10px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button style={{ marginRight: "10px" }} onClick={onCompile}>
            Compile
          </button>
          <button
            style={{ marginRight: "10px" }}
            onClick={onExecuteByLine}
            disabled={!compiledCode}
          >
            Next
          </button>
          <button
            style={{ marginRight: "10px" }}
            onClick={onExecute}
            disabled={!compiledCode}
          >
            Run
          </button>
          <button
            style={{ marginRight: "10px" }}
            onClick={onReset}
            disabled={!compiledCode}
          >
            Reset
          </button>
        </div>
        <textarea
          ref={ref}
          style={{ resize: "none", height: "100%" }}
        ></textarea>
      </div>
      <AssemblerCode compiledCodes={compiledCode ? compiledCode : []} />
    </div>
  );
};
