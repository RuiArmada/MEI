import "../../css/blocks/NavBar.scss";
import { Link, useNavigate } from "react-router-dom";
import userButton from "../../imgs/user_button.png";
import adminButton from "../../imgs/adminIcon.png";
import espButton from "../../imgs/especialistaIcon.png";
import { useStateValue } from "../../state";
import { useUserAuth } from "../../hooks/useAuth";

export const NavBar = () => {
    const { state } = useStateValue()
    const { signout } = useUserAuth()
    const isSelected = (path) => path === window.location.pathname;
    const nav = useNavigate()

    // useEffect(() => {console.log(state.authUser)}, [state.authUser])

    const logout = () => {
        signout()
        nav('/signin')
    }

    return (
        <nav>
            <h2>RasBet</h2>

            <ul>
                <Link to={`/todos`}>
                    <li className={isSelected("/todos") ? "selected" : ""}>
                        Todos
                    </li>
                </Link>

                <Link to={`/football`}>
                    <li className={isSelected("/football") ? "selected" : ""}>
                        Futebol
                    </li>
                </Link>

                <Link to={`/basketball`}>
                    <li className={isSelected("/basketball") ? "selected" : ""}>
                        Basquetebol
                    </li>
                </Link>

                <Link to={`/tenis`}>
                    <li className={isSelected("/tenis") ? "selected" : ""}>
                        Ténis
                    </li>
                </Link>

                <Link to={`/motogp`}>
                    <li className={isSelected("/motogp") ? "selected" : ""}>
                        MotoGP
                    </li>
                </Link>

                <Link to={`/admin`}>
                    <li className={isSelected("/admin") ? "selected" : ""}>
                        <img src={adminButton} />{" "}
                    </li>
                </Link>
                <Link to={`/specialist`}>
                    <li className={isSelected("/specialist") ? "selected" : ""}>
                        <img src={espButton} />{" "}
                    </li>
                </Link>
                <Link to={`/user`}>
                    <li className={isSelected("/user") ? "selected" : ""}>
                        <img src={userButton} />{" "}
                    </li>
                </Link>
            </ul>
            <div className="flex-vertical">
                <label>Bem vindo, { state.authUser && state.authUser.firstName }</label>
                <label className="logout-btn" onClick={logout}>Sair</label>
            </div>
        </nav>
    );
};
