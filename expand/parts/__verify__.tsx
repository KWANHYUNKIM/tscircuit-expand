import React from "react"
import { RootCircuit } from "@tscircuit/core"
import { PC817, RS485, MAX232 } from "./index"

async function main() {
  const circuit = new RootCircuit()

  circuit.add(
    <board width="40mm" height="40mm">
      <PC817 name="OK1" pcbX={-12} pcbY={8} />
      <RS485 name="U1" pcbX={0} pcbY={0} />
      <MAX232 name="U2" pcbX={12} pcbY={-8} />

      <resistor name="R1" resistance="1k" footprint="0805" pcbX={-12} pcbY={0} />
      <resistor name="R2" resistance="120" footprint="0805" pcbX={0} pcbY={8} />

      {/* Connect a resistor into the PC817 LED anode */}
      <trace from=".R1 > .pin2" to=".OK1 > .ANODE" />
      {/* Terminate the RS485 bus A/B with a resistor */}
      <trace from=".R2 > .pin1" to=".U1 > .A" />
      {/* Address a charge-pump pin on MAX232 by its label */}
      <trace from=".R2 > .pin2" to=".U2 > .C1P" />
    </board>,
  )

  await circuit.renderUntilSettled()
  const circuitJson = circuit.getCircuitJson()

  const sourceComponents = circuitJson.filter(
    (e: any) => e.type === "source_component",
  ) as any[]
  const sourcePorts = circuitJson.filter(
    (e: any) => e.type === "source_port",
  ) as any[]
  const sourceTraces = circuitJson.filter(
    (e: any) => e.type === "source_trace",
  ) as any[]
  const pcbComponents = circuitJson.filter(
    (e: any) => e.type === "pcb_component",
  ) as any[]
  const pcbPorts = circuitJson.filter((e: any) => e.type === "pcb_port") as any[]

  console.log("=== VERIFY expand/parts ===")
  console.log("total circuit-json elements:", circuitJson.length)
  console.log("source_components:", sourceComponents.length)
  for (const sc of sourceComponents) {
    const portCount = sourcePorts.filter(
      (p) => p.source_component_id === sc.source_component_id,
    ).length
    console.log(
      `  - name=${sc.name} ftype=${sc.ftype ?? "(chip)"} source_ports=${portCount}`,
    )
  }
  console.log("source_ports (total):", sourcePorts.length)
  console.log("source_traces:", sourceTraces.length)
  console.log("pcb_components:", pcbComponents.length)
  console.log("pcb_ports:", pcbPorts.length)

  // Show the named pin labels resolved for one of the custom chips (U2 = MAX232)
  const u2 = sourceComponents.find((sc) => sc.name === "U2")
  if (u2) {
    const u2Ports = sourcePorts
      .filter((p) => p.source_component_id === u2.source_component_id)
      .map((p) => p.name)
    console.log("U2 (MAX232) port names:", JSON.stringify(u2Ports))
  }

  const names = sourceComponents.map((sc) => sc.name).sort()
  const expected = ["OK1", "R1", "R2", "U1", "U2"]
  const ok = expected.every((n) => names.includes(n))
  console.log("expected component names present:", ok, JSON.stringify(names))

  if (!ok) {
    console.error("FAIL: missing expected components")
    process.exit(1)
  }

  // Prove the named-pin traces actually connected two ports each.
  const connectedTraces = sourceTraces.filter(
    (t: any) => (t.connected_source_port_ids ?? []).length >= 2,
  )
  console.log(
    `traces connecting >=2 ports: ${connectedTraces.length}/${sourceTraces.length}`,
  )
  if (connectedTraces.length !== sourceTraces.length) {
    console.error("FAIL: some named-pin traces did not resolve")
    process.exit(1)
  }

  console.log("=== VERIFY OK ===")
}

main().catch((err) => {
  console.error("VERIFY ERROR:", err)
  process.exit(1)
})
