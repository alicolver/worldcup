import { PROXY } from "./Constants"
import { IWasSent } from "../types/types"

export function resolveEndpoint(endpoint: string): string {
    return `${PROXY}${endpoint}`
}

export const capitalizeFirstLetter = (input: string): string => input.charAt(0).toUpperCase() + input.slice(1)

export const parseDate = (date: string): string => {
    const humanReadableDate = new Date(date).toDateString().split(" ")
    const day = humanReadableDate[0]
    const calendarDate = humanReadableDate[1]
    const month = humanReadableDate[2]
    return `${day} ${calendarDate} ${month}`
}

export function getResponseGlow(wasSent: IWasSent): React.CSSProperties | undefined {
    return wasSent.success ?
        {
            border: "1px solid rgb(86, 180, 89)",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(82, 168, 100, 0.6)"
        } : wasSent.error ? {
            border: "1px solid rgb(199, 18, 49)",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)inset, 0px 0px 8px rgba(160, 30, 60, 0.6)"
        } : {}
}
