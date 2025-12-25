import { useEffect, useState } from "react"
import type { Group } from "../../../Types";
import GroupCard from "./GroupCard";

function QueuePage() {
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/groups');
                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        }
        fetchData();
    }, [groups]);

    const createGroup = async () => {
        const postData = async () => {
            try {
                const response = await fetch('http://localhost:3000/groups', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const newGroup = await response.json();
                newGroup.players = [];
                return newGroup;
            } catch (error) {
                console.error('Error creating group:', error);
            }
        }
        setGroups([...groups, await postData()]);
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

            <button>
                <a onClick={createGroup}>Create New Slip</a>
            </button>
        </div>
    )
}

export default QueuePage;