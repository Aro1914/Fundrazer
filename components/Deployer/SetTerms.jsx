import React from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const SetTerms = () => {
    const { defaultPaymentAmount, defaultDeadline, standardUnit, setDeadline, setAmount, connector, finalizeTerms } = useReach();
    return (
        <div className={ useClasses(styles.subContainer) }>
            <span className={ useClasses(styles.littleText) }>Set Ticket Price in { standardUnit }</span>
            <input
                className={ useClasses(styles.fields) }
                type="number"
                placeholder={ defaultPaymentAmount }
                onChange={ (e) => setAmount(e.currentTarget.value) }
                autofocus
            />
            <span className={ useClasses(styles.littleText) }>Set Deadline in consensus Blocks</span>
            <span className={ useClasses(styles.littleText) }>Currently on the { connector } network</span>
            <input
                className={ useClasses(styles.fields) }
                type="number"
                placeholder={ defaultDeadline }
                onChange={ (e) => setDeadline(e.currentTarget.value) }
                autofocus
            />
            <button className={ useClasses(styles.actionButton) } onClick={ () => finalizeTerms() }>Set Terms</button>
        </div>
    );
};

export default SetTerms;