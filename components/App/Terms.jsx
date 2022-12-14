import React from "react";
import { useReach, useClasses } from "../../hooks";
import styles from "../../styles/Global.module.css";
import terms from "../../styles/Terms.module.css";

const Terms = () => {
    const { termsAccepted, termsRejected } = useReach();

    return (
        <div className={ useClasses(
            styles.subContainer,
            terms.container,
        ) }>
            <div className={ useClasses(
                terms.titleBox,
            ) }>
                <div className={ useClasses(
                    terms.innerTitleBox,
                ) }>
                    <h2 className={ useClasses(
                        terms.title
                    ) }>Terms and Conditions</h2>
                </div>
            </div>
            <div className={ useClasses(
                terms.termsBox,
            ) }>
                <div className={ useClasses(
                    terms.innerTermsBox,
                ) }>
                    <p className={ useClasses(
                        terms.terms
                    ) }>
                        This DApp is solely for the purpose of fundraising.
                        Your continued use means that you agree to the following terms and conditions:
                        <br />
                        <span className={ useClasses(
                            terms.num
                        ) }>1.</span> Tickets' price is set by the Deployer. <br />
                        <span className={ useClasses(
                            terms.num
                        ) }>2.</span> The deadline is set by the Deployer. <br />
                        <span className={ useClasses(
                            terms.num
                        ) }>3.</span> After the deadline elapses and the tickets haven't been sold out, the original price, whatever it may be will increased by 25%. <br />
                        <span className={ useClasses(
                            terms.num
                        ) }>4.</span> The winner gets 50% of all revenue generated from the tickets purchased the other 50% goes to the Deployer. <br />
                        <span className={ useClasses(
                            terms.num
                        ) }>5.</span> After tickets have been purchased you will be provided with a ticket number generated by the contract, this cannot be changed. <br />
                        <span className={ useClasses(
                            terms.num
                        ) }>6.</span> Depending on the targeted amount the Deployer wants to raise and the price set for each ticket, there may be more than one round. Each only has 5 tickets to be sold, so you may decide to purchase another in the second round, as only one per user can be purchased in a round. <br />
                    </p>
                </div>
            </div>
            <div className={ useClasses(
                terms.choiceBox
            ) }>
                <button className={ useClasses(
                    terms.choices,
                    terms.positive,
                ) } onClick={ termsAccepted }>Accept</button>
                <button className={ useClasses(
                    terms.choices,
                    terms.negative,
                ) } onClick={ termsRejected }>Reject</button>
            </div>
        </div>
    );
};

export default Terms;