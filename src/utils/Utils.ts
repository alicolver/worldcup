import {proxy} from './Constants'

export function isTokenValid() {
    if (!localStorage.getItem("token")) {
        return false
    } else {
        fetch(proxy + "/authenticate", {
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
}
