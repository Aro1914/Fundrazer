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
    deadline: UInt,
    setPaymentAmount: Fun([], UInt),
    genTickets: Fun([UInt], tickets),
    genWinningTicket: Fun([tickets], ticketIndex),
    pickATicket: Fun([], ticketIndex),
  });

  const Players = API('Players', {
    drawATicket: Fun([], UInt),
  });

  const Logger = Events({
    log: [state],
    announce: [UInt],
  });

  init();

  Deployer.only(() => {
    const deadline = declassify(interact.deadline);
    const generatedTickets = declassify(interact.genTickets(numOfTickets));
    const winningIndex = declassify(interact.genWinningTicket(generatedTickets));
    const paymentAmount = declassify(interact.setPaymentAmount());
  });
  Deployer.publish(deadline, generatedTickets, winningIndex, paymentAmount);
  commit();
  Deployer.publish();

  const [timeRemaining, keepGoing] = makeDeadline(deadline);

  const [
    outcome,
    currentOwner,
    currentBalance,
    playerCount
  ] = parallelReduce([LOST, Deployer, balance(), 0])
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
          return [isWinner, currentHolder, currentBalance + paymentAmount, playerCount + 1];
        }
      ];
    })
    .timeout(timeRemaining(), () => {
      Deployer.publish();
      if (playerCount < 5) {
        commit();
        Deployer.publish();
        const increasedPayment = ((paymentAmount / 100) * 25);
        const [
          tOutcome,
          tCurrentOwner,
          tCurrentBalance,
          tPlayerCount
        ] = parallelReduce([outcome, currentOwner, currentBalance, playerCount])
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
                return [isWinner, currentHolder, tCurrentBalance + increasedPayment, tPlayerCount + 1];
              }
            ];
          });
        return [
          tOutcome,
          tCurrentOwner,
          tCurrentBalance,
          tPlayerCount
        ];
      } else {
        return [
          outcome,
          currentOwner,
          currentBalance,
          playerCount
        ];
      }
    });
  transfer(balance()).to(currentOwner);
  commit();
  exit();
});