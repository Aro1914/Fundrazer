import React, { useState } from "react";
import {
    loadStdlib,
    ALGO_WalletConnect as WalletConnect,
} from "@reach-sh/stdlib";
import * as backend from "../build/index.main.mjs";
import { useClasses as fmtClasses } from '../hooks/useClasses';
import styles from '../styles/Global.module.css';
const reach = loadStdlib(process.env);

reach.setWalletFallback(
    reach.walletFallback({
        providerEnv: "TestNet",
        WalletConnect,
    })
);

const { standardUnit } = reach;

export const ReachContext = React.createContext();

const ReachContextProvider = ({ children }) => {

    const [defaults] = useState({
        defaultPaymentAmount: 0.8,
        defaultDeadline: { ETH: 100, ALGO: 1000, CFX: 10000 }[reach.connector],
        standardUnit,
        connector: reach.connector,
    });
    const [views, setViews] = useState({
        view: "ConnectAccount",
        wrapper: "AppWrapper",
    });
    const [user, setUser] = useState({
        account: "",
        balance: "",
    });

    const [contract, setContract] = useState(null);

    const [isDeployer, setIsDeployer] = useState(false);
    const [deadline, setDeadline] = useState(defaults.defaultDeadline);
    const [amount, setAmount] = useState(defaults.defaultPaymentAmount);
    const [target, setTarget] = useState(0);
    const [terms, setTerms] = useState([deadline, amount]);
    const [isConcluded, setIsConcluded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);

    const [resolveTerms, setResolveTerms] = useState({});
    const [round, setRound] = useState(1);

    const [attacherContract, setAttacherContract] = useState(null);
    const [resolveAcceptTerms, setResolveAcceptTerms] = useState({});
    const [participants, setParticipants] = useState([]);
    const [winners, setWinners] = useState([]);

    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const [alertResolve, setAlertResolve] = useState({});

    const [canContinue, setCanContinue] = useState(false);
    const [balance, setBalance] = useState(0);
    const [contractEnd, setContractEnd] = useState(false);

    const reset = () => {
        setIsConcluded(false);
        setIsOpen(false);
        setHasPurchased(false);
        setRound(1);
        setParticipants([]);
        setWinners([]);
        setMessage('');
        setBalance(0);
        setContractEnd(false);
    };

    const sleep = (milliseconds) => new Promise((resolve) => {
        setAlertResolve({ resolve });
        return setTimeout(resolve, milliseconds);
    });

    const cancelAlert = () => {
        alertResolve.resolve();
    };

    const alertThis = async (message) => {
        setMessage(message);
        setShowAlert(true);
        await sleep(message.length * 200);
        setShowAlert(false);
        setMessage('');
    };

    const sortArrayOfObjects = (arrayOfObjects, property) => {
        if (!arrayOfObjects) return arrayOfObjects;
        if (!Array.isArray(arrayOfObjects)) return arrayOfObjects;
        if (arrayOfObjects.length <= 1) return arrayOfObjects;
        let isInt = false;
        return arrayOfObjects.map((el, index) => {
            isInt = !isNaN(el?.[property]);
            return !isInt ?
                `${el?.[property]?.[0]?.toUpperCase()?.concat(el?.[property]?.slice(1))}^-.-^${index}` :
                `${el?.[property]}^-.-^${index}`;
        })?.sort(isInt ? (a, b) => Number(a?.split('^-.-^')?.[0]) - Number(b?.split('^-.-^')?.[0]) : undefined)?.map(el => arrayOfObjects[el?.split('^-.-^')?.[1]]);
    };

    const connectAccount = async () => {
        const account = await reach.getDefaultAccount();
        const balAtomic = await reach.balanceOf(account);
        const balance = reach.formatCurrency(balAtomic, 4);
        setUser({ account, balance });
        setViews({ view: "DeployerOrAttacher", wrapper: "AppWrapper" });
    };

    const selectAttacher = () => {
        setIsDeployer(false);
        setViews({ view: "Attach", wrapper: "AppWrapper" });
    };

    const setupContract = async () => {
        const terms = await new Promise((resolve) => {
            setViews({ view: "SetTerms", wrapper: "AppWrapper" });
            setResolveTerms({ resolve });
        });
        setTerms(terms);
        console.log(terms);
        return [terms[0], reach.parseCurrency(terms[1]), reach.parseCurrency(terms[2])];
    };

    const finalizeTerms = (deadline, amount, target) => {
        resolveTerms.resolve([deadline, amount, target]);
        setViews({ view: "Deploying", wrapper: "AppWrapper" });
    };

    const genTickets = (num) => {
        const tickets = [];
        let counts = 0;
        while (counts < num) {
            let ticket = Math.floor(Math.random() * 10000) + 10001;
            while (tickets.includes(ticket))
                ticket = Math.floor(Math.random() * 10000) + 10001;
            tickets.push(ticket);
            counts++;
        }
        return tickets;
    };

    const genWinningTicket = (tickets) => {
        return Math.floor(Math.random() * tickets.length);
    };

    const generate = (num) => {
        const generatedTickets = genTickets(num);

        const winningIndex = genWinningTicket(generatedTickets);

        return {
            generatedTickets,
            winningIndex,
        };
    };

    const DeployerInteract = {
        setupContract,
        generate,
    };

    const notify = ({ when, what }) => {
        const id = participants.length + 1;
        const newParticipants = participants;
        newParticipants.push({
            id,
            time: parseInt(when),
            address: what[0],
            ticket: parseInt(what[1]),
        });
        setParticipants([...newParticipants]);
    };

    const announce = async ({ when, what }) => {
        await sleep(5000);
        await alertThis(`Congrats, user with ticket number ${what[1]}, you just won half the pot!`);

        if (what[2]) {
            await sleep(5000);
            await alertThis(`The next round would begin shortly`);
        } else {
            await sleep(5000);
            await alertThis(`The targeted amount has been raised, transferring contract balance of ${reach.formatCurrency(what[3], 4)} ${standardUnit} to deployer and closing contract`);
            setContractEnd(true);
        }

        setIsConcluded(true);
        setCanContinue(what[2]);
        const id = winners.length + 1;
        const newWinners = winners;
        newWinners.push({
            id,
            time: parseInt(when),
            address: what[0],
            ticket: parseInt(what[1]),
        });
        setWinners([...newWinners]);
    };

    const log = async ({ when, what }) => {
        const paddedState = what[0];
        const ifState = x => x.padEnd(20, "\u0000");
        switch (paddedState) {
            case ifState('initiating'):
                await alertThis(`Initiating contract operations!`);
                break;
            case ifState('opened'):
                await alertThis(`The normal draw window has opened! It will timeout after ${parseInt(what[1])} blocks. Current consensus time is at ${parseInt(when)} blocks.`);
                setIsOpen(true);
                setHasPurchased(false);
                break;
            case ifState('timeout'):
                await alertThis(`The normal draw window has timed out, yet tickets remain, increasing price by 25%!`);
                break;
            default:
                break;
        }
    };

    const updateRound = ({ when, what }) => {
        setRound(parseInt(what[0]));
    };

    const updateBalance = ({ when, what }) => {
        setBalance(reach.formatCurrency(what[0], 4));
        if (isConcluded && canContinue) {
            setHasPurchased(false);
            setIsConcluded(false);
            setIsOpen(true);
        }
    };

    const receivePrice = ({ when, what }) => {
        setAmount(reach.formatCurrency(what[0], 4));
    };

    const assignMonitors = (events) => {
        events.log.monitor(log);
        events.logOpened.monitor(log);
        events.notify.monitor(notify);
        events.round.monitor(updateRound);
        events.balance.monitor(updateBalance);
        events.price.monitor(receivePrice);
        events.announce.monitor(announce);
    };

    const deploy = async () => {
        const ctc = user.account.contract(backend);
        setViews({ view: "Deploying", wrapper: "AppWrapper" });

        assignMonitors(ctc.events);

        ctc.p.Deployer(DeployerInteract);
        const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
        console.log(ctcInfoStr);
        setContract({ ctcInfoStr });
        reset();
        setViews({ ...views, view: "Deployed" });
    };

    const selectDeployer = async () => {
        setIsDeployer(true);
        await deploy();
    };

    const attach = async (ctcInfoStr) => {
        try {
            const termsAccepted = await new Promise((resolveAcceptTerms) => {
                setResolveAcceptTerms({ resolveAcceptTerms });
                setViews({ view: 'Terms', wrapper: 'AppWrapper' });
            });


            if (termsAccepted) {
                reset();
                setViews({ view: "Attaching", wrapper: "AppWrapper" });
                const ctc = user.account.contract(backend, JSON.parse(ctcInfoStr));
                setAttacherContract(ctc);
                setContract({ ctcInfoStr });
                assignMonitors(ctc.events);
                setViews({ view: "Participants", wrapper: 'AppWrapper' });
            } else {
                setViews({ view: "Attach", wrapper: 'AppWrapper' });
                setAttacherContract(null);
            }
        } catch (error) {
            console.log({ error });
        }
    };

    const termsAccepted = () => {
        resolveAcceptTerms.resolveAcceptTerms(true);
    };

    const termsRejected = () => {
        resolveAcceptTerms.resolveAcceptTerms(false);
    };

    const buyTicket = async () => {
        setHasPurchased(true);
        try {
            await alertThis(`You just pulled out ticket number ${await attacherContract.apis.Players.drawATicket()}`);
        } catch (error) {
            await alertThis(`Sorry couldn't process purchase, possibly due to a timeout. Retry in a few seconds.`);
            setHasPurchased(false);
        }
    };

    const ReachContextValues = {
        ...defaults,

        contract,
        deadline,
        amount,

        user,
        views,
        setViews,
        connectAccount,
        terms,
        setTerms,
        setAmount,
        setTarget,
        target,
        setDeadline,
        resolveTerms,
        isConcluded,
        isOpen,
        round,
        canContinue,

        participants,
        isDeployer,
        hasPurchased,

        selectDeployer,
        selectAttacher,
        sortArrayOfObjects,
        winners,
        contractEnd,

        deploy,
        attach,
        termsAccepted,
        termsRejected,
        buyTicket,
        finalizeTerms,
        balance,
    };

    return (
        <ReachContext.Provider value={ ReachContextValues }>
            { showAlert &&
                <div className={ fmtClasses(
                    styles.alertContainer,
                ) }>
                    <div className={ fmtClasses(
                        styles.mask,
                    ) }
                        onClick={ cancelAlert }
                    ></div>
                    <div className={ fmtClasses(
                        styles.alert,
                    ) }>
                        <div
                            className={ fmtClasses(
                                styles.cancel,
                            ) }
                            onClick={ cancelAlert }
                        ></div>
                        <span className={ fmtClasses(
                            styles.message,
                        ) }>{ message }</span>
                    </div>
                </div>
            }
            { children }
            { user.account &&
                <div className={ fmtClasses(
                    styles.last
                ) }>
                    <button className={ fmtClasses(
                        styles.back
                    ) }
                        onClick={ () => { setViews({ view: "DeployerOrAttacher", wrapper: "AppWrapper" }); }
                        }>
                        Select Roles
                    </button>
                </div>
            }
        </ReachContext.Provider>
    );
};

export default ReachContextProvider;