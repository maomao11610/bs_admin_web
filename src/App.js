/**
 * 应用的根组件
 */
import React, { Component } from 'react'
// import { Button, message } from 'antd'
// import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {
  /*handleClick = ()=>{
      message.success('This is a success message');
  }*/

  render() {
    return (
      /*<div>
         <Button type="primary" onClick={this.handleClick}>Primary</Button>
      </div>*/
      <Router>
        <Switch> {/*只匹配其中一个*/}
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </Router>

    )
  }
}



/*function App() {
  return (
    <div className="App">

    </div>
  );
}
export default App;
*/
