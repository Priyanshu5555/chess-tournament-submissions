<script>
    let {
        tournaments,
        players,
        selectedTournament = $bindable(-1),
        selectedPlayer = $bindable(''),
        addPlayerToTournament,
        removePlayerFromTournament
    } = $props();
</script>

<section class="card">
    <h2>Add Players to Tournament</h2>

    <div class="form">
        <select bind:value={selectedTournament}>
            <option value={-1}>Select Tournament</option>

            {#each tournaments as tournament, index}
                <option value={index}>
                    {tournament.name}
                </option>
            {/each}
        </select>

        <select bind:value={selectedPlayer}>
            <option value="">Select Player</option>

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

    {#if selectedTournament !== -1}
        {@const tournament = tournaments[selectedTournament]}

        <h3>{tournament.name} Players</h3>

        {#if tournament.players.length > 0}
            <div class="list">
                {#each tournament.players as player, playerIndex}
                    <div class="list-item">
                        <strong>{player}</strong>

                        <button
                            class="danger"
                            onclick={() =>
                                removePlayerFromTournament(
                                    selectedTournament,
                                    playerIndex
                                )}
                        >
                            Remove
                        </button>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="empty">
                No players added to this tournament yet.
            </p>
        {/if}
    {/if}
</section>