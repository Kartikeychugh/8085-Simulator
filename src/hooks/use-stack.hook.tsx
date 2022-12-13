import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setMemoryLocation } from "../features/memory/memorySlice";
import { loadRegister } from "../features/registers/registerSlice";

export type RootStack = ReturnType<typeof useStack>;

export const useStack = () => {
  const dispatch = useAppDispatch();
  const SP = useAppSelector((state) => state.registers.SP);
  const memory = useAppSelector((state) => state.memory);

  const push = useCallback(
    (value: number) => {
      dispatch(setMemoryLocation({ location: SP - 1, value }));
      dispatch(loadRegister({ register: "SP", value: SP - 1 }));
    },
    [SP, dispatch]
  );

  const pop = useCallback(() => {
    const top = memory[SP];
    dispatch(setMemoryLocation({ location: SP, value: 0 }));
    dispatch(loadRegister({ register: "SP", value: SP + 1 }));
    return top;
  }, [SP, memory, dispatch]);

  return { push, pop };
};
