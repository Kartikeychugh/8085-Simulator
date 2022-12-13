import { useCallback } from "react";
import { SupportedInstructions } from "../instructions/supported-instructions";

export const useCompiler = () => {
  const compile = useCompileCallback();
  return { compile };
};

const useCompileCallback = () => {
  return useCallback((lines: string[]) => {
    const compiledCode: string[][] = [];

    for (const line of lines) {
      let validLine = false;
      for (const keyValuePair of Object.entries(SupportedInstructions)) {
        const instruction = keyValuePair[1];
        const compilerResponse = instruction.compiler(line);
        if (compilerResponse.compiled) {
          validLine = true;
          compiledCode.push(compilerResponse.compiledCode!);
          break;
        }
      }

      if (!validLine) {
        break;
      }
    }

    if (compiledCode.length === lines.length) {
      return { compiled: true, compiledCode };
    } else {
      return { compiled: false, compiledCode: null };
    }
  }, []);
};
