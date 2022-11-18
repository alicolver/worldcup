import Typography from "@material-ui/core/Typography"
import React from "react"

export const Copyright = (): JSX.Element => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
          Ali Colver, Luke Ely & Simon Archer{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    )
}