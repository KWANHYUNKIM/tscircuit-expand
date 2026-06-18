import { defineChip } from "./defineChip"

/**
 * Generic 4-pin optocoupler (DIP-4). Pin labels follow the classic
 * single-channel phototransistor optocoupler convention:
 *
 *   pin1 ANODE     pin4 COLLECTOR
 *   pin2 CATHODE   pin3 EMITTER
 *
 * The LED input side is ANODE/CATHODE, the phototransistor output side is
 * COLLECTOR/EMITTER.
 */
export const Optocoupler = defineChip({
  pinLabels: {
    pin1: "ANODE",
    pin2: "CATHODE",
    pin3: "EMITTER",
    pin4: "COLLECTOR",
  },
  footprint: "dip4",
})

/**
 * PC817 — Sharp single-channel phototransistor optocoupler in a 4-pin DIP.
 * Same pinout as the generic {@link Optocoupler}.
 */
export const PC817 = Optocoupler

export default PC817
