import { useEffect, useState } from "react";
import type { Group } from "../../../Types";
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
            const newGroup = await createGroup(getAccessTokenSilently);
            if (newGroup) {
                setGroups((prevGroups) => [...prevGroups, newGroup]);
            }
        } catch(err) {
            console.log(err);
        }
    }

    const handleJoinGroup = async (groupId: number) => {
        try {
            const updatedGroup = await joinGroup(groupId, getAccessTokenSilently);
            if (updatedGroup) {
                setGroups((prevGroups) =>
                    prevGroups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
                );
            }
        } catch(err) {
            console.log(err);
        }
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