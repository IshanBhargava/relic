import { Link } from "react-router-dom";

const Nav = () => {
    return ( 
        <div id="navbar" className="h-1/6 flex justify-center p-2 border-b-2 border-white">
            <span className="text-white text-4xl">
                <Link to="/">Relic Motors</Link>
            </span>
        </div>
     );
}
 
export default Nav;