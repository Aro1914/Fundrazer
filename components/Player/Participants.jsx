import React from 'react';
import { useClasses, useReach, fmtClasses } from '../../hooks';
import styles from '../../styles/Proposals.module.css';


const Participants = () => {
    const { participants, sortArrayOfObjects, buyTicket, isDeployer, isOpen, amount, standardUnit, hasPurchased, round, balance, target, winners, contractEnd } = useReach();

    return (
        <div className={ useClasses(
            styles.container,
        ) }>
            <h1 className={ useClasses(
                styles.title,
            ) }>{ contractEnd ? `Contract Closed` : `Participants (Round ${round})` }</h1>
            <div className={ useClasses(
                styles.proposals,
            ) }>
                <div className={ useClasses(
                    styles.proposal,
                ) }>
                    <div className={ useClasses(
                        styles.identifiers,
                    ) }>
                        <span className={ useClasses(
                            styles.time,
                        ) }>Consensus Time</span>
                        <span className={ useClasses(
                            styles.address,
                        ) }>Address</span>
                    </div>
                    <span className={ useClasses(
                        styles.ticket,
                    ) }>Ticket Number</span>
                </div>
                {
                    sortArrayOfObjects(participants, 'id')
                        .filter(el => el.id > ((round - 1) * 5) && el.id <= ((round) * 5))
                        .map((el, index) => {
                            return (
                                <div key={ index } className={ fmtClasses(
                                    styles.proposal,
                                ) }>
                                    <div className={ fmtClasses(
                                        styles.identifiers,
                                    ) }>
                                        <span className={ fmtClasses(
                                            styles.time,
                                        ) }>{ el.time }</span>
                                        <span className={ fmtClasses(
                                            styles.address,
                                        ) }>{ el.address }</span>
                                    </div>
                                    <span className={ fmtClasses(
                                        styles.ticket,
                                    ) }>{ el.ticket }</span>
                                </div>
                            );
                        })
                }
            </div>
            { !contractEnd &&
                <>
                    { !hasPurchased &&
                        <>
                            { !isDeployer &&
                                <div className={ fmtClasses(
                                    styles.buttonBox,
                                ) }>
                                    { !isOpen && <span className={ fmtClasses(
                                        styles.littleText,
                                    ) }>The raffle window isn't open yet.</span> }
                                    <button
                                        className={ fmtClasses(
                                            isOpen ? styles.button : styles.disabled,
                                        ) }
                                        onClick={ buyTicket }
                                        disabled={ !isOpen }
                                    >{ isOpen ? `Buy Ticket at ${amount} ${standardUnit}` : 'Please wait...' }</button>
                                </div>
                            }
                        </>
                    }
                </>
            }
            { isDeployer &&
                <div className={ fmtClasses(
                    styles.buttonBox,
                ) }>
                    <span className={ fmtClasses(
                        styles.littleText,
                    ) }>Balance: { balance }</span>
                    <span className={ fmtClasses(
                        styles.littleText,
                    ) }>Target: { target }</span>
                </div>
            }
            <h1 className={ useClasses(
                styles.title,
            ) }>Winners</h1>
            <div className={ useClasses(
                styles.proposals,
            ) }>
                <div className={ useClasses(
                    styles.proposal,
                ) }>
                    <div className={ useClasses(
                        styles.identifiers,
                    ) }>
                        <span className={ useClasses(
                            styles.time,
                        ) }>Consensus Time</span>
                        <span className={ useClasses(
                            styles.address,
                        ) }>Address</span>
                    </div>
                    <span className={ useClasses(
                        styles.ticket,
                    ) }>Ticket Number</span>
                </div>
                {
                    sortArrayOfObjects(winners, 'id')
                        .map((el, index) => {
                            return (
                                <div key={ index } className={ fmtClasses(
                                    styles.proposal,
                                    styles.winner,
                                ) }>
                                    <div className={ fmtClasses(
                                        styles.identifiers,
                                    ) }>
                                        <span className={ fmtClasses(
                                            styles.time,
                                        ) }>{ el.time }</span>
                                        <span className={ fmtClasses(
                                            styles.address,
                                        ) }>{ el.address }</span>
                                    </div>
                                    <span className={ fmtClasses(
                                        styles.ticket,
                                    ) }>{ el.ticket }</span>
                                </div>
                            );
                        })
                }
            </div>
        </div>
    );
};

export default Participants;