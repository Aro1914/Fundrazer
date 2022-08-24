import React from "react";
import { useClasses, fmtClasses, useReach } from "../../hooks";
import styles from "../../styles/Global.module.css";

const Wrapper = ({ children }) => {
    const { contract } = useReach();
    return (
        <div className={ useClasses() }>
            <div className={ useClasses() }>
                <header className={ useClasses() } id='root'>
                    <h1 className={ useClasses(styles.mainHeader) }>Fundrazer</h1>
                    {
                        contract?.ctcInfoStr &&
                        <h3 className={ fmtClasses(styles.subTheme, styles.flat) }>
                            Contract Information
                            <br />
                            { contract?.ctcInfoStr }
                        </h3>
                    }
                    <div className={ useClasses(styles.container) }>{ children }</div>
                </header>
            </div>
        </div>
    );
};

export default Wrapper;