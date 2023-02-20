import { Link } from "react-router-dom";
import "../../css/blocks/Functions.scss";

export const FunctionsView = () => {
    return (
        <ul>
            <Link to={`/user/profile`}>
                <button>
                    <p>Perfil</p>
                </button>
            </Link>
            <Link to={`/user/notifications`}>
                <button>
                    <p>Notificações</p>
                </button>
            </Link>
            <Link to={`/user/mybets`}>
                <button>
                    <p>Histórico de apostas</p>
                </button>
            </Link>
            <Link to={`/user/mytransactions`}>
                <button>
                    <p>Histórico de transações</p>
                </button>
            </Link>
        </ul>
    )
}
