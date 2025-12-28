export async function getUserInfo(getAccessTokenSilently: () => Promise<string>) {
    const token = await getAccessTokenSilently();
    
    const response = await fetch(import.meta.env.VITE_API_URL + '/users/me', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    if(!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    } 

    return await response.json();
}