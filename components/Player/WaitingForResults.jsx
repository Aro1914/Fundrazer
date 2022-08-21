import React from "react";
import { useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const WaitingForResults = () => {
    return (
        <div className={ useClasses(styles.subContainer) }>
            <h3 className={ useClasses() }>Waiting for results...</h3>
        </div>
    );
};

export default WaitingForResults;