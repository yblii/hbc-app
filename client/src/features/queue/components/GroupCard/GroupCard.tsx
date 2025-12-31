import type { Group } from '../../../../Types';
import styles from './GroupCard.module.scss';

interface CardProps {
    place: number,
    group: Group,
    handleJoinGroup: (groupId: number) => void
}

function GroupCard({ place, group, handleJoinGroup }: CardProps) {
    const { id, players } = group;

    return (
        <div className={`${styles['group-card']}`}>
            <div className={`${styles['group-card__rank']}`}>{place}</div>
            <div className={`${styles['group-card__tags']}`}>
                {players.map((p) => (
                    <span className={styles['tag']} key={p.id}>
                        {p.firstName}
                    </span>
                ))}
                
                {players.length < 4 && (
                    <button 
                        key="join-group-btn" 
                        onClick={() => handleJoinGroup(id)} 
                        className={styles['add-button']}
                    >
                        +
                    </button>
                )}
            </div>
            <div className={`${styles['group-card__menu']}`}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    )
}

export default GroupCard;