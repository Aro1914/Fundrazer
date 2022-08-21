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

const intToOutcome = ["Bob wins!", "Alice wins!", "Its a tie.."];
const participants = ["Bob", "Alice"];
const { standardUnit } = reach;
const deadline = { ETH: 10, ALGO: 100, CFX: 1000 }[reach.connector];

export const ReachContext = React.createContext();

const ReachContextProvider = ({ children }) => {
    const [defaults] = useState({
        defaultFundAmt: "10",
        defaultWager: "3",
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
    const [wager, setWager] = useState(defaults.defaultWager);
    const [outcome, setOutcome] = useState("");
    const [who, setWho] = useState("");
    const [total, setTotal] = useState(0);
    const [firstTurn, setFirstTurn] = useState(true);

    const [contract, setContract] = useState(null);
    const [playable, setPlayable] = useState(false);

    const [resolveChoices, setResolveChoices] = useState({});
    const [resolveAcceptTerms, setResolveAcceptTerms] = useState({});

    const [choices, setChoices] = useState(false);

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

    const pickAndGuess = async () => {
        const choices = await new Promise((resolveChoices) => {
            setResolveChoices({ resolveChoices });
            setPlayable(true);
            setViews({ view: "PickAndGuess", wrapper: "AppWrapper" });
        });
        setChoices(choices);
        console.log(choices);

        setViews({ view: "WaitingForResults", wrapper: "AppWrapper" });
        return [...choices];
    };

    const makeDecision = (fingers, guess) => {
        setFirstTurn(false);
        resolveChoices.resolveChoices([fingers, guess]);
    };

    const declareWinner = (outcome, total) => {
        const o = parseInt(outcome);
        const t = parseInt(total);
        setOutcome(intToOutcome[o]);
        setWho(participants[o]);
        setTotal(t);
        setViews({ view: "Done", wrapper: "AppWrapper" });
    };

    const informTimeout = () => {
        setViews({ view: "Timeout", wrapper: "AppWrapper" });
    };

    const handleWager = () => {
        setWager(wager);
        setViews({ view: "Deploy", wrapper: "DeployerWrapper" });
    };

    const commonInteract = {
        ...reach.hasRandom,
        pickAndGuess,
        declareWinner,
        informTimeout,
    };

    const DeployerInteract = {
        ...commonInteract,
        wager: reach.parseCurrency(wager),
        deadline,
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

    const acceptWager = async (wagerAtomic) => {
        const wager = reach.formatCurrency(wagerAtomic, 4);
        return await new Promise((resolveAcceptTerms) => {
            setResolveAcceptTerms({ resolveAcceptTerms });
            setWager(wager);
            setViews({ view: "AcceptTerms", wrapper: "AttacherWrapper" });
        });
    };

    const AttacherInteract = {
        ...commonInteract,
        acceptWager,
    };

    const attach = async (ctcInfoStr) => {
        try {
            const ctc = user.account.contract(backend, JSON.parse(ctcInfoStr));
            setViews({ view: "Attaching", wrapper: "AttacherWrapper" });
            ctc.p.Bob(AttacherInteract);
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
        makeDecision,

        user,
        views,
        wager,
        fundAccount,
        connectAccount,
        skipFundAccount,

        selectDeployer,
        selectAttacher,
        choices,
        total,
        firstTurn,
        setFirstTurn,
        who,
        setWho,

        handleWager,
        setWager,
        deploy,
        playable,
        resolveChoices,
        outcome,

        attach,
        acceptWager,
        termsAccepted,
    };

    return (
        <ReachContext.Provider value={ ReachContextValues }>
            { children }
        </ReachContext.Provider>
    );
};

export default ReachContextProvider;