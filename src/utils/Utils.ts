import { LAMBDA, PROXY } from './Constants'
import jwtDecode from "jwt-decode"

interface IDecodedUser {
    userid: number
    admin?: boolean,
}

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

export function isAdminCheck(): boolean {
    const jwt = getJWT();
    try {
        const decoded = jwtDecode<IDecodedUser>(jwt)
        if (decoded.admin) {
            return decoded.admin
        }
    } catch { }
    return false
}

export function getUserid(): number {
    const jwt = getJWT();
    try {
        const decoded = jwtDecode<IDecodedUser>(jwt)
        return decoded.userid
    } catch { }
    return 0
}


export function validateEmail(email: String): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function dateToOrdinal(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

export function calculateScore(pred_one_goals: string | undefined, pred_two_goals: string | undefined, act_one_goals: number, act_two_goals: number): number {
    if (pred_one_goals === undefined || pred_two_goals === undefined) {
        return 0
    }

    const pred_one = parseInt(pred_one_goals)
    const pred_two = parseInt(pred_two_goals)

    if (pred_one === act_one_goals && pred_two === act_two_goals) {
        return 3
    }

    if (act_one_goals > act_two_goals && pred_one > pred_two) {
        return 1
    }

    if (act_one_goals < act_two_goals && pred_one < pred_two) {
        return 1
    }

    if (act_one_goals === act_two_goals && pred_one === pred_two) {
        return 1
    }

    return 0
}

export function gotScoreCorrect(pred_one_goals: string | undefined, pred_two_goals: string | undefined, act_one_goals: number, act_two_goals: number): boolean {
    if (pred_one_goals === undefined || pred_two_goals === undefined) {
        return false
    }

    const pred_one = parseInt(pred_one_goals)
    const pred_two = parseInt(pred_two_goals)

    return pred_one === act_one_goals && pred_two === act_two_goals
}

export function gotResultCorrect(pred_one_goals: string | undefined, pred_two_goals: string | undefined, act_one_goals: number, act_two_goals: number): boolean {
    if (pred_one_goals === undefined || pred_two_goals === undefined) {
        return false
    }

    const pred_one = parseInt(pred_one_goals)
    const pred_two = parseInt(pred_two_goals)

    return ((act_one_goals > act_two_goals && pred_one > pred_two) || (act_one_goals < act_two_goals && pred_one < pred_two) || (act_one_goals === act_two_goals && pred_one === pred_two))
}

export function resolveEndpoint(endpoint: string): string {
    if (endpoint === 'leaderboard') {
        return LAMBDA + endpoint
    }
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
    document.cookie = 'jwt=';
}