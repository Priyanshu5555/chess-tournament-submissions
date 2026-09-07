<script>
    let {
        tournaments,
        selectedMatchTournament = $bindable(-1),
        generateMatches,
        selectWinner,
        resetMatches
    } = $props();
</script>

<section class="card">
    <h2>Match System</h2>

    <div class="form">
        <select bind:value={selectedMatchTournament}>
            <option value={-1}>Select Tournament</option>

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

    {#if selectedMatchTournament !== -1}
        {@const tournament = tournaments[selectedMatchTournament]}

        <h3>{tournament.name} Matches</h3>

        {#if tournament.matches.length > 0}
            <div class="matches">
                {#each tournament.matches as match, index}
                    <div class="match">
                        <div>
                            <strong>Match {index + 1}</strong>
                        </div>

                        <div class="players">
                            <span>{match.player1}</span>
                            <span>VS</span>
                            <span>{match.player2}</span>
                        </div>

                        {#if match.player2 === 'BYE'}
                            <p class="winner">
                                Winner: {match.player1}
                            </p>
                        {:else}
                            <div class="winner-buttons">
                                <button
                                    class:active={match.winner === match.player1}
                                    onclick={() =>
                                        selectWinner(
                                            match,
                                            match.player1
                                        )}
                                >
                                    {match.player1}
                                </button>

                                <button
                                    class:active={match.winner === match.player2}
                                    onclick={() =>
                                        selectWinner(
                                            match,
                                            match.player2
                                        )}
                                >
                                    {match.player2}
                                </button>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {:else}
            <p class="empty">
                No matches generated yet.
            </p>
        {/if}
    {/if}
</section>