import { ThemeProvider } from "styled-components";
import {BrowserRouter} from 'react-router-dom';
import { Router } from "./routes/Router";


import { GlobalStyle } from "./styles/themes/global";
import { defaultTheme } from "./styles/themes/default";
import { CyclesContextProvider } from "./contexts/CyclesContext";



export function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
   
      <BrowserRouter>
        <CyclesContextProvider>
          <Router/>
        </CyclesContextProvider>
          
      </BrowserRouter>

     <GlobalStyle/>
    </ThemeProvider>
  )
}

