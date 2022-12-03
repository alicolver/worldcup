import { AppBar, Box, Container, makeStyles } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import qatar from "../img/qatar.png"
import LogoutIcon from "@mui/icons-material/Logout"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import React from "react"
import { deleteJWT, deleteRefreshToken } from "../utils/Auth"

const useStyles = makeStyles({
    logo: {
        height: "40px",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
    },
    headerBar: {
        marginBottom: "10px",
        margin: 0,
        width: "100%",
        background:
      "linear-gradient(90deg, rgba(154,12,52,1) 0%, rgba(0,0,0,1) 100%)",
        zIndex: 10,
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
    },
    headerContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        padding: "0.5rem",
        maxWidth: "1080px",
        margin: "auto",
    }
})

export default function Header(): JSX.Element {
    const classes = useStyles()
    const history = useHistory()

    function logout() {
        deleteJWT()
        deleteRefreshToken()
        history.push("/")
    }

    return (
        <Box>
            <AppBar className={classes.headerBar}>
                <Container className={classes.headerContainer}>
                    <HomeOutlinedIcon onClick={() => history.push("/home")}
                        sx={{ color: "#FFFFFF", position: "relative", left: "15px" }}
                    />
                    <img className={classes.logo} src={qatar} alt={"qatar 2022 logo"} onClick={() => history.push("/home")} />
                    <LogoutIcon onClick={() => logout()}
                        sx={{ color: "#FFFFFF", position: "relative", right: "15px" }}
                    />
                </Container>
            </AppBar>
        </Box>
    )
}
