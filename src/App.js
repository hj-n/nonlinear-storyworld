import './App.css';
import Narrative from './components/Narrative';

function App() {

  const size = 400;
  const margin = 20;
  const stroke = 10;

  return (
    <div className="App">
      {"Demo"}
      <Narrative
        size={size}
        margin={margin}
        stroke={stroke}
      />
    </div>
  );
}

export default App;
