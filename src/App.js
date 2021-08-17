import './App.css';
import {BrowserRouter, Route} from "react-router-dom";
import {InitDemo} from "./demo/初始demo";
import {DrawLineDemo} from "./demo/画线demo";
import {Home} from "./demo/Home";
import {FontDemo} from "./demo/文字demo";
import {TDGlb} from "./demo/3DGlb";
import {TDTexture} from "./demo/3DDTexture";
import {TDAnimation} from "./demo/3DAnimat";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Home/>
                <Route exact path="/"/>
                <Route path="/DrawLineDemo" component={DrawLineDemo}/>
                <Route path="/InitDemo" component={InitDemo}/>
                <Route path="/FontDemo" component={FontDemo}/>
                <Route path="/3DGlb" component={TDGlb}/>
                <Route path="/3DTexture" component={TDTexture}/>
                <Route path="/TDAnimation" component={TDAnimation}/>
            </BrowserRouter>
            <div className='showDemos'/>
        </div>
    );
}

export default App;
