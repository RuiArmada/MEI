import "../../css/blocks/Functions.scss";
import { Link } from "react-router-dom";

export const AdminFunctionsView = () => {
    return (
        <ul>
            <Link to={`/admin/betState`}>
                <button>
                    Alterar estado da aposta
                </button>
            </Link>
            <Link to={`/admin/manageNotifications`}>
                <button>
                    Gerir Notificações
                </button>
            </Link>
            <Link to={`/admin/createPromotions`}>
                <button>
                    Criar Promoções
                </button>
            </Link>
        </ul>
    )
}