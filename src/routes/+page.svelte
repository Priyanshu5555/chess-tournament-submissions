<script>
    import PlayerManagement from '$lib/components/PlayerManagement.svelte';
    import TournamentManagement from '$lib/components/TournamentManagement.svelte';
    import TournamentPlayers from '$lib/components/TournamentPlayers.svelte';
    import MatchSystem from '$lib/components/MatchSystem.svelte';
    import Rankings from '$lib/components/Rankings.svelte';

    import {
        shufflePlayers,
        getRankings
    } from '$lib/utils/tournament.js';

    // ==========================================
    // PLAYER MANAGEMENT
    // ==========================================

    let playerName = $state('');
    let players = $state([]);
    let editingPlayerIndex = $state(-1);

    function addPlayer() {
        const name = playerName.trim();

        if (name === '') {
            alert('Please enter a player name.');
            return;
        }

        if (editingPlayerIndex === -1) {
            if (players.includes(name)) {
                alert('Player already exists.');
                return;
            }

            players.push(name);
        } else {
            const oldName = players[editingPlayerIndex];

            players[editingPlayerIndex] = name;

            tournaments.forEach((tournament) => {
                tournament.players = tournament.players.map((player) =>
                    player === oldName ? name : player
                );

                tournament.matches.forEach((match) => {
                    if (match.player1 === oldName) {
                        match.player1 = name;
                    }

                    if (match.player2 === oldName) {
                        match.player2 = name;
                    }

                    if (match.winner === oldName) {
                        match.winner = name;
                    }
                });
            });

            editingPlayerIndex = -1;
        }

        playerName = '';
    }

    function editPlayer(index) {
        playerName = players[index];
        editingPlayerIndex = index;
    }

    function deletePlayer(index) {
        const player = players[index];

        tournaments.forEach((tournament) => {
            tournament.players = tournament.players.filter(
                (p) => p !== player
            );

            tournament.matches = tournament.matches.filter(
                (match) =>
                    match.player1 !== player &&
                    match.player2 !== player
            );
        });

        players.splice(index, 1);

        if (editingPlayerIndex === index) {
            editingPlayerIndex = -1;
            playerName = '';
        }
    }

    function cancelPlayerEdit() {
        editingPlayerIndex = -1;
        playerName = '';
    }

    // ==========================================
    // TOURNAMENT MANAGEMENT
    // ==========================================

    let tournamentName = $state('');
    let tournaments = $state([]);
    let editingTournamentIndex = $state(-1);

    function addTournament() {
        const name = tournamentName.trim();

        if (name === '') {
            alert('Please enter a tournament name.');
            return;
        }

        if (editingTournamentIndex === -1) {
            tournaments.push({
                name: name,
                players: [],
                matches: []
            });
        } else {
            tournaments[editingTournamentIndex].name = name;
            editingTournamentIndex = -1;
        }

        tournamentName = '';
    }

    function editTournament(index) {
        tournamentName = tournaments[index].name;
        editingTournamentIndex = index;
    }

    function deleteTournament(index) {
        tournaments.splice(index, 1);

        if (selectedTournament === index) {
            selectedTournament = -1;
        }

        if (selectedMatchTournament === index) {
            selectedMatchTournament = -1;
        }

        if (editingTournamentIndex === index) {
            editingTournamentIndex = -1;
            tournamentName = '';
        }
    }

    function cancelTournamentEdit() {
        editingTournamentIndex = -1;
        tournamentName = '';
    }

    // ==========================================
    // ADD PLAYER TO TOURNAMENT
    // ==========================================

    let selectedTournament = $state(-1);
    let selectedPlayer = $state('');

    function addPlayerToTournament() {
        if (
            selectedTournament === -1 ||
            selectedPlayer === ''
        ) {
            alert('Please select a tournament and player.');
            return;
        }

        const tournament = tournaments[selectedTournament];

        if (tournament.players.includes(selectedPlayer)) {
            alert('This player is already in the tournament.');
            return;
        }

        tournament.players.push(selectedPlayer);

        // Clear old matches when players change
        tournament.matches = [];

        selectedPlayer = '';
    }

    function removePlayerFromTournament(
        tournamentIndex,
        playerIndex
    ) {
        const tournament = tournaments[tournamentIndex];

        tournament.players.splice(playerIndex, 1);

        // Matches must be generated again
        tournament.matches = [];
    }

    // ==========================================
    // MATCH SYSTEM
    // ==========================================

    let selectedMatchTournament = $state(-1);

    function generateMatches() {
        if (selectedMatchTournament === -1) {
            alert('Please select a tournament.');
            return;
        }

        const tournament =
            tournaments[selectedMatchTournament];

        if (tournament.players.length < 2) {
            alert(
                'At least 2 players are required to generate matches.'
            );
            return;
        }

        tournament.matches = [];

        const shuffledPlayers =
            shufflePlayers(tournament.players);

        for (
            let i = 0;
            i < shuffledPlayers.length - 1;
            i += 2
        ) {
            tournament.matches.push({
                player1: shuffledPlayers[i],
                player2: shuffledPlayers[i + 1],
                winner: ''
            });
        }

        // Handle odd number of players
        if (shuffledPlayers.length % 2 !== 0) {
            const byePlayer =
                shuffledPlayers[
                    shuffledPlayers.length - 1
                ];

            tournament.matches.push({
                player1: byePlayer,
                player2: 'BYE',
                winner: byePlayer
            });
        }
    }

    function selectWinner(match, winner) {
        match.winner = winner;
    }

    function resetMatches() {
        if (selectedMatchTournament === -1) {
            return;
        }

        tournaments[selectedMatchTournament].matches = [];
    }
</script>

<svelte:head>
    <title>Chess Tournament Manager</title>

    <meta
        name="description"
        content="Chess Tournament Management System"
    />
</svelte:head>

<div class="container">

    <!-- HEADER -->

    <header>
        <h1>
            ♟ Chess Tournament Manager
        </h1>

        <p>
            Manage players, tournaments,
            matches and rankings.
        </p>
    </header>

    <!-- PLAYER MANAGEMENT -->

    <PlayerManagement
        {players}
        bind:playerName
        {editingPlayerIndex}
        {addPlayer}
        {editPlayer}
        {deletePlayer}
        {cancelPlayerEdit}
    />

    <!-- TOURNAMENT MANAGEMENT -->

    <TournamentManagement
        {tournaments}
        bind:tournamentName
        {editingTournamentIndex}
        {addTournament}
        {editTournament}
        {deleteTournament}
        {cancelTournamentEdit}
    />

    <!-- ADD PLAYERS TO TOURNAMENT -->

    <TournamentPlayers
        {tournaments}
        {players}
        bind:selectedTournament
        bind:selectedPlayer
        {addPlayerToTournament}
        {removePlayerFromTournament}
    />

    <!-- MATCH SYSTEM -->

    <MatchSystem
        {tournaments}
        bind:selectedMatchTournament
        {generateMatches}
        {selectWinner}
        {resetMatches}
    />

    <!-- FINAL RANKINGS -->

    <Rankings
        {tournaments}
        {getRankings}
    />

</div>