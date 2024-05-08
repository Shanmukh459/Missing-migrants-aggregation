import { bin, extent, max, scaleLinear, scaleTime, sum, timeFormat, timeMonths } from "d3"
import { useData } from "./useData"

const height = 500
const width = 960

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 80
}

function App() {
  const data = useData()

  if(!data) {
    return <h1>Loading...</h1>
  }

  const innerHeight = height - margin.top - margin.bottom
  const innerWidth = width - margin.left - margin.right

  const xValue = d => d['Reported Date']
  const xAxisLabel = 'Time'

  const yValue = d => d['Total Dead and Missing']
  const yAxisLabel = 'Total Dead and Missing'

  const xAxisTickFormat = timeFormat('%m/%d/%Y')

  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice()

  const [start, stop] = xScale.domain()
  
  const binnedData = bin()
    .value(xValue)
    .domain(xScale.domain())
    .thresholds(timeMonths(start, stop))(data)
    .map(array => ({
      totalDeadAndMissing: sum(array, yValue),
      x0: array.x0,
      x1: array.x1
    }))

  const yScale = scaleLinear()
    .domain([0, max(binnedData, d => d.totalDeadAndMissing)])
    .range([innerHeight, 0])
    .nice()

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {xScale.ticks().map(tickValue => (
          <g className="ticks" key={tickValue} transform={`translate(${xScale(tickValue)}, 0)`}>
            <line y2={innerHeight} />
            <text 
              y={innerHeight+5}
              textAnchor="middle"
              dy="0.71em"
            >{xAxisTickFormat(tickValue)}</text>
          </g>
        ))}
        <text
          className="axis-label"
          x={innerWidth/2}
          y={innerHeight+50}
          textAnchor="middle"
        >{xAxisLabel}</text>
        {yScale.ticks().map(tickValue => (
          <g className="ticks" key={tickValue} transform={`translate(0, ${yScale(tickValue)})`}>
            <line x2={innerWidth} />
            <text
              textAnchor="end"
              dy="0.32em"
              x={-3}
            >{tickValue}</text>
          </g>
        ))}
        <text
          className="axis-label"
          textAnchor="middle"
          transform={`translate(-50, ${innerHeight/2}) rotate(-90)`}
        >{yAxisLabel}</text>
        {
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
        }
      </g>
    </svg>
  )
}
export default App
