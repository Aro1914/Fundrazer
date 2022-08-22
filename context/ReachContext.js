import React, { useState } from "react";
import {
    loadStdlib,
    ALGO_MyAlgoConnect as MyAlgoConnect,
} from "@reach-sh/stdlib";
import * as backend from "../build/index.main.mjs";
const reach = loadStdlib(process.env);

reach.setWalletFallback(
    reach.walletFallback({
        providerEnv: "TestNet",
        MyAlgoConnect,
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

    const [who, setWho] = useState("");

    const [contract, setContract] = useState(null);
    const [events, setEvents] = useState(null);

    const [deadline, setdeadline] = useState(defaults.defaultDeadline);
    const [amount, setAmount] = useState(defaults.defaultPaymentAmount);
    const [terms, setTerms] = useState([deadline, amount]);
    const [resolveTerms, setResolveTerms] = useState({});

    const [deployerContract, setDeployerContract] = useState(null);

    const [attacherContract, setAttacherContract] = useState(null);
    const [resolveAcceptTerms, setResolveAcceptTerms] = useState({});

    const connectAccount = async () => {
        const account = await reach.getDefaultAccount();
        const balAtomic = await reach.balanceOf(account);
        const balance = reach.formatCurrency(balAtomic, 4);
        setUser({ account, balance });
        if (await reach.canFundFromFaucet) {
            setViews({ view: "FundAccount" });
        } else {
            setViews({ view: "DeployerOrAttacher", wrapper: "AppWrapper" });
        }
    };

    const fundAccount = async (fundAmount) => {
        await reach.fundFromFaucet(user.account, reach.parseCurrency(fundAmount));
        setViews({ view: "DeployerOrAttacher" });
    };

    const skipFundAccount = async () => {
        setViews({ view: "DeployerOrAttacher", wrapper: "AppWrapper" });
    };

    const selectAttacher = () => {
        setViews({ view: "Attach", wrapper: "AttacherWrapper" });
    };

    const selectDeployer = () => {
        setViews({ view: "SetTerms", wrapper: "DeployerWrapper" });
    };

    const informTimeout = () => {
        setViews({ view: "Timeout", wrapper: "AppWrapper" });
    };

    const setContractTerms = async () => {
        const terms = await new Promise((resolveTerms) => {
            setResolveTerms({ resolveTerms });
            setViews({ view: "SetTerms", wrapper: "DeployerWrapper" });
        });
        return [terms[0], reach.parseCurrency(terms[1])];
    };

    const finalizeTerms = () => {
        resolveTerms.resolveTerms(terms);
        setViews({ view: "Participants", wrapper: "DeployerWrapper" });
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

    const DeployerInteract = {
        setContractTerms,
        genTickets,
        genWinningTicket
    };

    const notify = ({ when, what }) => {
        alert(`User with address ${what[0]}, just bought ticket number ${what[1]}`);
    };

    const announce = ({ when, what }) => {
        alert(`Congratulations, user with address ${what[0]}, the holder of ticket number ${what[1]}, you just won the pot!`);
    };

    const log = ({ when, what }) => {
        const paddedState = what[0];
        const ifState = x => x.padEnd(15, "\u0000");
        switch (paddedState) {
            case ifState('initiating'):
                alert(`Initiating contract operations!`);
                break;
            case ifState('opened'):
                alert(`The normal draw window has opened!`);
                break;
            case ifState('timeout'):
                alert(`The normal draw window has timed out, yet tickets remain, increasing price by 25%!`);
                break;
            case ifState('closed'):
                alert(`The normal draw window is closed, proceeding to payout!`);
                break;
            case ifState('complete'):
                alert(`The operations are complete!`);
                break;
            case ifState('closing'):
                alert(`The contract is closing!`);
                break;
            default:
                alert(`An unhandled log...`);
                break;
        }
    };

    const deploy = async () => {
        const ctc = user.account.contract(backend);
        setViews({ view: "Deploying", wrapper: "DeployerWrapper" });
        setDeployerContract(ctc);

        setEvents(ctc.events);
        events.log.monitor(log);
        events.notify.monitor(notify);
        events.announce.monitor(announce);

        ctc.p.Deployer(DeployerInteract);
        const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
        console.log(ctcInfoStr);
        setContract({ ctcInfoStr });
        setViews({ ...views, view: "Deployed" });
    };

    const attach = async (ctcInfoStr) => {
        try {
            setViews({ view: "Attaching", wrapper: "AttacherWrapper" });
            const ctc = user.account.contract(backend, JSON.parse(ctcInfoStr));
            setAttacherContract(ctc);

            const termsAccepted = await new Promise((resolveAcceptTerms) => {
                setResolveAcceptTerms({ resolveAcceptTerms });
                setViews({ view: 'Terms', wrapper: 'AttacherWrapper' });
            });

            setEvents(ctc.events);
            events.log.monitor(log);
            events.notify.monitor(notify);
            events.announce.monitor(announce);

            if (termsAccepted) {
                setViews({ view: "BuyTicket", wrapper: 'AttacherWrapper' });
            } else {
                setViews({ view: "Attach", wrapper: 'AttacherWrapper' });
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
        try {
            alert(`You just pulled out Ticket number ${await attacherContract.apis.Players.drawATicket()}`);
            setViews({ view: 'Participants', wrapper: 'AttacherWrapper' });
        } catch (error) {
            alert(`An error occurred`);
        }
    };

    // const fmt = x => reach.formatCurrency(x, 4);
    // const getBalance = async () => fmt(await reach.balanceOf(user.account));

    const ReachContextValues = {
        ...defaults,

        contract: contract,

        user,
        views,
        setViews,
        fundAccount,
        connectAccount,
        skipFundAccount,

        setTerms,
        informTimeout,

        selectDeployer,
        selectAttacher,
        who,
        setWho,

        deploy,
        attach,
        termsAccepted,
        termsRejected,
        buyTicket,
        finalizeTerms,
    };

    return (
        <ReachContext.Provider value={ ReachContextValues }>
            { children }
        </ReachContext.Provider>
    );
};

export default ReachContextProvider;