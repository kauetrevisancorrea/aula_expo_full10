import * as repo from '../services/auth.repo'
import { Role } from "../model";

const URL = 'http://192.168.15.5:3030/roles';

async function getHeaders() {
    const session = await repo.getSession();

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.token}`,
    };
}

export async function getList() {
    const response = await fetch(URL, {
        method: 'GET',
        headers: await getHeaders(),
    })

    if (response.ok) {
        return await response.json() as Role[];
    }
    throw new Error(await response.text())
}

export async function getById(id: string) {
    const response = await fetch(`${URL}/${id}`, {
        method: 'GET',
        headers: await getHeaders(),
    })

    if (response.ok) {
        return await response.json() as Role;
    }
    throw new Error(await response.text())
}

export async function register(role: Role) {
    const response = await fetch(URL, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(role),
    })

    if (response.ok) {
        return await response.json() as Role;
    }
    throw new Error(await response.text())
}

export async function update(role: Role) {
    const response = await fetch(`${URL}/${role.id}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(role),
    })

    if (response.ok) {
        return await response.json() as Role;
    }
    throw new Error(await response.text())
}

export async function remove(id: number) {
    const response = await fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: await getHeaders(),
    })

    if (response.ok) {
        return await response.json() as boolean;
    }
    throw new Error(await response.text())
}