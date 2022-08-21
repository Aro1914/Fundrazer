import React from "react";
import { useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const Deploying = () => {
    return (
        <div className={ useClasses(styles.subContainer) }>
            Deploying... please wait.
        </div>
    );
};

export default Deploying;