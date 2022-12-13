import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectMemoryLocation } from "../features/memory/memorySlice";
import {
  loadRegister,
  selectRegisters,
} from "../features/registers/registerSlice";
import { useStack } from "../hooks/use-stack.hook";
import { SupportedInstructions } from "../instructions/supported-instructions";

import {
  DecToHex,
  representWithRadix,
} from "../utils/hexadecimal-representation";

export const useExecutor = () => {
  const [start, setStart] = useState(false);
  const registers = useAppSelector(selectRegisters);
  const dispatch = useAppDispatch();
  const rootState = useAppSelector((state) => state);
  const stack = useStack();
  const PC = useMemo(() => registers["PC"], [registers]);
  const PCValue = useAppSelector(selectMemoryLocation(PC));
  const instruction =
    SupportedInstructions[representWithRadix(DecToHex(PCValue), 2)];

  useEffect(() => {
    if (!start) return;

    const new_location = instruction.execute(rootState, dispatch, stack);

    if (PC === new_location) {
      setStart(false);
    } else {
      dispatch(loadRegister({ register: "PC", value: new_location }));
    }
  }, [instruction, PC, start, rootState, dispatch, stack]);

  return { setStart };
};

export const useExecutorLineByLine = () => {
  const dispatch = useAppDispatch();
  const registers = useAppSelector(selectRegisters);
  const rootState = useAppSelector((state) => state);
  const stack = useStack();

  const PC = useMemo(() => registers["PC"], [registers]);
  const PCValue = useAppSelector(selectMemoryLocation(PC));
  const instruction =
    SupportedInstructions[representWithRadix(DecToHex(PCValue), 2)];

  const execute = useCallback(() => {
    const new_location = instruction.execute(rootState, dispatch, stack);
    dispatch(loadRegister({ register: "PC", value: new_location }));
  }, [instruction, rootState, dispatch, stack]);

  return execute;
};
