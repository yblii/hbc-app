import type { User } from "../../../Types";

export async function completeUserProfile(firstName: string, lastName: string, 
        getAccessTokenSilently: () => Promise<string>): Promise<User> {
    const token = await getAccessTokenSilently();

    const response = await fetch(import.meta.env.VITE_API_URL + '/users/me', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName
        })
    });

    if(!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
    }

    return await response.json();
}