import { useCallback } from "react";
import { useAppDispatch } from "../app/hooks";
import { setMemoryLocation } from "../features/memory/memorySlice";
import { HexToDec } from "../utils/hexadecimal-representation";

export const useLoader = () => {
  const dispatch = useAppDispatch();

  const load = useCallback(
    (compiledInstructions: string[][]) => {
      let mem = 0;
      compiledInstructions.forEach((compiledCodes) => {
        compiledCodes.forEach((code) => {
          dispatch(setMemoryLocation({ location: mem, value: HexToDec(code) }));
          mem++;
        });
      });
    },
    [dispatch]
  );

  return { load };
};
