import React from "react";
import { useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const Wrapper = ({ children }) => {
    return (
        <div className={ useClasses(styles.subHeader) }>
            <h2 className={ useClasses(styles.theme) }>Attacher (Bob)</h2>
            <div className={ useClasses(styles.container) }>
                { children }
            </div>
        </div>
    );
};

export default Wrapper;