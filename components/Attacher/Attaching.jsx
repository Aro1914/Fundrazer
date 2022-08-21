import React from "react";
import { useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const Attaching = () => {
    return (
        <div className={ useClasses(styles.subContainer) }>Attaching, please wait...</div>
    );
};

export default Attaching;