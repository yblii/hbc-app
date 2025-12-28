import type { User } from '../../../Types';

function GroupCard({ players }: { players: User[] }) {
    return (
        <div>
            <ul>
                {players.map(player => (
                    <li key={player.email}>
                        {player.firstName}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default GroupCard;