import { useEffect, useState } from "react";
import type { Group, GroupCleanupData } from "../../../Types";
import { getGroups } from "../api/get-groups";
import { createGroup } from "../api/create-group";
import { useAuth0 } from "@auth0/auth0-react";
import GroupsList from "./GroupsList";
import { joinGroup } from "../api/joinGroup";

function QueuePage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() =>  {
        const fetchGroups = async () =>  {
            try {
                const groups = await getGroups(getAccessTokenSilently);
                setGroups(groups);
            } catch(err) {
                console.log(err);
            }
        };

        fetchGroups();
    }, [getAccessTokenSilently]);

    const handleCreateGroup = async () => {
        if(!isAuthenticated) return;

        try {
            const { group, cleanup } = await createGroup(getAccessTokenSilently);
            const newList = handleCleanup(cleanup);
            newList.push(group);
            setGroups(newList);
        } catch(err) {
            console.log(err);
        }
    }

    const handleJoinGroup = async (groupId: number) => {
        try {
            const { group, cleanup } = await joinGroup(groupId, getAccessTokenSilently);
            const newList = handleCleanup(cleanup);
            setGroups(newList.map(g =>
                g.id === group.id ? group : g
            ))

        } catch(err) {
            console.log(err);
        }
    }

    const handleCleanup = (cleanup: GroupCleanupData) => {
        let updatedList = [...groups];

        if(cleanup) {
            if(cleanup.type === 'DELETED') {
                updatedList = updatedList.filter(g => g.id !== cleanup.groupId);
            } else if(cleanup.type === 'UPDATED') {
                updatedList = updatedList.map(g =>
                    g.id === cleanup.group.id ? cleanup.group : g
                );
            }
        }
        return updatedList;
    }

    return (
        <div>
            <h1>Groups Page</h1>
            <GroupsList groups={groups} handleJoinGroup={handleJoinGroup} />

            <button onClick={handleCreateGroup}>
                New Group
            </button>
        </div>
    )
}

export default QueuePage;