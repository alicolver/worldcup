import { PROXY } from './Constants'

export function isTokenValid(): Promise<boolean> {
    const jwt = getJWT();
    return fetch(PROXY + "validateToken", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authenticate': jwt
        }
    }).then(res => res.json()).then(res => {
        return res.success
    })
}

export function validateEmail(email: String): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function dateToOrdinal(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

export function goTo(endpoint: string): string {
    return PROXY + endpoint
}

export function setJWT(jwt: string) {
    document.cookie = "jwt=" + jwt;
}

export function getJWT(): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${'jwt'}=`);
    if (parts.length === 2) {
        const jwt = parts.pop()!.split(';').shift()
        return (typeof jwt === 'undefined') ? '' : jwt;
    }
    return '';
}

export function deleteJWT() {
    document.cookie = '';
}