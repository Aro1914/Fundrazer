import React from "react";
import { useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const WaitingForTurn = () => {
    return (
        <div className={ useClasses(styles.subContainer) }>
            <h2 className={ useClasses() }>Waiting for the other player...</h2>
            <span className={ useClasses() }>Do you have your hand ready?</span>
        </div>
    );
};

export default WaitingForTurn;