import logo from './logo.svg';
import './App.css';
import Barcode from './barcode';
import AppRouter from './AppRouter';
import { Provider } from 'react-redux';
import store from './redux/store';
import router from './AppRouter';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"
function App() {
  return (
    <Provider store={store}>
     <div className="App">
     <AppRouter  />
    </div>
  </Provider>
   
  );
}

export default App;
