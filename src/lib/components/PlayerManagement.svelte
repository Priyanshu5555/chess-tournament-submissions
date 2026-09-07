<script>
    let {
        players,
        playerName = $bindable(''),
        editingPlayerIndex,
        addPlayer,
        editPlayer,
        deletePlayer,
        cancelPlayerEdit
    } = $props();
</script>

<section class="card">
    <h2>Player Management</h2>

    <div class="form">
        <input
            type="text"
            placeholder="Enter player name"
            bind:value={playerName}
            onkeydown={(e) => {
                if (e.key === 'Enter') {
                    addPlayer();
                }
            }}
        />

        {#if editingPlayerIndex >= 0}
            <button onclick={addPlayer}>
                Update Player
            </button>

            <button
                class="secondary"
                onclick={cancelPlayerEdit}
            >
                Cancel
            </button>
        {:else}
            <button onclick={addPlayer}>
                Add Player
            </button>
        {/if}
    </div>

    {#if players.length > 0}
        <h3>Players ({players.length})</h3>

        <div class="list">
            {#each players as player, index}
                <div class="list-item">
                    <strong>{player}</strong>

                    <div class="actions">
                        <button onclick={() => editPlayer(index)}>
                            Edit
                        </button>

                        <button
                            class="danger"
                            onclick={() => deletePlayer(index)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p class="empty">No players added yet.</p>
    {/if}
</section>