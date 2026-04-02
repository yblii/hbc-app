import type { Group } from "../../../../Types";
import GroupCard from "../GroupCard";
import styles from './GroupsList.module.scss';

interface GroupsListProps {
    groups: Group[],
    handleJoinGroup: (groupId: number) => void
}

function GroupsList({ groups, handleJoinGroup }: GroupsListProps) {
    return (
        <div className={`${styles['groups-list']}`}>
            {groups.map((group, index) => (
                <GroupCard key={group.id} place={index + 1} group={group} handleJoinGroup={handleJoinGroup} />
            ))}
        </div>
    );
}

export default GroupsList;