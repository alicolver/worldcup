import { useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom";
import { isTokenValid } from "../utils/Utils";

interface ComponentProps {
    children?: React.ReactNode
}

interface AuthRedirectProps extends ComponentProps {
    expectAuthResult: boolean
    redirectTo: string
}

const generateRedirectSearchParams = (redirectTo: string) => {
    const params = new URLSearchParams()
    params.set("redirect", redirectTo)
    return params
}


export const AuthRedirect = (props: AuthRedirectProps) => {
    const history = useHistory()
    const search = new URLSearchParams(useLocation().search)

    useEffect(() => {
        isTokenValid().then(valid => {
            if (valid === props.expectAuthResult) {
                if (props.expectAuthResult) {
                    history.replace(`${props.redirectTo}`)
                    return
                }

                const combinedParams = new URLSearchParams({
                    ...Object.fromEntries(search),
                    ...Object.fromEntries(generateRedirectSearchParams(history.location.pathname))
                })

                history.replace(`${props.redirectTo}?${combinedParams.toString()}`)
            }
        })
    })

    return (
        <div>
            {props.children}
        </div>
    )
}