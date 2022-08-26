/* eslint-disable no-loop-func */
/* eslint-disable no-use-before-define */
/* eslint-disable no-array-constructor */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
'reach 0.1';

// Types
const numOfTickets = 5;
const tickets = Array(UInt, numOfTickets);
const ticketIndex = UInt;

const state = Bytes(20);

// Outcomes
const [isOutcome, WON, LOST] = makeEnum(2);
const winner = (winningTicket, pickedTicket) => {
  return (winningTicket == pickedTicket ? 1 : 0);
};

export const main = Reach.App(() => {

  const Deployer = Participant('Deployer', {
    setupContract: Fun([], Array(UInt, 3)),
    generate: Fun([UInt], Object({
      generatedTickets: tickets,
      winningIndex: ticketIndex,
    }))
  });

  const Players = API('Players', {
    drawATicket: Fun([], UInt),
  });

  const Logger = Events({
    log: [state, Bool],
    logOpened: [state, UInt],
    price: [UInt],
    notify: [Address, UInt],
    round: [UInt],
    balance: [UInt],
    announce: [Address, UInt, Bool, UInt],
  });

  init();
  Deployer.only(() => {
    const [deadline, paymentAmount, target] = declassify(interact.setupContract());
  });
  Deployer.publish(deadline, paymentAmount, target);
  Logger.log(state.pad("initiating"), false);
  commit();
  Deployer.publish();

  var [rounds, currentBal, totalGathered] = [1, balance(), 0];
  invariant(balance() == currentBal);
  while (totalGathered < target) {
    commit();

    Deployer.only(() => {
      const { generatedTickets, winningIndex } = declassify(interact.generate(numOfTickets));
    });
    Deployer.publish(generatedTickets, winningIndex);

    const [timeRemaining, keepGoing] = makeDeadline(deadline);
    Logger.logOpened(state.pad("opened"), deadline);
    Logger.price(paymentAmount);
    Logger.round(rounds);

    const [
      outcome,
      currentOwner,
      currentBalance,
      playerCount,
      amtCont,
    ] = parallelReduce([LOST, Deployer, balance(), 0, 0])
      .invariant(balance() == currentBalance)
      .while(keepGoing() && playerCount < 5)
      .api_(Players.drawATicket, () => {
        return [paymentAmount,
          (notify) => {
            const ticketNumber = generatedTickets[playerCount];
            const winningNumber = generatedTickets[(winningIndex > 4 ? 0 : winningIndex)];
            const isWinner = winner(winningNumber, ticketNumber) ? WON : LOST;
            const currentHolder = isWinner ? this : currentOwner;
            notify(ticketNumber);
            Logger.notify(this, ticketNumber);
            return [isWinner, currentHolder, currentBalance + paymentAmount, playerCount + 1, amtCont + paymentAmount];
          }
        ];
      })
      .timeout(timeRemaining(), () => {
        Deployer.publish();
        Logger.log(state.pad("timeout"), false);
        if (playerCount < 5) {
          commit();
          Deployer.publish();
          const increasedPayment = ((paymentAmount / 100) * 125);
          Logger.price(increasedPayment);
          const [
            tOutcome,
            tCurrentOwner,
            tCurrentBalance,
            tPlayerCount,
            tAmtCont
          ] = parallelReduce([outcome, currentOwner, currentBalance, playerCount, amtCont])
            .invariant(balance() == tCurrentBalance)
            .while(tPlayerCount < 5)
            .api_(Players.drawATicket, () => {
              return [increasedPayment,
                (notify) => {
                  const ticketNumber = generatedTickets[tPlayerCount];
                  const winningNumber = generatedTickets[(winningIndex > 4 ? 0 : winningIndex)];
                  const isWinner = winner(winningNumber, ticketNumber) ? WON : LOST;
                  const currentHolder = isWinner ? this : tCurrentOwner;
                  notify(ticketNumber);
                  Logger.notify(this, ticketNumber);
                  return [isWinner, currentHolder, tCurrentBalance + increasedPayment, tPlayerCount + 1, tAmtCont + increasedPayment];
                }
              ];
            });
          return [
            tOutcome,
            tCurrentOwner,
            tCurrentBalance,
            tPlayerCount,
            tAmtCont,
          ];
        } else {
          return [
            outcome,
            currentOwner,
            currentBalance,
            playerCount,
            amtCont,
          ];
        }
      });
    if (balance() >= amtCont / 2) {
      transfer(amtCont / 2).to(currentOwner);
    }
    Logger.balance(totalGathered + (amtCont / 2));
    Logger.announce(currentOwner, generatedTickets[(winningIndex > 4 ? 0 : winningIndex)], (balance() < target ? true : false), balance());

    [rounds, currentBal, totalGathered] = [(rounds + 1), balance(), totalGathered + (amtCont / 2)];
    continue;
  }
  transfer(balance()).to(Deployer);
  commit();
  exit();
});