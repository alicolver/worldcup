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
}

export interface IUserData {
    userId: string,
    givenName: string,
    familyName: string,
    leagues: ILeague[]
}