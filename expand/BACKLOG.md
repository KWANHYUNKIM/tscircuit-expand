# tscircuit-expand — 기능 백로그

> KiCad/AQD 기준으로 tscircuit에 추가할 기능. 한 반복 = 한 항목.
> 상태: ☐ 대기 · ◐ 진행 · ☑ 완료

## 트랙 A — 부품/회로 재현 (AQD에 필요한데 tscircuit에 없는 부품)
| id | 제목 | risk | 상태 | 구현 |
|---|---|---|---|---|
| A1 | 커스텀 부품 스캐폴드 `defineChip()` 헬퍼 | low | ☑ | `<chip>` 래핑 (`expand/parts/defineChip.tsx`) |
| A2 | 옵토커플러 PC817 컴포넌트 | low | ☑ | `dip4`, A/C/E/Col (`Optocoupler.tsx`) |
| A3 | RS-485 트랜시버 + MAX232 | low-med | ☑ | soic8/soic16. ⚠ `+/-`핀 드롭→C1P/VP로 alias |
| A4 | LM2576 레귤레이터 + 벅 서브회로 | med | ☐ | `to220-5` + `<subcircuit>` |
| A5 | 릴레이 ALDP105 (커스텀 풋프린트) | med-high | ☐ | `.kicad_mod`/`<footprint>` platedhole |
| A6 | CN.1~19 다핀 커넥터 래퍼 | low | ☐ | `<pinheader>`/`<connector>` + pcbPinLabels |
| A7 | farmin_aqd_main 보드 TSX 전체 조립 | high | ☐ | A1~A6 + native, `<trace>`/`<net>` |

## 트랙 B — 에디터 기능 (KiCad 기능을 tscircuit에)
> ⚠ 핵심 기능 다수가 node_modules에 이미 존재 → 재발명 X, 래핑/UX/검증이 핵심
| id | 제목 | risk | 상태 | 비고 |
|---|---|---|---|---|
| B1 | `.kicad_sch` import 래퍼 + 스모크테스트 | low | ☐ | `KicadToCircuitJsonConverter` 이미 .sch 지원 |
| B2 | ERC 리포트 래퍼 | low | ☐ | `@tscircuit/checks` `runAllChecks` 래핑 |
| B3 | BOM 익스포터 (프로그램적) | med | ☐ | CLI엔 있음 → importable util로 |
| B4 | readable netlist export 래퍼 | low | ☐ | `convertCircuitJsonToReadableNetlist` |
| B5 | KiCad 라운드트립 diff 하네스 | high | ☐ | .kicad_pcb/.sch import vs A7 비교 |

## 순서
A1→A2 (싸고 모든 부품 unblock) → B1/B2 끼워넣기(기존기능 래핑, 저위험 고신호) → A3~A6 → A7/B5(고위험) 마지막.

## 검증 방법
- 프로그램: `import { RootCircuit } from "tscircuit"` → `add(<board>)` → `renderUntilSettled()` → `getCircuitJson()`
- ERC: `runAllChecks(circuitJson)`
- UI: `bun cli.mjs dev <file.tsx> --port 3020`
