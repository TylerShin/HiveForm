import "./App.css";
import { Button } from "hiveform";

const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <div style={{ marginTop: "20px" }}>
        <Button
          label="Primary Button"
          primary
          onClick={() => alert("Primary clicked!")}
        />
        <Button
          label="Secondary Button"
          onClick={() => alert("Secondary clicked!")}
        />
      </div>
    </div>
  );
};

export default App;
