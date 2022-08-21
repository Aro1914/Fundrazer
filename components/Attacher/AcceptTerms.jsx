import React, { useState } from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const AcceptTerms = () => {
    const [disabled, setDisabled] = useState(false);
    const { wager, standardUnit, termsAccepted } = useReach();

    return (
        <div className={ useClasses(styles.subContainer) }>
            <h2 className={ useClasses(styles.theme) }>The terms of the game are:</h2>
            <h3 className={ useClasses(styles.subTheme) }>
                Wager: { wager } { standardUnit } <br/>
                Winner takes all <br />
                We play until a winner is discerned
            </h3>

            <button
                className={ useClasses(styles.actionButton) }
                disabled={ disabled }
                onClick={ () => {
                    setDisabled(true);
                    termsAccepted();
                } }>
                Accept terms and pay wager
            </button>
        </div>
    );
};

export default AcceptTerms;