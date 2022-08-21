import React from "react";
import { useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const Wrapper = ({ children }) => {
    return (
        <div className={ useClasses() }>
            <div className={ useClasses() }>
                <header className={ useClasses() } id='root'>
                    <h1 className={ useClasses(styles.mainHeader) }>Morra<br />🤗</h1>
                    <div className={ useClasses(styles.container) }>{ children }</div>
                </header>
            </div>
        </div>
    );
};

export default Wrapper;