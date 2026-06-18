export default () => (
  <board width="20mm" height="20mm">
    <resistor name="R1" resistance="10k" footprint="0805" pcbX={-4} pcbY={0} />
    <capacitor name="C1" capacitance="100nF" footprint="0805" pcbX={4} pcbY={0} />
    <trace from=".R1 > .pin2" to=".C1 > .pin1" />
  </board>
)
