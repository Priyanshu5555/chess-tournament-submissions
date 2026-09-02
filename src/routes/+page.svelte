<script>
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

            // Update player name inside tournaments
            tournaments.forEach((tournament) => {

                tournament.players =
                    tournament.players.map((player) =>
                        player === oldName ? name : player
                    );

                // Update matches
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

        // Remove player from tournaments
        tournaments.forEach((tournament) => {

            tournament.players =
                tournament.players.filter(
                    (p) => p !== player
                );

            // Remove matches containing deleted player
            tournament.matches =
                tournament.matches.filter(
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

        const tournament =
            tournaments[selectedTournament];

        // Don't add same player twice
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

        const tournament =
            tournaments[tournamentIndex];

        tournament.players.splice(playerIndex, 1);

        // Matches must be generated again
        tournament.matches = [];
    }


    // ==========================================
    // MATCH SYSTEM
    // ==========================================

    let selectedMatchTournament = $state(-1);


    function shufflePlayers(playersList) {

        const shuffled = [...playersList];

        for (
            let i = shuffled.length - 1;
            i > 0;
            i--
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [
                shuffled[i],
                shuffled[randomIndex]
            ] = [
                shuffled[randomIndex],
                shuffled[i]
            ];

        }

        return shuffled;
    }


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

        // Clear old matches
        tournament.matches = [];

        // Randomly shuffle players
        const shuffledPlayers =
            shufflePlayers(tournament.players);

        // Create pairs
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

        tournaments[
            selectedMatchTournament
        ].matches = [];

    }


    // ==========================================
    // FINAL RANKINGS
    // ==========================================

    function getRankings(tournament) {

        const rankings =
            tournament.players.map((player) => ({
                name: player,
                wins: 0,
                losses: 0
            }));

        tournament.matches.forEach((match) => {

            // Ignore unfinished matches
            if (match.winner === '') {
                return;
            }

            // BYE does not count as a real win
            if (match.player2 === 'BYE') {
                return;
            }

            const winner =
                rankings.find(
                    (player) =>
                        player.name === match.winner
                );

            const loserName =
                match.player1 === match.winner
                    ? match.player2
                    : match.player1;

            const loser =
                rankings.find(
                    (player) =>
                        player.name === loserName
                );

            if (winner) {
                winner.wins++;
            }

            if (loser) {
                loser.losses++;
            }

        });

        // Sort by wins
        rankings.sort(
            (a, b) => {

                if (b.wins !== a.wins) {
                    return b.wins - a.wins;
                }

                return a.losses - b.losses;

            }
        );

        return rankings;
    }

</script>


<svelte:head>

    <title>
        Chess Tournament Manager
    </title>

    <meta
        name="description"
        content="Chess Tournament Management System"
    />

</svelte:head>


<div class="container">

    <!-- ======================================
         HEADER
    ======================================= -->

    <header>

        <h1>
            ♟ Chess Tournament Manager
        </h1>

        <p>
            Manage players, tournaments,
            matches and rankings.
        </p>

    </header>


    <!-- ======================================
         PLAYER MANAGEMENT
    ======================================= -->

    <section class="card">

        <h2>
            👤 Player Management
        </h2>


        <div class="form">

            <input
                type="text"
                placeholder="Enter player name"
                bind:value={playerName}
                onkeydown={(event) => {
                    if (event.key === 'Enter') {
                        addPlayer();
                    }
                }}
            />


            <button onclick={addPlayer}>

                {editingPlayerIndex === -1
                    ? 'Add Player'
                    : 'Update Player'}

            </button>


            {#if editingPlayerIndex !== -1}

                <button
                    class="secondary"
                    onclick={cancelPlayerEdit}
                >
                    Cancel
                </button>

            {/if}

        </div>


        <h3>
            Players ({players.length})
        </h3>


        {#if players.length === 0}

            <p class="empty">
                No players added yet.
            </p>

        {:else}

            <ol>

                {#each players as player, index}

                    <li>

                        <span>
                            {player}
                        </span>


                        <div class="actions">

                            <button
                                class="edit"
                                onclick={() =>
                                    editPlayer(index)}
                            >
                                Edit
                            </button>


                            <button
                                class="delete"
                                onclick={() =>
                                    deletePlayer(index)}
                            >
                                Delete
                            </button>

                        </div>

                    </li>

                {/each}

            </ol>

        {/if}

    </section>


    <!-- ======================================
         TOURNAMENT MANAGEMENT
    ======================================= -->

    <section class="card">

        <h2>
            🏆 Tournament Management
        </h2>


        <div class="form">

            <input
                type="text"
                placeholder="Enter tournament name"
                bind:value={tournamentName}
                onkeydown={(event) => {

                    if (event.key === 'Enter') {
                        addTournament();
                    }

                }}
            />


            <button onclick={addTournament}>

                {editingTournamentIndex === -1
                    ? 'Create Tournament'
                    : 'Update Tournament'}

            </button>


            {#if editingTournamentIndex !== -1}

                <button
                    class="secondary"
                    onclick={cancelTournamentEdit}
                >
                    Cancel
                </button>

            {/if}

        </div>


        <h3>
            Tournaments ({tournaments.length})
        </h3>


        {#if tournaments.length === 0}

            <p class="empty">
                No tournaments created yet.
            </p>

        {:else}

            {#each tournaments as tournament, index}

                <div class="tournament">

                    <div class="tournament-header">

                        <strong>
                            {index + 1}.
                            {tournament.name}
                        </strong>


                        <div class="actions">

                            <button
                                class="edit"
                                onclick={() =>
                                    editTournament(index)}
                            >
                                Edit
                            </button>


                            <button
                                class="delete"
                                onclick={() =>
                                    deleteTournament(index)}
                            >
                                Delete
                            </button>

                        </div>

                    </div>


                    <div class="tournament-players">

                        <h4>
                            Players
                            ({tournament.players.length})
                        </h4>


                        {#if tournament.players.length === 0}

                            <p class="empty">
                                No players added to this tournament.
                            </p>

                        {:else}

                            <ol>

                                {#each tournament.players as player, playerIndex}

                                    <li>

                                        <span>
                                            {player}
                                        </span>


                                        <button
                                            class="delete"
                                            onclick={() =>
                                                removePlayerFromTournament(
                                                    index,
                                                    playerIndex
                                                )}
                                        >
                                            Remove
                                        </button>

                                    </li>

                                {/each}

                            </ol>

                        {/if}

                    </div>

                </div>

            {/each}

        {/if}

    </section>


    <!-- ======================================
         ADD PLAYERS TO TOURNAMENT
    ======================================= -->

    <section class="card">

        <h2>
            👥 Add Players to Tournament
        </h2>


        {#if tournaments.length === 0}

            <p class="empty">
                Create a tournament first.
            </p>


        {:else if players.length === 0}

            <p class="empty">
                Add players first.
            </p>


        {:else}

            <div class="form">

                <select bind:value={selectedTournament}>

                    <option value={-1}>
                        Select Tournament
                    </option>


                    {#each tournaments as tournament, index}

                        <option value={index}>
                            {tournament.name}
                        </option>

                    {/each}

                </select>


                <select bind:value={selectedPlayer}>

                    <option value="">
                        Select Player
                    </option>


                    {#each players as player}

                        <option value={player}>
                            {player}
                        </option>

                    {/each}

                </select>


                <button onclick={addPlayerToTournament}>
                    Add Player
                </button>

            </div>

        {/if}

    </section>


    <!-- ======================================
         MATCH SYSTEM
    ======================================= -->

    <section class="card">

        <h2>
            ♟ Match System
        </h2>


        {#if tournaments.length === 0}

            <p class="empty">
                Create a tournament first.
            </p>


        {:else}

            <div class="form">

                <select
                    bind:value={selectedMatchTournament}
                >

                    <option value={-1}>
                        Select Tournament
                    </option>


                    {#each tournaments as tournament, index}

                        <option value={index}>
                            {tournament.name}
                        </option>

                    {/each}

                </select>


                <button onclick={generateMatches}>
                    Generate Matches
                </button>


                <button
                    class="secondary"
                    onclick={resetMatches}
                >
                    Reset Matches
                </button>

            </div>


            {#if selectedMatchTournament === -1}

                <p class="empty">
                    Select a tournament to view matches.
                </p>


            {:else if tournaments[selectedMatchTournament].matches.length === 0}

                <p class="empty">
                    No matches generated yet.
                </p>


            {:else}

                <h3>
                    Generated Matches
                </h3>


                {#each tournaments[selectedMatchTournament].matches as match, index}

                    <div class="match">

                        <h4>
                            Match {index + 1}
                        </h4>


                        <p class="players">

                            <strong>
                                {match.player1}
                            </strong>

                            <span> VS </span>

                            <strong>
                                {match.player2}
                            </strong>

                        </p>


                        {#if match.player2 === 'BYE'}

                            <p class="winner">

                                🏆 Automatic Winner:

                                <strong>
                                    {match.winner}
                                </strong>

                            </p>


                        {:else if match.winner === ''}

                            <div class="winner-buttons">

                                <button
                                    onclick={() =>
                                        selectWinner(
                                            match,
                                            match.player1
                                        )}
                                >
                                    {match.player1} Wins
                                </button>


                                <button
                                    onclick={() =>
                                        selectWinner(
                                            match,
                                            match.player2
                                        )}
                                >
                                    {match.player2} Wins
                                </button>

                            </div>


                        {:else}

                            <p class="winner">

                                🏆 Winner:

                                <strong>
                                    {match.winner}
                                </strong>

                            </p>

                        {/if}

                    </div>

                {/each}

            {/if}

        {/if}

    </section>


    <!-- ======================================
         FINAL RANKINGS
    ======================================= -->

    <section class="card">

        <h2>
            🏅 Final Rankings
        </h2>


        {#if selectedMatchTournament === -1}

            <p class="empty">
                Select a tournament in Match System first.
            </p>


        {:else}

            {@const selectedTournamentData =
                tournaments[selectedMatchTournament]}

            {@const rankings =
                getRankings(selectedTournamentData)}


            {#if rankings.length === 0}

                <p class="empty">
                    No players available for rankings.
                </p>


            {:else}

                <div class="ranking-list">

                    {#each rankings as player, index}

                        <div class="ranking">

                            <div class="rank">

                                {#if index === 0}
                                    🥇
                                {:else if index === 1}
                                    🥈
                                {:else if index === 2}
                                    🥉
                                {:else}
                                    #{index + 1}
                                {/if}

                            </div>


                            <div class="ranking-name">

                                <strong>
                                    {player.name}
                                </strong>

                            </div>


                            <div class="stats">

                                Wins: {player.wins}
                                |
                                Losses: {player.losses}

                            </div>

                        </div>

                    {/each}

                </div>

            {/if}

        {/if}

    </section>

</div>


<style>

    /* ======================================
       GLOBAL
    ======================================= */

    :global(body) {

        margin: 0;

        font-family:
            Arial,
            sans-serif;

        background: #f5f5f5;

    }


    /* ======================================
       CONTAINER
    ======================================= */

    .container {

        max-width: 1000px;

        margin: auto;

        padding: 40px 20px;

    }


    /* ======================================
       HEADER
    ======================================= */

    header {

        text-align: center;

        margin-bottom: 30px;

    }


    header h1 {

        margin-bottom: 10px;

    }


    header p {

        color: #666;

    }


    /* ======================================
       CARD
    ======================================= */

    .card {

        background: white;

        padding: 30px;

        margin-bottom: 25px;

        border-radius: 10px;

        box-shadow:
            0 2px 10px
            rgba(0, 0, 0, 0.1);

    }


    /* ======================================
       FORM
    ======================================= */

    .form {

        display: flex;

        gap: 10px;

        margin-bottom: 25px;

        flex-wrap: wrap;

    }


    input,
    select {

        flex: 1;

        min-width: 200px;

        padding: 12px;

        font-size: 16px;

        border:
            1px solid #ccc;

        border-radius: 5px;

        outline: none;

        background: white;

    }


    input:focus,
    select:focus {

        border-color: #555;

    }


    /* ======================================
       BUTTONS
    ======================================= */

    button {

        padding: 12px 18px;

        border: none;

        border-radius: 5px;

        cursor: pointer;

        font-size: 14px;

        background: #333;

        color: white;

    }


    button:hover {

        opacity: 0.85;

    }


    .secondary {

        background: #777;

    }


    .edit {

        background: #555;

    }


    .delete {

        background: #b33;

    }


    /* ======================================
       LISTS
    ======================================= */

    ol {

        padding-left: 25px;

    }


    li {

        display: flex;

        justify-content:
            space-between;

        align-items: center;

        margin-bottom: 10px;

        padding: 10px;

        border-bottom:
            1px solid #eee;

    }


    .actions {

        display: flex;

        gap: 8px;

    }


    /* ======================================
       TOURNAMENT
    ======================================= */

    .tournament {

        border:
            1px solid #ddd;

        border-radius: 8px;

        padding: 20px;

        margin-bottom: 15px;

    }


    .tournament-header {

        display: flex;

        justify-content:
            space-between;

        align-items: center;

        gap: 15px;

    }


    .tournament-players {

        margin-top: 20px;

        padding-top: 15px;

        border-top:
            1px solid #eee;

    }


    .tournament-players h4 {

        margin-top: 0;

    }


    /* ======================================
       MATCH SYSTEM
    ======================================= */

    .match {

        border:
            1px solid #ddd;

        padding: 20px;

        margin-bottom: 15px;

        border-radius: 8px;

    }


    .match h4 {

        margin-top: 0;

    }


    .players {

        font-size: 18px;

        text-align: center;

        padding: 15px;

        background: #f5f5f5;

        border-radius: 5px;

    }


    .winner-buttons {

        display: flex;

        gap: 10px;

        justify-content: center;

        flex-wrap: wrap;

    }


    .winner {

        text-align: center;

        font-size: 17px;

        margin-top: 15px;

    }


    /* ======================================
       RANKINGS
    ======================================= */

    .ranking-list {

        display: flex;

        flex-direction: column;

        gap: 10px;

    }


    .ranking {

        display: flex;

        align-items: center;

        gap: 20px;

        padding: 15px;

        border:
            1px solid #ddd;

        border-radius: 8px;

        background: #fafafa;

    }


    .rank {

        font-size: 24px;

        min-width: 45px;

    }


    .ranking-name {

        flex: 1;

        font-size: 17px;

    }


    .stats {

        color: #666;

    }


    /* ======================================
       EMPTY
    ======================================= */

    .empty {

        color: #777;

    }


    /* ======================================
       MOBILE
    ======================================= */

    @media (max-width: 600px) {

        .container {

            padding: 20px 10px;

        }


        .card {

            padding: 20px;

        }


        .tournament-header {

            flex-direction: column;

            align-items: flex-start;

        }


        .ranking {

            flex-wrap: wrap;

        }

    }

</style>