import { useEffect, useState } from "react"
import type { Group } from "../Types";
import GroupCard from "../components/GroupCard";

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
    }, [])

    const handleClick = () => {
        console.log("Create New Slip clicked");
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
                <a onClick={handleClick}>Create New Slip</a>
            </button>
        </div>
    )
}

export default QueuePage;