import { defineChip } from "./defineChip"

/**
 * RS-485 transceiver (MAX485 / SN75176-style) in an 8-pin SOIC.
 *
 *   pin1 RO   receiver output
 *   pin2 RE   receiver output enable (active low)
 *   pin3 DE   driver output enable (active high)
 *   pin4 DI   driver input
 *   pin5 GND  ground
 *   pin6 A    non-inverting bus line
 *   pin7 B    inverting bus line
 *   pin8 VCC  supply
 */
export const RS485 = defineChip({
  pinLabels: {
    pin1: "RO",
    pin2: "RE",
    pin3: "DE",
    pin4: "DI",
    pin5: "GND",
    pin6: "A",
    pin7: "B",
    pin8: "VCC",
  },
  footprint: "soic8",
})

export default RS485
