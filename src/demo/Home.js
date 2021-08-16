import {Link} from "react-router-dom";
import '../App.css';

export const Home = () => {
    return (
        <div className='nav' >
            <Link to='/DrawLineDemo'>画线demo</Link>
            <Link to='/InitDemo'>初始demo</Link>
            <Link to='/FontDemo'>文字demo</Link>
            <Link to='/3DDemo'>3D-demo</Link>
        </div>
    )
}
