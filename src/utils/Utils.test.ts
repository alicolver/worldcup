import {describe, expect, test} from "@jest/globals"
import { hasMatchKickedOff, parseMatchKickOff } from "./Utils"

test("Test Date Time Parsing", () => {
    const expected: Date = new Date(Date.parse("2022-11-21T11:11:00"))
    expect(parseMatchKickOff("2022-11-21", "11:11")).toStrictEqual(expected)
}, 1000)

describe("Test hasMatchKickedOff", () => {
    test("same time", () => {
        expect(hasMatchKickedOff("2022-11-21", "11:11", new Date(Date.parse("2022-11-21T11:11:00")))).toBe(false)
    }, 1000)

    test("earlier time", () => {
        expect(hasMatchKickedOff("2022-11-21", "11:11", new Date(Date.parse("2022-11-21T09:11:00")))).toBe(false)
    }, 1000)

    test("earlier day", () => {
        expect(hasMatchKickedOff("2022-11-21", "11:11", new Date(Date.parse("2022-11-20T11:11:00")))).toBe(false)
    }, 1000)

    test("earlier month", () => {
        expect(hasMatchKickedOff("2022-11-21", "11:11", new Date(Date.parse("2022-10-21T11:11:00")))).toBe(false)
    }, 1000)

    test("later time", () => {
        expect(hasMatchKickedOff("2022-11-21", "11:11", new Date(Date.parse("2022-11-21T11:11:01")))).toBe(true)
    }, 1000)

    test("later day", () => {
        expect(hasMatchKickedOff("2022-11-21", "11:11", new Date(Date.parse("2022-11-22T11:11:01")))).toBe(true)
    }, 1000)

    test("later month", () => {
        expect(hasMatchKickedOff("2022-11-21", "11:11", new Date(Date.parse("2022-12-22T11:11:01")))).toBe(true)
    }, 1000)
})