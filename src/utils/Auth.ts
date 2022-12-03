import { resolveEndpoint } from "./Utils"
import passwordValidator from "password-validator"
import { PROXY } from "./Constants"
import jwtDecode from "jwt-decode"

export const RESPONSE_AUTH_HEADER = "x-amzn-remapped-authorization"
export const RESPONSE_REFRESH_HEADER = "refresh"

// expires - number hours until cookie expires
export function setCookie(name: string, value: string, expires: number): void {
    const now = new Date()
    now.setTime(now.getTime() + (1000 * 60 * 60 * expires))
    document.cookie = `${name}=${value};expires=${now.toUTCString()}`
}

export function setAuthToken(token: string | null): void {
    if (token) {
        setCookie("authtoken", token, 2 * 24)
    }
}

export function setRefreshToken(token: string | null): void {
    if (token) {
        setCookie("refreshtoken", token, 35 * 24)
    }
}

const extractToken = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
        const jwt = parts.pop()?.split(";").shift()
        return (typeof jwt === "undefined") ? "" : jwt
    }
    return ""
}

export function getJWT(): string {
    return extractToken("authtoken")
}

export function getRefreshToken(): string {
    return extractToken("refreshtoken")
}

export function deleteJWT(): void {
    document.cookie = "authtoken="
}

export function deleteRefreshToken(): void {
    document.cookie = "refreshtoken="
}

export function fetchAuthEndpoint(endpoint: string, config: RequestInit): Promise<Response> {
    return fetch(resolveEndpoint(endpoint), {
        ...config,
        headers: {
            ...config.headers,
            Authorization: getJWT(),
            Refresh: getRefreshToken(),
        }
    }).then(res => {
        if (res.status === 200) {
            setAuthToken(res.headers.get(RESPONSE_AUTH_HEADER))
        }
        return res
    })
}

interface IDecodedUser {
    userid: number,
    sub: string,
    isAdmin?: boolean,
}

export function isTokenValid(): Promise<boolean> {
    const jwt = getJWT()
    const refresh = getRefreshToken()
    return fetch(PROXY + "auth/check", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": jwt,
            "Refresh": refresh,
        },
        mode: "cors"
    }).then(res => {
        if (res.status === 200) {
            setAuthToken(res.headers.get(RESPONSE_AUTH_HEADER))
            return true
        }
        return false
    })
}

export function isAdminCheck(): boolean {
    const jwt = getJWT()
    try {
        const decoded = jwtDecode<IDecodedUser>(jwt)
        if (decoded.isAdmin) {
            return decoded.isAdmin
        }
    } catch {
        // intentionally blank
    }
    return false
}

export function getUserid(): string {
    const jwt = getJWT()
    try {
        const decoded = jwtDecode<IDecodedUser>(jwt)
        return decoded.sub
    } catch {
        // intentionally blank
    }
    return ""
}


export function validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

export interface PasswordValidation {
    validLength: boolean
    validLowercase: boolean
    validDigits: boolean
}

const passwordSchema = new passwordValidator().is().min(6).has().lowercase().has().digits()

export function validatePassword(password: string): PasswordValidation {
    return convertPasswordValidation(passwordSchema.validate(password, {
        details: true
    }) as any[])
}

function validationContainsField(result: any[], field: string): boolean {
    return result.find(x => x?.validation === field) !== undefined
}

function convertPasswordValidation(result: any[]): PasswordValidation {
    return {
        validLength: !validationContainsField(result, "min"),
        validLowercase: !validationContainsField(result, "lowercase"),
        validDigits: !validationContainsField(result, "digits")
    }
}