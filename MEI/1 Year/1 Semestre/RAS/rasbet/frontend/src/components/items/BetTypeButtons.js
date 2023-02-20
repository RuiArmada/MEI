import "../../css/items/BetTypeButtons.scss";
import { BetType } from "../../models/BetType";

export const BetTypeButtons = ({ betType, changeBetType }) => {
    return (
        <div className="joint-btn">
            <button
                className={betType === BetType.Simple ? "selected" : ""}
                onClick={() => changeBetType(BetType.Simple)}
            >
                Simples
            </button>
            <button
                className={betType === BetType.Combined ? "selected" : ""}
                onClick={() => changeBetType(BetType.Combined)}
            >
                Combinada
            </button>
            <button
                className={betType === BetType.Multiple ? "selected" : ""}
                onClick={() => changeBetType(BetType.Multiple)}
            >
                Múltipla
            </button>
        </div>
    );
};
