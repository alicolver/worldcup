import {PROXY} from './Constants'

export function isTokenValid(): boolean {
    if (!localStorage.getItem("token")) {
        return false
    } else {
        fetch(PROXY + "authenticate", {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Auth-Token': localStorage.getItem("sessionId") || ''
            }
        }).then(res => res.json()).then(res => {
            return res.valid
        })
    }
    return false;
}

export function validateEmail(email: String): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function goTo(endpoint: string): string {
    return PROXY + endpoint
}

export function setJWT(jwt: string) {
    document.cookie = "jwt="+jwt;
}

export function getJWT() {
    const cookies = document.cookie.split('=')
    return cookies.length === 1 ? cookies[1] : ''
}

export function deleteJWT() {
    document.cookie = '';
}