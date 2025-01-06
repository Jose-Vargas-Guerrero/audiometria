import { Link } from "react-router";
import home from '../images/home.png'

function Home() {
  return (
    <Link to="/">
      <img className="iconHome" src={home} />
    </Link>
  );
}

export default Home;
