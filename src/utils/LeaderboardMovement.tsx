import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";

export const getMovement = (rank: number, yesterdayRank: number) => {
    if (rank < yesterdayRank) {
      return <KeyboardArrowUpIcon color="success" fontSize="small" />;
    }
    if (rank > yesterdayRank) {
      return <KeyboardArrowDownIcon color="error" fontSize="small" />;
    }
    return <HorizontalRuleIcon color="disabled" fontSize="small" />;
  };