import React from 'react';
import ReactDOM from 'react-dom';
// import Workcircle from "./component/Workcircle.js"
// import Mine from "./component/Mine.js"
// import Findjob from "./component/Findjob.js"
// import Findworker from "./component/Findworker.js"
// import Find from "./component/Find.js"
import './index.css';
// import {Router,Route} from "react-router";
import Cityselectwrap from './Cityselect.js'
// import {createStore} from 'redux';
// import { Provider } from 'react-redux'
// import set_page from "./reducers.js"
// import FooterWrap from "./Footer.js"

// const store = createStore(set_page);
ReactDOM.render(<Cityselectwrap></Cityselectwrap>,document.getElementById('root'))
