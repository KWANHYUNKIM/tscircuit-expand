import React from "react"
import { RootCircuit } from "@tscircuit/core"
import { Buck5V, Conn } from "./parts/index"
import { runErc, formatErc } from "./erc/runErc"

async function main() {
  const circuit = new RootCircuit()

  circuit.add(
    <board width="60mm" height="40mm">
      {/* Reusable LM2576 buck subcircuit: DCIN -> V5 (net names cannot use +/-) */}
      <Buck5V name="U1" inputNet="DCIN" outputNet="V5" gndNet="GND" />

      {/* 3-pin output connector with named pins */}
      <Conn name="J1" pins={["V5", "DAT", "GND"]} pcbX={20} pcbY={0} />

      {/* Wire the connector's named pins to the buck output / ground */}
      <trace from=".J1 > .V5" to="net.V5" />
      <trace from=".J1 > .GND" to="net.GND" />
    </board>,
  )

  await circuit.renderUntilSettled()
  const circuitJson = circuit.getCircuitJson() as any[]

  const sourceComponents = circuitJson.filter(
    (e) => e.type === "source_component",
  )
  const sourcePorts = circuitJson.filter((e) => e.type === "source_port")

  console.log("=== VERIFY iter4 ===")
  console.log("total circuit-json elements:", circuitJson.length)
  console.log("source_components:", sourceComponents.length)
  for (const sc of sourceComponents) {
    console.log(`  - name=${sc.name} ftype=${sc.ftype ?? "(chip/header)"}`)
  }

  // Prove the Conn applied the named pins: inspect J1's source_port hints.
  const j1 = sourceComponents.find((sc) => sc.name === "J1")
  if (!j1) {
    console.error("FAIL: J1 connector not found")
    process.exit(1)
  }
  const j1Ports = sourcePorts.filter(
    (p) => p.source_component_id === j1.source_component_id,
  )
  console.log("J1 connector source_port count:", j1Ports.length)
  for (const p of j1Ports) {
    console.log(
      `  port name=${p.name} hints=${JSON.stringify(p.port_hints)}`,
    )
  }

  const allHints = j1Ports.flatMap((p) => p.port_hints ?? [])
  const namedApplied = ["V5", "DAT", "GND"].every((n) =>
    allHints.includes(n),
  )
  console.log("J1 named pins applied:", namedApplied)

  // Run ERC on the rendered circuit-json.
  const ercResult = await runErc(circuitJson)
  console.log(formatErc(ercResult))

  if (sourceComponents.length === 0) {
    console.error("FAIL: no source components")
    process.exit(1)
  }
  if (!namedApplied) {
    console.error("FAIL: Conn named pins not present in port_hints")
    process.exit(1)
  }

  console.log("=== VERIFY iter4 OK ===")
}

main().catch((err) => {
  console.error("VERIFY ERROR:", err)
  process.exit(1)
})
