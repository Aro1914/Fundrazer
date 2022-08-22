import React from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";


const Terms = () => {
    const { termsAccepted, termsRejected } = useReach();

    return <>
        Terms;
        <button onClick={ termsAccepted }>Accept</button>
        <button onClick={ termsRejected }>Reject</button>
    </>;
};

export default Terms;