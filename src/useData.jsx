import { csv } from "d3";
import { useState, useEffect } from "react"

const csvUrl = 'https://gist.githubusercontent.com/Shanmukh459/4c248231ead6a0e01c9247afa4f57238/raw/b3f45c10cec4631522f1b7bfe2918310385a3802/MissingMigrants-Global-2019-10-08T09-47-14-subset.csv';

export const useData = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const row = d => {
      d['Reported Date'] = new Date(d['Reported Date'])
      d['Total Dead and Missing'] = +d['Total Dead and Missing']
      return d
    }
    csv(csvUrl, row).then(setData)
  }, [])
  return data
}