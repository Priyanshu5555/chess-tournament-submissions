<script>
    let {
        tournaments,
        getRankings
    } = $props();
</script>

<section class="card">
    <h2>Final Rankings</h2>

    {#if tournaments.length > 0}
        {#each tournaments as tournament}
            <div class="ranking-section">
                <h3>{tournament.name}</h3>

                {#if tournament.players.length > 0}
                    {@const rankings = getRankings(tournament)}

                    <div class="rankings">
                        <div class="ranking-header">
                            <span>Rank</span>
                            <span>Player</span>
                            <span>Wins</span>
                            <span>Losses</span>
                        </div>

                        {#each rankings as player, index}
                            <div class="ranking-row">
                                <span>{index + 1}</span>
                                <strong>{player.name}</strong>
                                <span>{player.wins}</span>
                                <span>{player.losses}</span>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="empty">
                        No players in this tournament.
                    </p>
                {/if}
            </div>
        {/each}
    {:else}
        <p class="empty">
            No tournaments available.
        </p>
    {/if}
</section>s