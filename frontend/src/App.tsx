import { useEffect, useState } from "react";
import "./App.css";
import { fetchData, type ApiResponse } from "./Client.ts";

function App() {
   const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    fetchData()
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);
  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>Fridge Management</h1>
        {data ? <p>Response: {data.message}</p> : <p>Loading from API...</p>}
      </div>
    </>
  );
}

export default App;
