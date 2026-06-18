import React from "react"
import type { ChipProps, PinLabelsProp } from "@tscircuit/props"

/**
 * Options for {@link defineChip}.
 *
 * - `pinLabels`: maps physical pin numbers (e.g. "pin1") to human-friendly
 *   names (e.g. "VCC"). These become the named ports usable in `<trace>`s.
 * - `footprint`: a footprinter string (e.g. "dip4", "soic8", "soic16") that
 *   describes the physical package.
 * - `schPinArrangement`: optional schematic pin arrangement passed through to
 *   the underlying `<chip>`.
 * - `defaultProps`: optional props merged in before caller-supplied props.
 */
export interface DefineChipOptions {
  pinLabels: PinLabelsProp
  footprint: string
  schPinArrangement?: any
  defaultProps?: Partial<ChipProps>
}

/**
 * Props accepted by a component produced by {@link defineChip}. Typed loosely
 * on purpose: callers pass `name`, optional position props, and pin
 * connections. `pinLabels`/`footprint` are fixed by the definition but may be
 * overridden if a caller really wants to.
 */
export type DefinedChipProps = Partial<ChipProps> & {
  name: string
  [key: string]: any
}

/**
 * Create a reusable TSX component that wraps tscircuit's `<chip>` with a fixed
 * set of pin labels and a footprint. This lets us ship "missing" multi-pin
 * parts that tscircuit lacks natively.
 *
 * @example
 *   const PC817 = defineChip({
 *     pinLabels: { pin1: "ANODE", pin2: "CATHODE", pin3: "EMITTER", pin4: "COLLECTOR" },
 *     footprint: "dip4",
 *   })
 *   // <PC817 name="OK1" />
 */
export function defineChip(options: DefineChipOptions) {
  const { pinLabels, footprint, schPinArrangement, defaultProps } = options

  const DefinedChip = (props: DefinedChipProps) => {
    const mergedProps: any = {
      ...(defaultProps ?? {}),
      footprint,
      pinLabels,
      ...(schPinArrangement ? { schPinArrangement } : {}),
      ...props,
    }

    // `chip` is the lowercased intrinsic element provided by tscircuit's JSX.
    return React.createElement("chip", mergedProps)
  }

  return DefinedChip
}

export default defineChip
