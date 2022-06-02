import {Link} from "react-router-dom";
import '../App.css';

export const Home = () => {
    return (
        <div className='nav' >
            <Link to='/DrawLineDemo'>画线demo</Link>
            <Link to='/InitDemo'>滚动demo</Link>
            <Link to='/FontDemo'>文字demo</Link>
            <Link to='/3DGlb'>3D-glb</Link>
            <Link to='/3DTexture'>3D-texture</Link>
            <Link to='/TDAnimation'>3D-Animation</Link>
            <Link to='/TDEarth'>3D-Earth</Link>
            <Link to='/BeautifulEarth'>3D-BeautifulEarth</Link>
            <Link to='/EarthScreen'>3D-EarthScreen</Link>
            <Link to='/3DGlbBig'>3DGlbBig</Link>
        </div>
    )
}
