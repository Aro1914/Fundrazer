import React from "react";
import { useClasses, useReach } from "../../hooks";
import styles from "../../styles/Global.module.css";

const Done = () => {
    const { outcome, total, who } = useReach();

    return (
        <div className={ useClasses(styles.subContainer) }>
            <h2 className={ useClasses() }>
                Thank you for playing.
            </h2>
            <h3 className={ useClasses() }>
                { outcome }
                <br />
                The total fingers played were { total }, and { who } alone guessed it right.
            </h3>
        </div>
    );
};

export default Done;