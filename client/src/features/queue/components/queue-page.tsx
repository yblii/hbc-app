import { useEffect, useState } from "react"
import type { Group } from "../../../Types";
import GroupCard from "./group-card";
import { getGroups } from "../api/get-groups";
import { createGroup } from "../api/create-group";
import { useAuth0 } from "@auth0/auth0-react";

function QueuePage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() =>  {
        const fetchGroups = async () =>  {
            const groups = await getGroups(getAccessTokenSilently);
            setGroups(groups);
        }

        fetchGroups();
    }, []);

    const handleCreateGroup = async () => {
        if(!isAuthenticated) return;

        const newGroup = await createGroup(getAccessTokenSilently);
        if (newGroup) {
            setGroups([...groups, newGroup]);
        }
    }

    return (
        <div>
            <h1>Groups Page</h1>
            <ul>
                {groups.map((group) => (
                    <li key={group.id}>
                        <GroupCard players={group.players} />
                    </li>
                ))}
            </ul>

            <button onClick={handleCreateGroup}>
                Create New Slip
            </button>
        </div>
    )
}

export default QueuePage;