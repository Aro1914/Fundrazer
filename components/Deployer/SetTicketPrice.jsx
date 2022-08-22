import React from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const SetTicketPrice = () => {
    const { handlePaymentAmount, defaultPaymentAmount, standardUnit, setAmount } = useReach();
    return (
        <div className={ useClasses(styles.subContainer) }>
            <span className={ useClasses(styles.littleText) }>{ standardUnit }</span>
            <input
                className={ useClasses(styles.fields) }
                type="number"
                placeholder={ defaultPaymentAmount }
                onChange={ (e) => setAmount(e.currentTarget.value) }
                autofocus
            />
            <button className={ useClasses(styles.actionButton) } onClick={ () => handlePaymentAmount() }>Set Ticket Price</button>
        </div>
    );
};

export default SetTicketPrice;