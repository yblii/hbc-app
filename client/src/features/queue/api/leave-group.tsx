export const leaveGroup = async (groupId: number, getAccessTokenSilently: () => Promise<string>) => {
    try {
        const token = await getAccessTokenSilently();

        const response = await fetch(import.meta.env.VITE_API_URL + `/groups/${groupId}/leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if(!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error leaving group:', error);
    }
}