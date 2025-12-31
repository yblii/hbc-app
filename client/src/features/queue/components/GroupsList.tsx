import type { Group } from "../../../Types";
import GroupCard from "./GroupCard";

interface GroupsListProps {
    groups: Group[],
    handleJoinGroup: (groupId: number) => void
}

function GroupsList({ groups, handleJoinGroup }: GroupsListProps) {
    return (
        <div>
            {groups.map((group, index) => (
                <GroupCard key={group.id} place={index + 1} group={group} handleJoinGroup={handleJoinGroup} />
            ))}
        </div>
    );
}

export default GroupsList;