import { useData } from "./useData"


function App() {
  const data = useData()

  if(!data) {
    return <h1>Loading...</h1>
  }

  console.log(data)

  return <h1>Missing migrants Aggregation!</h1>
}

export default App
