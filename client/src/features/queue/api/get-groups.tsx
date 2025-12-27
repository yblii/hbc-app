export const getGroups = async (getAccessTokenSilently: () => Promise<string>) => {
    try {
        const token = await getAccessTokenSilently();

        const response = await fetch('http://localhost:3000/groups', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching groups:', error);
    }
}