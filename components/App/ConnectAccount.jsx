import React from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const ConnectAccount = () => {
    const { connectAccount } = useReach();

    return (
        <div className={ useClasses(styles.subContainer) }>
            <div className={ useClasses() }>
                <span className={ useClasses(styles.littleText) }>Please wait while we connect your account. If this takes more than a few seconds, there may be something wrong.</span>
            </div>
            <div className={ useClasses() }>
                <button className={ useClasses(styles.actionButton) } onClick={ connectAccount }>
                    Connect Wallet
                </button>
            </div>
        </div>
    );
};

export default ConnectAccount;