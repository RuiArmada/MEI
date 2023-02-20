import { Link } from "react-router-dom";
import "../../css/blocks/Functions.scss";

export const EspFunctionsView = () => {
    return (
        <ul>
            <Link to={`/specialist/addGame`}>
                <button>
                    <p>Adicionar evento desportivo</p>
                </button>
            </Link>
            <Link to={`/specialist/removeGame`}>
                <button>
                    <p>Remover evento desportivo</p>
                </button>
            </Link>
            <Link to={`/specialist/changeOdd`}>
                <button>
                    <p>Alterar odd de evento desportivo</p>
                </button>
            </Link>
            <Link to={`/specialist/insert`}>
                <button>
                    <p>Inserir odd de evento desportivo</p>
                </button>
            </Link>
        </ul>
    )
}
