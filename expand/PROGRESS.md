# tscircuit-expand — 진행 로그 (3-Agent Loop)

## 목표
KiCad(회로도 편집기)와 `farmin_aqd_main` 실제 설계를 **기준**으로 삼아,
tscircuit에 부족한 **부품/기능을 하나씩 추가·수정**한다. 두 트랙:
- **트랙 A — 부품/회로 재현**: AQD 보드를 tscircuit TSX로 재현하며 없는 부품(릴레이, 옵토커플러, RS-485, MAX232, LM2576, 다핀 커넥터 등)을 tscircuit 컴포넌트로 구현.
- **트랙 B — 에디터 기능**: KiCad가 가진 기능을 tscircuit에 구현 (.kicad_sch import, ERC, BOM 생성, 네트리스트 등).

## 3-에이전트
- 🔍 Analyzer — tscircuit 지원범위 조사 + AQD/KiCad 대비 기능 갭 도출
- 🔧 Builder — 컴포넌트/기능을 `expand/`에 구현
- 👁 Supervisor — 타입체크/dev서버/리뷰 + git 커밋 + tscircuit-expand 푸시

## 규칙
- 작업은 `tscircuit` 레포 `expand/` 폴더에만. 업스트림 메타패키지 파일은 안 건드림.
- 매 반복 = 한 기능. 커밋 + (가능시) 푸시.
- AQD 부품 구현 시 ANALYSIS(`farmin_aqd_work/docs/ANALYSIS.md`)의 네트/부품을 근거로.

---

## Iterations
- (1, 사전) farmin_aqd 분석 완료 → `farmin_aqd_work/docs/ANALYSIS.md`, BACKLOG, BOM.
- (2) ☑ Analyzer: tscircuit 지원범위 조사 → `expand/BACKLOG.md`. 핵심발견: .kicad_sch import/ERC/BOM/netlist이 node_modules에 이미 존재(트랙B는 래핑 위주). 릴레이/옵토/RS-485/MAX232/LM2576은 native 없음→`<chip>` 커스텀.
- (3) ☑ Builder: A1 `defineChip` 헬퍼 + A2 PC817 옵토커플러 + A3 RS-485/MAX232 구현. RootCircuit 렌더 검증 OK(5 컴포넌트, trace 3/3 연결). MAX232 `+/-`핀 라벨 드롭 발견→C1P/VP 등으로 alias.
  - 검증: `bun expand/parts/__verify__.tsx` → `=== VERIFY OK ===`
- (4) ☑ Builder: A4 LM2576+`Buck5V` 서브회로 + A6 `Conn` 커넥터 래퍼 + B2 ERC 래퍼(`runErc`/`formatErc`). 검증 `bun expand/__verify_iter4__.tsx` OK(6부품, named핀 적용, ERC 위반 3건 반환). 발견: `to220_5`, pinheader는 pinLabels배열형, 네트명 `+/-`불가→DCIN/V5.
  - 남은 핵심: A5(릴레이 커스텀 풋프린트, med-high) → A7(AQD 보드 전체 조립) → B1/B3/B4/B5.
  - 다음: A5(릴레이) 후 A7(보드 조립)이 가시적 결과물.
