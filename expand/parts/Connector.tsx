import React from "react"

export interface ConnProps {
  /** Reference designator / name for the connector. */
  name: string
  /** Named pin labels, in physical pin order. pinCount is derived from this. */
  pins: string[]
  /** Pin-to-pin spacing. Default "2.54mm". */
  pitch?: string
  /** Whether the header has two rows of pins. */
  doubleRow?: boolean
  /** Optional explicit PCB position. */
  pcbX?: number
  pcbY?: number
  [key: string]: any
}

/**
 * A multi-pin connector wrapper around tscircuit's `<pinheader>`.
 *
 * The `pins` array supplies named labels in physical order; `pinCount` is
 * derived from its length. The same names are applied both as schematic/port
 * `pinLabels` (making each pin addressable by name, e.g. `.J1 > .DAT`) and as
 * `pcbPinLabels` (silkscreen/PCB labels).
 *
 * pinheader's `pinLabels` accepts an array of labels (index 0 -> pin 1). Using
 * the array form means each entry becomes the named port for that pin, so the
 * label shows up in the source_port port_hints and is usable as a trace
 * selector / net name.
 */
export const Conn = (props: ConnProps) => {
  const {
    name,
    pins,
    pitch = "2.54mm",
    doubleRow,
    pcbX,
    pcbY,
    ...rest
  } = props

  // pcbPinLabels is keyed by pin number ("1".."N").
  const pcbPinLabels: Record<string, string> = {}
  pins.forEach((label, i) => {
    pcbPinLabels[String(i + 1)] = label
  })

  const headerProps: any = {
    name,
    pinCount: pins.length,
    pitch,
    // Array form: index i -> physical pin (i+1). Becomes the named port.
    pinLabels: pins,
    pcbPinLabels,
    showSilkscreenPinLabels: true,
    ...(doubleRow !== undefined ? { doubleRow } : {}),
    ...(pcbX !== undefined ? { pcbX } : {}),
    ...(pcbY !== undefined ? { pcbY } : {}),
    ...rest,
  }

  return React.createElement("pinheader", headerProps)
}

export default Conn
