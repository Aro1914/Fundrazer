import React from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const Deploy = () => {
    const { deploy, wager, standardUnit } = useReach();

    return (
        <div className={ useClasses(styles.subContainer) }>
            <h3 className={ useClasses() }>Wager: <strong>{ wager }</strong> { standardUnit }(required to deploy)</h3>
            <div className={ useClasses() }>
            <button
                className={ useClasses(styles.actionButton) }
                onClick={ () => deploy() }
            >
                Deploy
            </button>
            </div>
        </div>
    );
};

export default Deploy;