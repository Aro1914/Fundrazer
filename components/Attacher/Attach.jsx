import React, { useState } from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const Attach = () => {
    const [ctcInfoStr, setCtcInfoStr] = useState("");
    const { attach } = useReach();

    return (
        <div className={ useClasses(styles.subContainer) }>
            <h3 className={ useClasses() }>Please paste the contract info to attach to:</h3>
            <div className={ useClasses(styles.container) }>
                <textarea
                    spellCheck="false"
                    className={ useClasses(styles.fields) }
                    onChange={ (e) => setCtcInfoStr(e.currentTarget.value) }
                    placeholder="Enter contract info"
                />
                <button className={ useClasses(styles.actionButton) } disabled={ !ctcInfoStr } onClick={ () => attach(ctcInfoStr) }>
                    Attach
                </button>
            </div>
        </div>

    );
};

export default Attach;