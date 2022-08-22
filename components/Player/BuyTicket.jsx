import React, { useState } from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const BuyTicket = () => {
    const { buyTicket } = useReach();

    return (
        <div className={ useClasses() }>
            Buy ticket

            <button onClick={ buyTicket }>Buy Ticket</button>
        </div>
    );
};

export default BuyTicket;