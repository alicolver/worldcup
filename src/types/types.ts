export interface IUserTextInput {
    value: string,
    error: boolean
}

export interface ILeague {
    leagueId: string,
    leagueName: string,
    userIds: string[],
    users: {
        userId: string;
        totalPoints: number;
        rank: number
    }[];
    currentRanking: number,
    previousRanking: number
}

export interface IUserData {
    userId: string,
    givenName: string,
    familyName: string,
    leagues: ILeague[]
}

export interface IMatchData {
    result?: {
        home: number;
        away: number;
    } | undefined;
    matchId: string;
    homeTeam: string;
    awayTeam: string;
    gameStage: "GROUP" | "FINAL" | "SEMIFINAL" | "QUARTERFINAL" | "OCTOFINAL";
    matchDay: number;
    matchDate: string;
    matchTime: string;
    isFinished: boolean;
}
export interface IPredictionData {
    homeScore: number | null,
    awayScore: number | null
}