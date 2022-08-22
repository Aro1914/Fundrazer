    const genTickets = (num) => {
        const tickets = [];
        let counts = 0;
        while (counts < 4) {
            const ticket = Math.floor(Math.random() * 10000) + 10001;
            tickets.push(ticket);
        }
        return tickets;
    };

    console.log(genTickets(5));