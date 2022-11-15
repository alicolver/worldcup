export interface IUserTextInput {
    value: string,
    error: boolean
}

export interface ILeague {
    leagueId: string,
    leagueName: string,
    userIds: string[]
}

export interface IUserData {
    userId: string,
    givenName: string,
    familyName: string,
    leagues: ILeague[]
}