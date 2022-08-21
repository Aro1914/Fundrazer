import React from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const SetWager = () => {
    const { handleWager, defaultWager, standardUnit, setWager } = useReach();
    return (
        <div className={ useClasses(styles.subContainer) }>
                <span className={ useClasses(styles.littleText) }>{ standardUnit }</span>
                <input
                    className={ useClasses(styles.fields) }
                    type="number"
                    placeholder={ defaultWager }
                    onChange={ (e) => setWager(e.currentTarget.value) }
                    autofocus
                />
            <button className={useClasses(styles.actionButton)} onClick={ () => handleWager() }>Set Wager</button>
        </div>
    );
};

export default SetWager;