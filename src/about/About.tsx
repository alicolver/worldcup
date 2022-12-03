import { Box, Typography, Button, makeStyles, Dialog, Slide, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core"
import InfoIcon from "@mui/icons-material/Info"
import { TransitionProps } from "@mui/material/transitions"
import React, { useState } from "react"
import { MAIN_COLOR } from "../utils/Constants"

const useStyles = makeStyles({
    infoButton: {
        position: "absolute",
        marginTop: "5px",
        color: MAIN_COLOR
    },
    modalRoot: {
        textAlign: "center",
        top: "15%",
        position: "absolute"
    },
    confirm: {
        margin: "auto"
    }
})

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children?: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="down" ref={ref} {...props} />
})

export default function AboutModal(): JSX.Element {
    const classes = useStyles()
    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <>  
            <Box onClick={handleOpen}><InfoIcon fontSize="large" className={classes.infoButton}/></Box>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                closeAfterTransition
                classes={{ paper: classes.modalRoot}}
            >
                <DialogTitle>{"The Scoring System"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography>2 points for a correct result.</Typography> 
                        <Typography>5 points for a correct scoreline.</Typography>
                        <Typography>1 point for correct team to progress.</Typography>
                        <Typography>If you pick a draw you will chose this yourself by clicking a flag</Typography>
                        <Typography>If you pick a win then it will be done for you</Typography>
                        <Typography>{"p.s. click a game after it's kicked off :)"}</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} className={classes.confirm}>Okay</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}