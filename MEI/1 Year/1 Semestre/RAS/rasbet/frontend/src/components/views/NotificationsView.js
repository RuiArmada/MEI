import { NotificationCard } from "../items/NotificationCard";
import "../../css/blocks/NotificationsModal.scss";

export const NotificationsView = () => {
    const notificationsList = [
        {
            id: "dnied19e123",
            msg: "O jogo Benfica - Rio Ave no qual apostou chegou ao fim. Parabéns, ganhou!",
            date: "2022-12-02T19:30:00.000Z",
        },
        {
            id: "akdkahdskd",
            msg: "O jogo Vitória SC - Arouca no qual apostou chegou ao fim. Oops, não teve sorte!",
            date: "2022-12-19T12:30:00.000Z",
        },
        {
            id: "019382jdks",
            msg: "O jogo Braga - Famalicão no qual apostou chegou ao fim. Parabéns, ganhou!",
            date: "2022-11-30T08:22:00.000Z",
        },
        {
            id: "0392dakcnh",
            msg: "O jogo Sporting - Marinhense no qual apostou chegou ao fim. Oops, não teve sorte!",
            date: "2022-10-09T14:15:00.000Z",
        },
    ]

    return (
        <div className="notifications-container">
            <h2>Notificações</h2>
            <div className="notifications-modal">
                {notificationsList && notificationsList.length > 0
                ? notificationsList.map(notification => (
                    <NotificationCard
                        key={notification.id}
                        notification={notification}
                    /> )
                ) : (
                    <dic className="no-notifications-label">
                        <hr className="solid"></hr>
                        <p>Sem notificações</p>
                    </dic>
                )}
            </div>
        </div>
    )
}
