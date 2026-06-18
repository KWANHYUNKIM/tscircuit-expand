import { defineChip } from "./defineChip"

/**
 * MAX232 — dual RS-232 driver/receiver with on-chip charge-pump voltage
 * generator, in a 16-pin SOIC. Standard pinout (datasheet name -> port label):
 *
 *   pin1  C1+ -> C1P    pin16 VCC
 *   pin2  V+  -> VP     pin15 GND
 *   pin3  C1- -> C1N    pin14 T1OUT
 *   pin4  C2+ -> C2P    pin13 R1IN
 *   pin5  C2- -> C2N    pin12 R1OUT
 *   pin6  V-  -> VN     pin11 T1IN
 *   pin7  T2OUT         pin10 T2IN
 *   pin8  R2IN          pin9  R2OUT
 *
 * NOTE: tscircuit's `<chip>` drops pin-label names containing `+`/`-`
 * (they are not valid port identifiers / trace selectors). The charge-pump
 * pins are therefore labeled with selector-safe aliases: `+` -> `P`,
 * `-` -> `N` (so C1+ becomes `C1P`, V- becomes `VN`, etc.). They remain
 * addressable as `.U2 > .pin1` etc. as well.
 */
export const MAX232 = defineChip({
  pinLabels: {
    pin1: "C1P",
    pin2: "VP",
    pin3: "C1N",
    pin4: "C2P",
    pin5: "C2N",
    pin6: "VN",
    pin7: "T2OUT",
    pin8: "R2IN",
    pin9: "R2OUT",
    pin10: "T2IN",
    pin11: "T1IN",
    pin12: "R1OUT",
    pin13: "R1IN",
    pin14: "T1OUT",
    pin15: "GND",
    pin16: "VCC",
  },
  footprint: "soic16",
})

export default MAX232
