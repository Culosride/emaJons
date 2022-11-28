import React from "react"
import { createRoot } from "react-dom/client"
import Header from "./components//header/Header.jsx"

export default function App() {
  return(
      <div>
        <h1>test react</h1>
        <Header />
      </div>
  )
}

const root = createRoot(document.getElementById("root"))
root.render(<App />)
