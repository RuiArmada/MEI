import { useState } from "react"
import mbLogo from '../../imgs/mb_logo.png'
import mbWayLogo from '../../imgs/mbway_logo.png'
import visaMstCardLogo from '../../imgs/visa_mastercard_logo.png'
import '../../css/blocks/PaymentModal.scss'
import { placeBet } from "../../utils/betsApis"


export const PaymentModal = ({bets, closeModal}) => {
    const [ step, setStep ] = useState(1)

    const isActive = (currStep) => {
        if(step === currStep) return ' bubble-active'
        else return ''
    }

    const onBgClick = e => {
        e.stopPropagation()
        closeModal()
    }

    const makePayment = async (paymentType, paymentData) => {
        const parsedBets = bets.map(bet => {
            console.log(bet)
            return {
                gameId: bet.gameId,
                oddId: bet.oddId,
                value: bet.total
            }
        })
        const payment = { paymentType, paymentData }

        const res = await placeBet(parsedBets, payment)
        if(res.status) setStep(3)
    }

    return (
        <div className="payment-modal-bg" onClick={closeModal}>
            <div className="payment-modal-container" onClick={e => e.stopPropagation()}>
                <h1>Pagamento</h1>
                
                {
                    step === 1 &&
                        <PaymentSelection setStep={setStep} />
                }
                {
                    step === 2 &&
                        <MbWayPayment
                            setStep={setStep}
                            makePayment={makePayment}/>
                }
                {
                    step === 3 &&
                        <h2> Pagamento efetuado com sucesso! </h2>
                }
                
                <div className="steps-container">
                    <div className={"bubble " + isActive(1)}><p>1</p></div>
                    <div className="line"></div>
                    <div className={"bubble " + isActive(2)}><p>2</p></div>
                    <div className="line"></div>
                    <div className={"bubble " + isActive(3)}><p>3</p></div>
                </div>
            </div>
        </div>
    )
}

const PaymentSelection = ({setStep}) => {
    return (
        <main className="content">
            <label>Método de Pagamento:</label>
            <div className="img-btn">
                <img src={mbLogo} />
            </div>
            <div className="img-btn" onClick={() => setStep(2)}>
                <img src={mbWayLogo} />
            </div>
            <div className="img-btn">
                <img src={visaMstCardLogo} />
            </div>
        </main>
    )
}

const MbWayPayment = ({ setStep, makePayment }) => {
    const [ phoneNumber, setPhoneNumber ] = useState(0)

    const onPhoneNumberChange = e => {
        console.log(e.currentTarget.value)
        console.log(parseInt(e.currentTarget.value))
        if(e.currentTarget.value === '' || e.currentTarget.value.length > 9)
            setPhoneNumber(parseInt(phoneNumber))
        else
            setPhoneNumber(parseInt(e.currentTarget.value))
    }

    const payButtonClick = () => {
        makePayment('MBWAY', {
            phone: phoneNumber
        })
    }

    return (
        <main className="content">
            <div className="mbway-payment-container">
                <div className="img-btn">
                    <img src={mbWayLogo} />
                </div>

                <div className="phone-input">
                    +351 <input
                        type="number"
                        placeholder="Nº de telemóvel"
                        value={phoneNumber} 
                        onChange={onPhoneNumberChange} />
                </div>

                <div className="btns">
                    <button onClick={payButtonClick}>
                        Pagar
                    </button>
                    <button onClick={() => setStep(1)}>Cancelar</button>
                </div>
            </div>
        </main>
    )
}