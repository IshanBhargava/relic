import { Link } from "react-router-dom";

const Nav = () => {
    return ( 
        <div id="navbar" className="h-1/6 flex justify-center p-2 border-b-2 ">
            <span className="text-[#000080] text-4xl">
                <Link to="/">Relic Motors</Link>
            </span>
        </div>
     );
}
 
export default Nav;