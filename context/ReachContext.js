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

    const [contractInfo, setContractInfo] = useState(null);
    const [deployerContract, setDeployerContract] = useState('');
    const [attacherContract, setAttacherContract] = useState('');

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

    const declareWinner = () => {
        setViews({ view: "Done", wrapper: "AppWrapper" });
    };

    const informTimeout = () => {
        setViews({ view: "Timeout", wrapper: "AppWrapper" });
    };

    const setPaymentAmount = async () => {
        const fixedAmount = await new Promise((resolvePaymentAmount) => {
            setViews({ view: 'SetTicketPrice', wrapper: 'DeployerWrapper' });
            setResolvePaymentAmount({ resolvePaymentAmount });
        });
        console.log(amount, fixedAmount);
        return fixedAmount;
    };

    const handlePaymentAmount = () => {
        resolvePaymentAmount.resolvePaymentAmount(amount);
        setViews({ view: 'Participants', wrapper: 'DeployerWrapper' });
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
        deadline,
        setPaymentAmount,
        genTickets,
        genWinningTicket
    };

    const deploy = async () => {
        const ctc = user.account.contract(backend);
        setViews({ view: "Deploying", wrapper: "DeployerWrapper" });
        setDeployerContract(ctc);
        ctc.p.Deployer(DeployerInteract);
        const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
        console.log(ctcInfoStr);
        setContractInfo({ ctcInfoStr });
    };

    const attach = async (ctcInfoStr) => {
        try {
            setViews({ view: "Attaching", wrapper: "AttacherWrapper" });
            const ctc = user.account.contract(backend, JSON.parse(ctcInfoStr));
            setAttacherContract(ctc);
            setViews({ view: 'Terms', wrapper: 'AttacherWrapper' });
        } catch (error) {
            console.log({ error });
        }
    };

    const termsAccepted = () => {
        resolveAcceptTerms.resolveAcceptTerms();
        setViews({ view: "BuyTicket", wrapper: 'AttacherWrapper' });
    };

    const buyTicket = async () => {
        try {
            await attacherContract.apis.Players.drawATicket();
            setViews({ view: 'Participants', wrapper: 'AttacherWrapper' });
        } catch (error) {
            alert(`An error occurred`);
        }
    };

    const ReachContextValues = {
        ...defaults,

        contract: contractInfo,

        user,
        views,
        fundAccount,
        connectAccount,
        skipFundAccount,

        declareWinner,
        informTimeout,

        selectDeployer,
        selectAttacher,
        who,
        setWho,

        deploy,
        attach,
        termsAccepted,
        handlePaymentAmount,
        buyTicket,
    };

    return (
        <ReachContext.Provider value={ ReachContextValues }>
            { children }
        </ReachContext.Provider>
    );
};

export default ReachContextProvider;