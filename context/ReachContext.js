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
const deadline = { ETH: 100, ALGO: 1000, CFX: 10000 }[reach.connector];

export const ReachContext = React.createContext();

const ReachContextProvider = ({ children }) => {
    const [defaults] = useState({
        defaultPaymentAmount: 0.8,
        standardUnit,
    });
    const [views, setViews] = useState({
        view: "ConnectAccount",
        wrapper: "AppWrapper",
    });
    const [user, setUser] = useState({
        account: "",
        balance: "",
    });
    const [amount, setAmount] = useState(defaults.defaultPaymentAmount);
    const [resolvePaymentAmount, setResolvePaymentAmount] = useState({});
    const [who, setWho] = useState("");

    const [contract, setContract] = useState(null);

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
        setViews({ view: "SetWager", wrapper: "DeployerWrapper" });
    };

    // const pickAndGuess = async () => {
    //     const choices = await new Promise((resolveChoices) => {
    //         setResolveChoices({ resolveChoices });
    //         setPlayable(true);
    //         setViews({ view: "PickAndGuess", wrapper: "AppWrapper" });
    //     });
    //     setChoices(choices);
    //     console.log(choices);

    //     setViews({ view: "WaitingForResults", wrapper: "AppWrapper" });
    //     return [...choices];
    // };

    // const makeDecision = (fingers, guess) => {
    //     setFirstTurn(false);
    //     resolveChoices.resolveChoices([fingers, guess]);
    // };

    const declareWinner = () => {
        setViews({ view: "Done", wrapper: "AppWrapper" });
    };

    const informTimeout = () => {
        setViews({ view: "Timeout", wrapper: "AppWrapper" });
    };

    const setPaymentAmount = async () => {
        const fixedAmount = await new Promise((resolvePaymentAmount) => {
            setViews({ view: 'SetRaffleAmount', wrapper: 'DeployerWrapper' });
        });
        setAmount(fixedAmount);
        console.log(amount, fixedAmount);
        return fixedAmount;
    };

    const genTickets = (num) => {
        const tickets = [];
        let counts = 0;
        while (counts < 4) {
            const ticket = Math.floor(Math.random() * 10000) + 10001;
            tickets.push(ticket);
            counts
        }
        return tickets;
    };

    console.log(genTickets(5));

    const DeployerInteract = {
        deadline,
        setPaymentAmount,
        genTickets,
        genWinningTicket,
        pickATicket,
    };

    const deploy = async () => {
        const ctc = user.account.contract(backend);
        setViews({ view: "Deploying", wrapper: "DeployerWrapper" });
        ctc.p.Alice(DeployerInteract);
        const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
        console.log(ctcInfoStr);
        setContract({ ctcInfoStr });;
        setViews({ view: "WaitingForAttacher", wrapper: "DeployerWrapper" });
    };

    const attach = async (ctcInfoStr) => {
        try {
            const ctc = user.account.contract(backend, JSON.parse(ctcInfoStr));
            setViews({ view: "Attaching", wrapper: "AttacherWrapper" });
        } catch (error) {
            console.log({ error });
        }
    };

    const termsAccepted = () => {
        resolveAcceptTerms.resolveAcceptTerms();
        setViews({ view: "WaitingForTurn" });
    };

    const ReachContextValues = {
        ...defaults,

        contract,

        user,
        views,
        fundAccount,
        connectAccount,
        skipFundAccount,

        selectDeployer,
        selectAttacher,
        who,
        setWho,

        deploy,
        attach,
        termsAccepted,
    };

    return (
        <ReachContext.Provider value={ ReachContextValues }>
            { children }
        </ReachContext.Provider>
    );
};

export default ReachContextProvider;