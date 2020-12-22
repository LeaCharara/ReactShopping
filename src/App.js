import './App.css';
import ProductPage from './Components/ProductsPage'
import NavigationBar from './Components/NavigationBar'
import {BrowserRouter as Router, Route,Switch, Redirect} from 'react-router-dom';
import ItemDetail from './Components/Item_Detail'
import Login from './Components/Login'
import {AuthProvider} from './Components/AuthContext'
import {positions, Provider} from "react-alert"
import AlertTemplate from "react-alert-template-basic"
import Cart from './Components/Cart'
import SignUp from './Components/SignUp'
import ForgotPassword from './Components/ForgotPassword'
import 'bootstrap/dist/css/bootstrap.css';


const options = {
  timout: 1000,
  positions : positions.MIDDLE
}

function App() {
  return (
    <Router>
      <Switch>
        <Provider template={AlertTemplate} {...options}>
          <AuthProvider>
            <NavigationBar />
            <Redirect from="/" exact to="/Products" />
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/resetpassword" component={ForgotPassword}/>
            <Route path="/Products" component={ProductPage}/>
            <Route path="/Details" component={ItemDetail}/>
            <Route path="/Cart" component={Cart}/>
          </AuthProvider>
        </Provider>
      </Switch>
    </Router>
  );
}

export default App;
