import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule"
import React from "react"

export const getMovement = (rank: number, yesterdayRank: number): JSX.Element => {
    if (rank < yesterdayRank) return <KeyboardArrowUpIcon color="success" fontSize="small" />
    if (rank > yesterdayRank) return <KeyboardArrowDownIcon color="error" fontSize="small" />
    return <HorizontalRuleIcon color="disabled" fontSize="small" />
}