import React from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const DeployerOrAttacher = () => {
    const { selectDeployer, selectAttacher } = useReach();

    return (
        <div className={ useClasses(styles.subContainer) }>
            <h2 className={ useClasses() }>Please select a role</h2>
            <div className={ useClasses(styles.orderContainer) }>
                <button onClick={ () => selectDeployer() } className={ useClasses(styles.actionButton) } title="Set the wager, deploy the contract">Deployer</button>
                <span className={ useClasses(styles.littleText) }>Set the wager, deploy the contract</span>
            </div>
            <div className={ useClasses(styles.orderContainer) }>
                <button onClick={ () => selectAttacher() } className={ useClasses(styles.actionButton) } title="Attach to the Deployer's contract">Attacher</button>
                <span className={ useClasses(styles.littleText) }>Attach to the Deployer's contract</span>
            </div>
        </div>
    );
};

export default DeployerOrAttacher;