export async function joinGroup(groupId: number, getAccessTokenSilently: () => Promise<string>) {
    const token = await getAccessTokenSilently();

    const response = await fetch(import.meta.env.BASE_URL + `/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    if(!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
}