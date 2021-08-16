import './App.css';
import {BrowserRouter, Route} from "react-router-dom";
import {InitDemo} from "./demo/初始demo";
import {DrawLineDemo} from "./demo/画线demo";
import {Home} from "./demo/Home";
import {FontDemo} from "./demo/文字demo";
import {TDDemo} from "./demo/3Ddemo";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Home/>
                <Route exact path="/"/>
                <Route path="/DrawLineDemo" component={DrawLineDemo}/>
                <Route path="/InitDemo" component={InitDemo}/>
                <Route path="/FontDemo" component={FontDemo}/>
                <Route path="/3DDemo" component={TDDemo}/>
            </BrowserRouter>
            <div className='showDemos'/>
        </div>
    );
}

export default App;
