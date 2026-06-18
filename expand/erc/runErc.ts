import { runAllChecks } from "@tscircuit/checks"
import type { AnyCircuitElement } from "circuit-json"

export interface ErcViolation {
  /** circuit-json element `type` (e.g. "pcb_port_not_connected_error"). */
  type: string
  /** Human-readable description of the violation. */
  message: string
}

export interface ErcResult {
  /** true when there are zero violations. */
  ok: boolean
  /** number of violations found. */
  count: number
  violations: ErcViolation[]
}

/**
 * Run all of @tscircuit/checks' ERC/DRC checks against a circuit-json array.
 *
 * `runAllChecks` is async and returns an array of circuit-json "error"-type
 * elements (PcbPortNotConnectedError, SourcePinMustBeConnectedError, various
 * warnings, etc). Each element carries a `type` and a `message`; many also
 * carry an `error_type`. We map them into a uniform structured result.
 */
export async function runErc(
  circuitJson: AnyCircuitElement[],
): Promise<ErcResult> {
  const raw = await runAllChecks(circuitJson)

  const violations: ErcViolation[] = (raw ?? []).map((el: any) => ({
    type: el.error_type ?? el.type ?? "unknown_error",
    message:
      el.message ??
      el.error_message ??
      `(${el.error_type ?? el.type ?? "error"} with no message)`,
  }))

  return {
    ok: violations.length === 0,
    count: violations.length,
    violations,
  }
}

/**
 * Render an {@link ErcResult} as a human-readable multi-line report.
 */
export function formatErc(result: ErcResult): string {
  const lines: string[] = []
  lines.push("=== ERC report ===")
  lines.push(`status: ${result.ok ? "PASS (no violations)" : "FAIL"}`)
  lines.push(`violations: ${result.count}`)

  if (result.count > 0) {
    // Group counts by type for a quick summary.
    const byType = new Map<string, number>()
    for (const v of result.violations) {
      byType.set(v.type, (byType.get(v.type) ?? 0) + 1)
    }
    lines.push("by type:")
    for (const [type, n] of byType) {
      lines.push(`  ${type}: ${n}`)
    }
    lines.push("details:")
    result.violations.forEach((v, i) => {
      lines.push(`  ${i + 1}. [${v.type}] ${v.message}`)
    })
  }

  lines.push("=== end ERC report ===")
  return lines.join("\n")
}

export default runErc
