import "./App.css";
import { Editor } from "./components/editor";
import { Flags } from "./components/flags/flags.component";
import { MainMemory } from "./components/main-memory";
import { RegisterMemory } from "./components/register-memory";

function App() {
  return (
    <div className="App" style={{ display: "flex" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <RegisterMemory />
          <Flags />
        </div>
        <Editor />
        <MainMemory />
      </div>
    </div>
  );
}

export default App;
