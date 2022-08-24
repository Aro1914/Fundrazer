import React from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const SetTerms = () => {
    const { defaultPaymentAmount, defaultDeadline, standardUnit, setDeadline, deadline, setAmount, amount, connector, finalizeTerms,setTarget,target } = useReach();
    return (
        <div className={ useClasses(styles.subContainer) }>
            <span className={ useClasses(styles.littleText) }>Set Ticket Price in { standardUnit }</span>
            <input
                className={ useClasses(styles.fields) }
                type="number"
                placeholder={ defaultPaymentAmount }
                onChange={ (e) => {
                    setAmount(e.currentTarget.value);
                } }
                autoFocus
            />
            <span className={ useClasses(styles.littleText) }>Set Deadline in Blocks <br />Currently on the { connector } network</span>
            <input
                className={ useClasses(styles.fields) }
                type="number"
                placeholder={ defaultDeadline }
                onChange={ (e) => {
                    setDeadline(e.currentTarget.value);
                } }
            />
            <span className={ useClasses(styles.littleText) }>Whats the target you want to raise?</span>
            <input
                className={ useClasses(styles.fields) }
                type="number"
                placeholder={ `In ${standardUnit}` }
                onChange={ (e) => {
                    setTarget(e.currentTarget.value);
                } }
            />
            <button className={ useClasses(styles.actionButton) }
                onClick={ () => {
                    finalizeTerms(deadline, amount,target);
                } }>
                Set Terms
            </button>
        </div>
    );
};

export default SetTerms;