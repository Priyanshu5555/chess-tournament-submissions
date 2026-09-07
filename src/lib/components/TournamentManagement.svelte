<script>
    let {
        tournaments,
        tournamentName = $bindable(''),
        editingTournamentIndex,
        addTournament,
        editTournament,
        deleteTournament,
        cancelTournamentEdit
    } = $props();
</script>

<section class="card">
    <h2>Tournament Management</h2>

    <div class="form">
        <input
            type="text"
            placeholder="Enter tournament name"
            bind:value={tournamentName}
            onkeydown={(e) => {
                if (e.key === 'Enter') {
                    addTournament();
                }
            }}
        />

        {#if editingTournamentIndex >= 0}
            <button onclick={addTournament}>
                Update Tournament
            </button>

            <button
                class="secondary"
                onclick={cancelTournamentEdit}
            >
                Cancel
            </button>
        {:else}
            <button onclick={addTournament}>
                Add Tournament
            </button>
        {/if}
    </div>

    {#if tournaments.length > 0}
        <div class="list">
            {#each tournaments as tournament, index}
                <div class="list-item">
                    <div>
                        <strong>{tournament.name}</strong>
                        <small>
                            {tournament.players.length} player(s)
                        </small>
                    </div>

                    <div class="actions">
                        <button onclick={() => editTournament(index)}>
                            Edit
                        </button>

                        <button
                            class="danger"
                            onclick={() => deleteTournament(index)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p class="empty">No tournaments created yet.</p>
    {/if}
</section>