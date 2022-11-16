import { useEffect } from "react"
import { useHistory } from "react-router-dom";
import { isTokenValid } from "../utils/Utils";

interface ComponentProps {
    children?: React.ReactNode
}

interface AuthRedirectProps extends ComponentProps {
    expectAuthResult: boolean
    redirectTo: string
}


export const AuthRedirect = (props: AuthRedirectProps) => {
    const history = useHistory()


    useEffect(() => {
        isTokenValid().then(valid => {
            if (valid === props.expectAuthResult) {
                history.replace(props.redirectTo)
            }
        })
    })

    return (
        <div>
            {props.children}
        </div>
    )
}