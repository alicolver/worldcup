import { describe, expect, test } from "@jest/globals"
import { HomeOrAway } from "../predictions/Prediction"
import { calculateScoreKnockouts } from "./Score"

describe("test calculate knockout score", () => {

    test("home score", () => {
        const predictedHome = 2
        const predictedAway = 1
        const predictedTeamToGoThrough = HomeOrAway.HOME

        const actualHome = 2
        const actualAway = 1
        const actualTeamToGoThrough = HomeOrAway.HOME

        expect(
            calculateScoreKnockouts(
                predictedHome, 
                predictedAway, 
                predictedTeamToGoThrough, 
                actualHome, 
                actualAway, 
                actualTeamToGoThrough
            )
        ).toBe(6)
    }, 1000)

    test("away score", () => {
        const predictedHome = 0
        const predictedAway = 1
        const predictedTeamToGoThrough = HomeOrAway.AWAY

        const actualHome = 0
        const actualAway = 1
        const actualTeamToGoThrough = HomeOrAway.AWAY

        expect(
            calculateScoreKnockouts(
                predictedHome, 
                predictedAway, 
                predictedTeamToGoThrough, 
                actualHome, 
                actualAway, 
                actualTeamToGoThrough
            )
        ).toBe(6)
    }, 1000)

    test("home result", () => {
        const predictedHome = 2
        const predictedAway = 1
        const predictedTeamToGoThrough = HomeOrAway.HOME

        const actualHome = 1
        const actualAway = 0
        const actualTeamToGoThrough = HomeOrAway.HOME

        expect(
            calculateScoreKnockouts(
                predictedHome, 
                predictedAway, 
                predictedTeamToGoThrough, 
                actualHome, 
                actualAway, 
                actualTeamToGoThrough
            )
        ).toBe(3)
    }, 1000)

    test("away result", () => {
        const predictedHome = 0
        const predictedAway = 1
        const predictedTeamToGoThrough = HomeOrAway.AWAY

        const actualHome = 0
        const actualAway = 2
        const actualTeamToGoThrough = HomeOrAway.AWAY

        expect(
            calculateScoreKnockouts(
                predictedHome, 
                predictedAway, 
                predictedTeamToGoThrough, 
                actualHome, 
                actualAway, 
                actualTeamToGoThrough
            )
        ).toBe(3)
    }, 1000)

    test("draw score, correct team", () => {
        const predictedHome = 1
        const predictedAway = 1
        const predictedTeamToGoThrough = HomeOrAway.AWAY

        const actualHome = 1
        const actualAway = 1
        const actualTeamToGoThrough = HomeOrAway.AWAY

        expect(
            calculateScoreKnockouts(
                predictedHome, 
                predictedAway, 
                predictedTeamToGoThrough, 
                actualHome, 
                actualAway, 
                actualTeamToGoThrough
            )
        ).toBe(6)
    }, 1000)


    test("draw score, wrong team", () => {
        const predictedHome = 1
        const predictedAway = 1
        const predictedTeamToGoThrough = HomeOrAway.HOME

        const actualHome = 1
        const actualAway = 1
        const actualTeamToGoThrough = HomeOrAway.AWAY

        expect(
            calculateScoreKnockouts(
                predictedHome, 
                predictedAway, 
                predictedTeamToGoThrough, 
                actualHome, 
                actualAway, 
                actualTeamToGoThrough
            )
        ).toBe(5)
    }, 1000)

    test("away teamToGoThrough", () => {
        const predictedHome = 1
        const predictedAway = 1
        const predictedTeamToGoThrough = HomeOrAway.AWAY

        const actualHome = 0
        const actualAway = 2
        const actualTeamToGoThrough = HomeOrAway.AWAY

        expect(
            calculateScoreKnockouts(
                predictedHome, 
                predictedAway, 
                predictedTeamToGoThrough, 
                actualHome, 
                actualAway, 
                actualTeamToGoThrough
            )
        ).toBe(1)
    }, 1000)

    test("home teamToGoThrough", () => {
        const predictedHome = 1
        const predictedAway = 1
        const predictedTeamToGoThrough = HomeOrAway.HOME

        const actualHome = 5
        const actualAway = 0
        const actualTeamToGoThrough = HomeOrAway.HOME

        expect(
            calculateScoreKnockouts(
                predictedHome, 
                predictedAway, 
                predictedTeamToGoThrough, 
                actualHome, 
                actualAway, 
                actualTeamToGoThrough
            )
        ).toBe(1)
    }, 1000)
    
    test("should be 0", () => {
        const predictedHome = 2
        const predictedAway = 1
        const predictedTeamToGoThrough = HomeOrAway.HOME

        const actualHome = 1
        const actualAway = 1
        const actualTeamToGoThrough = HomeOrAway.AWAY

        expect(
            calculateScoreKnockouts(
                predictedHome, 
                predictedAway, 
                predictedTeamToGoThrough, 
                actualHome, 
                actualAway, 
                actualTeamToGoThrough
            )
        ).toBe(0)
    }, 1000)
})