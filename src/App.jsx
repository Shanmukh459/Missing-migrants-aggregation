import { bin, extent, max, scaleLinear, scaleTime, sum, timeMonths } from "d3"
import { useData } from "./useData"

const height = 500
const width = 960

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
}

function App() {
  const data = useData()

  if(!data) {
    return <h1>Loading...</h1>
  }

  const innerHeight = height - margin.top - margin.bottom
  const innerWidth = width - margin.left - margin.right

  const xValue = d => d['Reported Date']
  const yValue = d => d['Total Dead and Missing']

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
    .range([0, innerHeight])
    .nice()

  return (
    <svg width={width} height={height}>
      {
        binnedData.map((d, i) => (
          <rect
            key={i}
            x={xScale(d.x0)}
            y={yScale(d.totalDeadAndMissing)}
            width={xScale(d.x1) - xScale(d.x0)}
            height={innerHeight - yScale(d.totalDeadAndMissing)}
          >
          <title>{d.totalDeadAndMissing}</title>
          </rect>
        ))
      }
    </svg>
  )
}
export default App
