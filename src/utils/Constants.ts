import { IMatchData } from "../types/types"

export const PROXY = "https://mvlag9k698.execute-api.eu-west-2.amazonaws.com/prod/" // PROD!!!
// export const PROXY = "https://m8n8luh9ri.execute-api.eu-west-2.amazonaws.com/prod/" // ALI DEV STACK
// export const PROXY = 'https://g9pl9osqs5.execute-api.eu-west-2.amazonaws.com/prod/' // LUKE DEV STACK
// export const PROXY = 'https://vd3ek24g2d.execute-api.eu-west-2.amazonaws.com/prod/' // SIMON DEV STACK
export const LAMBDA = "https://dle6yh5vm2.execute-api.eu-west-2.amazonaws.com/"
export const SUCCESS = "success"

const PORT_EXTENSION = window.location.port ? `:${window.location.port}` : ""

export const HOST_URL = `${window.location.protocol}//${window.location.hostname}${PORT_EXTENSION}/worldcup#/`

export const pub = "BAytDQ8so4h7QqWVGInkAkNvnuuccVmgnvTKex5qszq5QhgH8nYC7ydy1AVuHmDtkZhIrBh8ZRb3F-Qv8BqCUlA"

export const mockMatchData: IMatchData = {
    matchId: "testing",
    homeTeam: "South Korea",
    awayTeam: "switzerland",
    gameStage: "GROUP",
    matchDay: 1,
    matchDate: "2022-11-20",
    matchTime: "15:00",
    isFinished: false,
}

export const MAIN_COLOR = "#9a0c34"