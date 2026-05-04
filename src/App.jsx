import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRouter from "./router/AppRouter";
import LenisWrapper from "./components/LenisWrapper";

function App() {
  return (
    <>
      <LenisWrapper>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </LenisWrapper>
    </>
  );
}

export default App;
