export const createGroup= async (getAccessTokenSilently: () => Promise<string>) => {
    try {
        const token = await getAccessTokenSilently();

        const response = await fetch(import.meta.env.VITE_API_URL + '/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if(!response.ok) {
            throw new Error('Network response was not ok');
        } 

        const newGroup = await response.json();
        return newGroup;
    } catch (error) {
        console.error('Error creating group:', error);
    }
}