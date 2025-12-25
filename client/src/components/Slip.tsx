import type { Player } from '../Types';

function SlipDisplay({ players }: { players: Player[] }) {
    return (
        <div>
            <ul>
                {players.map(player => (
                    <li key={player.email}>
                        {player.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SlipDisplay;