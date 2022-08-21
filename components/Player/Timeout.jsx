import React from "react";
import { useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const Timeout = () => {
    return ( 
        <div className={ useClasses(styles.subContainer) }>
            <h3>There's been a timeout. (Someone took too long.)</h3>
        </div>
    )
};

export default Timeout;