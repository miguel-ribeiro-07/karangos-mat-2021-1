/*import logo from './logo.svg';
import './App.css';
import Button from "@material-ui/core/Button"
*/
  /*return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Button variant="contained" color="primary">Clique Aqui!</Button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );*/
import TopBar from "./ui/TopBar"
import FooterBar from "./ui/FooterBar";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import yellow from "@material-ui/core/colors/yellow";
import { dark } from "@material-ui/core/styles/createPalette";

const theme = createMuiTheme({
  palette: {
    primary: {
      type:dark,
      main: yellow[500],
    },
    secondary: {
      main: red[500],
    },
  },
});
function App() {
  return(<div>
    <ThemeProvider theme={theme}>
    <TopBar/>
    <FooterBar></FooterBar>
    </ThemeProvider>
    </div>)
}

export default App;
