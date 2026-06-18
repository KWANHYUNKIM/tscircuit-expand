import React from "react"
import { defineChip } from "./defineChip"

/**
 * LM2576-5.0 — 3A step-down (buck) switching voltage regulator in a 5-pin
 * TO-220 package. Standard pinout (datasheet name -> port label):
 *
 *   pin1 VIN      unregulated input supply
 *   pin2 OUTPUT   switch output (to inductor)
 *   pin3 GND      ground
 *   pin4 FEEDBACK feedback sense (tied to OUTPUT for the fixed -5.0 variant)
 *   pin5 ONOFF    on/off control (active-low shutdown; tie to GND to enable)
 *
 * NOTE: tscircuit's `<chip>` drops pin-label names containing `/` or `-`
 * (they are not valid port identifiers / trace selectors). The on/off pin is
 * therefore labeled `ONOFF` rather than `ON/OFF`. Pins remain addressable as
 * `.U1 > .pin1` as well as `.U1 > .VIN`.
 *
 * Footprint: the footprinter `to220` function defaults to 3 pins, so the
 * explicit 5-pin variant string `to220_5` is used.
 */
export const LM2576 = defineChip({
  pinLabels: {
    pin1: "VIN",
    pin2: "OUTPUT",
    pin3: "GND",
    pin4: "FEEDBACK",
    pin5: "ONOFF",
  },
  footprint: "to220_5",
})

export interface Buck5VProps {
  /** Reference designator for the LM2576 regulator chip. */
  name?: string
  /**
   * Net name for the (unregulated) input supply. Default "DCIN".
   * NOTE: tscircuit net names cannot contain "+" or "-", so use selector-safe
   * names (e.g. "VIN_5V", "V5", "DCIN") rather than "+5V"/"+DCIN".
   */
  inputNet?: string
  /** Net name for the regulated 5V output. Default "V5". */
  outputNet?: string
  /** Net name for ground. Default "GND". */
  gndNet?: string
}

/**
 * A reusable LM2576-5.0 buck (step-down) converter subcircuit producing the
 * standard fixed 5V output topology:
 *
 *   INPUT --[Cin]-- VIN
 *                   OUTPUT --[L1]--+-- OUTPUT_NET --[Cout]-- GND
 *                                  |
 *                              FEEDBACK
 *   GND  --[D1 catch diode]-- OUTPUT (cathode at switch node, anode at GND)
 *   ONOFF tied to GND (regulator enabled)
 *
 * Net names are exposed via props so the block can be dropped into a larger
 * board and wired to existing nets by name.
 */
export const Buck5V = (props: Buck5VProps) => {
  const {
    name = "U1",
    inputNet = "DCIN",
    outputNet = "V5",
    gndNet = "GND",
  } = props

  // Local switch node between the regulator OUTPUT pin and the inductor.
  const swNode = `${name}_SW`

  return (
    <group>
      <LM2576 name={name} />
      <capacitor name={`${name}_CIN`} capacitance="100uF" footprint="1206" />
      <capacitor name={`${name}_COUT`} capacitance="1000uF" footprint="1206" />
      <inductor name={`${name}_L1`} inductance="100uH" footprint="1210" />
      <diode name={`${name}_D1`} footprint="sod123" />

      {/* Input bypass cap across VIN and GND */}
      <trace from={`.${name}_CIN > .pin1`} to={`.${name} > .VIN`} />
      <trace from={`.${name}_CIN > .pin2`} to={`net.${gndNet}`} />

      {/* Input net feeds VIN */}
      <trace from={`net.${inputNet}`} to={`.${name} > .VIN`} />

      {/* Switch node: regulator OUTPUT -> inductor -> output net */}
      <trace from={`.${name} > .OUTPUT`} to={`net.${swNode}`} />
      <trace from={`.${name}_L1 > .pin1`} to={`net.${swNode}`} />
      <trace from={`.${name}_L1 > .pin2`} to={`net.${outputNet}`} />

      {/* Catch (freewheeling) diode: cathode at switch node, anode at GND */}
      <trace from={`.${name}_D1 > .pin2`} to={`net.${swNode}`} />
      <trace from={`.${name}_D1 > .pin1`} to={`net.${gndNet}`} />

      {/* Output filter cap from output net to GND */}
      <trace from={`.${name}_COUT > .pin1`} to={`net.${outputNet}`} />
      <trace from={`.${name}_COUT > .pin2`} to={`net.${gndNet}`} />

      {/* Feedback sense tied to the 5V output (fixed-output variant) */}
      <trace from={`.${name} > .FEEDBACK`} to={`net.${outputNet}`} />

      {/* Tie GND pin and ONOFF (enable) to ground */}
      <trace from={`.${name} > .GND`} to={`net.${gndNet}`} />
      <trace from={`.${name} > .ONOFF`} to={`net.${gndNet}`} />
    </group>
  )
}

export default LM2576
