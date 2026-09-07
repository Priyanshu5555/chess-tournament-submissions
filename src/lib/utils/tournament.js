export function shufflePlayers(playersList) {
    const shuffled = [...playersList];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[randomIndex]] = [
            shuffled[randomIndex],
            shuffled[i]
        ];
    }

    return shuffled;
}

export function getRankings(tournament) {
    const rankings = tournament.players.map((player) => ({
        name: player,
        wins: 0,
        losses: 0
    }));

    tournament.matches.forEach((match) => {
        if (match.winner === '') {
            return;
        }

        // BYE is not counted as a normal win
        if (match.player2 === 'BYE') {
            return;
        }

        const winner = rankings.find(
            (player) => player.name === match.winner
        );

        const loserName =
            match.player1 === match.winner
                ? match.player2
                : match.player1;

        const loser = rankings.find(
            (player) => player.name === loserName
        );

        if (winner) {
            winner.wins++;
        }

        if (loser) {
            loser.losses++;
        }
    });

    rankings.sort((a, b) => {
        if (b.wins !== a.wins) {
            return b.wins - a.wins;
        }

        return a.losses - b.losses;
    });

    return rankings;
}