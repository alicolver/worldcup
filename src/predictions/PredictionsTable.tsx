import { Table, TableHead, TableRow, TableCell, TableBody, TablePagination, makeStyles } from "@material-ui/core"
import React, { ReactFragment, useEffect, useState } from "react"
import { IUserPrediction } from "../types/types"
import { capitalizeFirstLetter } from "../utils/Utils"

interface IPredictionsTableProps {
    predictionData: IUserPrediction[];
}

const useStyles = makeStyles({
    table: {
        width: "90%",
        margin: "auto"
    }
})

export default function PredictionsTable(props: IPredictionsTableProps): JSX.Element {
    const classes = useStyles()
    const [currentPage, setCurrentPage] = useState<number>(0)
    const rowsPerPage = 10

    useEffect(() => {
        setCurrentPage(0)
    }, [props.predictionData])

    function getRows(): ReactFragment {
        if (props.predictionData.length === 0) return <></>
        return props.predictionData.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map(predData => (
            <TableRow key={predData.userId}>
                <TableCell>
                    {capitalizeFirstLetter(predData.givenName)}{" "}
                    {capitalizeFirstLetter(predData.familyName)}
                </TableCell>
                <TableCell
                    style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}
                >
                    {
                        (predData.homeScore === null) || (predData.awayScore === null)
                            ? "No Prediction"
                            : predData.homeScore + ":" + predData.awayScore
                    }
                </TableCell>
                <TableCell>
                    {predData.points ? predData.points : "0"}
                </TableCell>
            </TableRow>
        ))
    }

    return (
        <Table size="small" className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>
                        <b>Name</b>
                    </TableCell>
                    <TableCell>
                        <b>Prediction</b>
                    </TableCell>
                    <TableCell>
                        <b>Points</b>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {getRows()}
            </TableBody>
            <TablePagination 
                count={props.predictionData.length}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onChangePage={(ignored, page) => setCurrentPage(page)}
                rowsPerPageOptions={[]}
            />
        </Table>
    )
}