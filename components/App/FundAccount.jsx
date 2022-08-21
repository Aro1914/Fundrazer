import React, { useState } from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const FundAccount = () => {
    const { user, standardUnit, defaultFundAmt, fundAccount, skipFundAccount } = useReach();
    const [amount, setAmount] = useState({ amt: defaultFundAmt });

    return (
        <div className={ useClasses(styles.subContainer) }>
            <h2 className={ useClasses() }>Fund account</h2>
            <h3 className={ useClasses() }>Balance: { user.balance } { standardUnit }</h3>

            <h4 className={ useClasses(styles.miniHeader) }>
                Would you like to fund your account with additional { standardUnit }?
                <br />
                (This only works on certain DevNets)
            </h4>
            <input
                className={ useClasses(styles.fields) }
                type="number"
                placeholder={ defaultFundAmt }
                onChange={ (e) => setAmount({ amt: e.currentTarget.value }) }
            />
            <button onClick={ () => fundAccount(amount.amt) } className={ useClasses(styles.actionButton) }>Fund Account</button>
            <button onClick={ () => skipFundAccount() } className={ useClasses(styles.actionButton) }>Skip</button>
        </div>
    );
};

export default FundAccount;