import { RootDispatch } from "../app/hooks";
import { RootState } from "../app/store";
import { RootStack } from "../hooks/use-stack.hook";
import { ACI } from "./arithematic/ACI";
import { ADC } from "./arithematic/ADC/adc.command";
import { ADD } from "./arithematic/ADD/add.command";
import { ADI } from "./arithematic/ADI/adi.command";
import { CALL } from "./branch/CALL";
import { RET } from "./branch/RET";
import { ANA } from "./logical/ANA/ana.command";
import { CMA } from "./arithematic/CMA/cma.command";
import { HLT } from "./process/HLT/hlt.command";
import { CMC } from "./arithematic/CMC/cmc.command";
import { CMP } from "./logical/CMP/cmp.command";
import { DAD } from "./arithematic/DAD/dad.command";
import { DCR } from "./arithematic/DCR/dcr.command";
import { MVI } from "./data transfer/MVI/mvi.command";
import { DCX } from "./arithematic/DCX/dcx.command";
import { INR } from "./arithematic/INR/inr.command";
import { INX } from "./arithematic/INX/inx.command";
import { JUMP } from "./branch/JUMP/jump.command";
import { LDA } from "./data transfer/LDA/lda.command";
import { LDAX } from "./data transfer/LDAX/ldax.command";
import { LHLD } from "./data transfer/LHLD/lhld.command";
import { LXI } from "./data transfer/LXI/lxi.command";
import { MOV } from "./data transfer/MOV/mov.command";
import { ORA } from "./logical/ORA/ora.command";
import { RAL } from "./logical/RAL/ral.command";
import { RAR } from "./logical/RAR/rar.command";
import { RRC } from "./logical/RRC/rrc.command";
import { RLC } from "./logical/RLC/rlc.command";
import { SBB } from "./arithematic/SBB/sbb.command";
import { SBI } from "./arithematic/SBI/sbi.command";
import { STA } from "./data transfer/STA/sta.command";
import { SHLD } from "./data transfer/SHLD/shld.command";
import { STAX } from "./data transfer/STAX/stax.command";
import { STC } from "./arithematic/STC/stc.command";
import { SUB } from "./arithematic/SUB/sub.command";
import { SUI } from "./arithematic/SUI/sui.command";
import { XCHG } from "./data transfer/XCHG/xchg.command";
import { XRA } from "./logical/XRA/xra.command";

export type InstructionType = {
  opcode: string;
  compiler: (line: string) => {
    compiled: boolean;
    compiledCode: string[] | null;
  };
  execute: (
    state: RootState,
    dispatch: RootDispatch,
    stack: RootStack
  ) => number;
};

export type InstructionSetContextType = {
  [key: string]: InstructionType;
};

export const SupportedInstructions = {
  // arithematic
  ...ACI(),
  ...ADC(),
  ...ADD(),
  ...ADI(),
  ...CMA(),
  ...CMC(),
  ...DAD(),
  ...DCR(),
  ...DCX(),
  ...INR(),
  ...INX(),
  ...SBB(),
  ...SBI(),
  ...STC(),
  ...SUB(),
  ...SUI(),

  // branch
  ...CALL(),
  ...RET(),
  ...JUMP(),

  // logical
  ...ANA(),
  ...CMP(),
  ...ORA(),
  ...RAL(),
  ...RAR(),
  ...RLC(),
  ...RRC(),
  ...XRA(),

  // process
  ...HLT(),

  // data transfer
  ...LDA(),
  ...LDAX(),
  ...LHLD(),
  ...LXI(),
  ...MOV(),
  ...MVI(),
  ...SHLD(),
  ...STA(),
  ...STAX(),
  ...XCHG(),
};
