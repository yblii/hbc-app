import { useEffect, useState } from "react"
import type { Slip } from "../Types";
import SlipDisplay from "../components/Slip";

function SlipsPage() {
    const [slips, setSlips] = useState<Slip[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/slips');
                const data = await response.json();
                setSlips(data);
            } catch (error) {
                console.error('Error fetching slips:', error);
            }
        }
        fetchData();
    }, [])

    const handleClick = () => {
        console.log("Create New Slip clicked");
    }

    return (
        <div>
            <h1>Slips Page</h1>
            <ul>
                {slips.map((slip) => (
                    <li key={slip.id}>
                        <SlipDisplay players={slip.players} />
                    </li>
                ))}
            </ul>

            <button>
                <a onClick={handleClick}>Create New Slip</a>
            </button>
        </div>
    )
}

export default SlipsPage;