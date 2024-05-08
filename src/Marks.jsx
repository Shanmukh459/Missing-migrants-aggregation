export const Marks = ({ binnedData, xScale, yScale, innerHeight }) => 
  binnedData.map((d, i) => (
    <rect
      key={i}
      className="marks"
      x={xScale(d.x0)}
      y={yScale(d.totalDeadAndMissing)}
      width={xScale(d.x1) - xScale(d.x0)}
      height={innerHeight - yScale(d.totalDeadAndMissing)}
    >
    <title>{d.totalDeadAndMissing}</title>
    </rect>
  ))