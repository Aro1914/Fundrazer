import React, { useState } from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";

const PickAndGuess = () => {
    const { playable, firstTurn, makeDecision } = useReach();
    const [currentChoices, setCurrentChoices] = useState({});
    const [chosen, setChosen] = useState(false);
    const [possibleFingers, setPossibleFingers] = useState([0, 1, 2, 3, 4, 5]);

    const onChoosing = (choice) => {
        if (!chosen) {
            const possibleOutcomes = [];
            let outcomes = choice;
            while (outcomes <= (choice + 5)) {
                possibleOutcomes[outcomes - choice] = outcomes;
                outcomes++;
            }
            setPossibleFingers(possibleOutcomes);
            setCurrentChoices({ fingers: choice });
            setChosen(true);
        } else {
            setCurrentChoices({ ...currentChoices, guess: choice });
            makeDecision(currentChoices.fingers, choice);
        }
    };

    const Fingers = ({ outcome }) => {
        return (
            <div className={ useClasses(styles.fingerContainer) }>
                <button onClick={ () => onChoosing(outcome) } className={ useClasses(styles.finger) }>{ outcome }</button>
            </div>
        );
    };

    return (
        <div className={ useClasses() }>
            <h3 className={ useClasses(styles.theme) }>{ !firstTurn ? "It was a tie! Pick again." : "" }</h3>
            <h3 className={ useClasses(styles.theme) }>{ !playable ? "Please wait..." : !chosen ? "Pick your choice of fingers" : "Guess the total fingers played" }</h3>

            <div className={ useClasses(styles.orderContainer) }>
                { playable &&
                    possibleFingers.map((el, i) => <Fingers outcome={ el } key={ i } />)
                }
            </div>
        </div>
    );
};

export default PickAndGuess;