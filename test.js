// no mutation
// no iteration
// no primitives
// no c.like arrays(absolute coordinates)

import test from 'ava'
import _ from 'lodash'
import {
    next,
    p,
    distance,
    isNb,
    countNb,
    newNb,
    position
} from './index'

test('pointtenessness', t => {
    let lePoint = p(0, 1)
    let lePoint2 = p(1, 10)

    t.deepEqual(lePoint.x(), 0)
    t.deepEqual(lePoint.y(), 1)

    t.deepEqual(lePoint2.x(), 1)
    t.deepEqual(lePoint2.y(), 10)

    t.pass()
})

test('empty neibourhood is dead', t => {

    const world = [
        p(0, 1)
    ]

    t.deepEqual(next(world), [])
    t.pass()
})


test('distance', t => {

    t.deepEqual(distance(p(1, 0), p(1, 1)), 1)
    t.deepEqual(distance(p(0, 1), p(1, 1)), 1)

    t.pass()
})

test('is nb', t => {

    t.deepEqual(isNb(p(1, 0), p(1, 1)), true)
    t.deepEqual(isNb(p(0, 1), p(1, 1)), true)
    t.deepEqual(isNb(p(0, 1), p(1, 100)), false)
    t.deepEqual(isNb(p(0, 1), p(2, 0)), false)

    t.pass()
})

test('count nb', t => {

    const world = [
        p(0, 0),
        p(0, 1),
        p(1, 0),
        p(1, 1)
    ]

    t.deepEqual(countNb(world, p(1, 0)), 3)

    t.pass()
})

test('block stays', t => {

    const world = [
        p(0, 0),
        p(0, 1),
        p(1, 0),
        p(1, 1)
    ]
    const result = next(world)

    t.deepEqual(result.length, world.length)
    const diff = _.xorBy(world, result, position)
    t.deepEqual(diff, [])

    t.pass()
})

test('New nb generation', t => {

    const expected = [
        p(-1, -1),
        p(-1, 0),
        p(-1, 1),
        p(0, -1),
        p(1, -1),
        p(0, 1),
        p(1, 0),
        p(1, 1),
    ]

    t.deepEqual(newNb(p(0, 0)).length, expected.length)
    t.deepEqual(expected.filter(e =>
        newNb(p(0, 0)).some(q => q === e)
    ), [])

    t.pass()
})

test('New nb generation on other point', t => {

    const expected = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [1, -1], [0, 1],
        [1, 0], [1, 1],
    ].map(p).map(point => p(point.x() + 1))

    t.deepEqual(newNb(p(1, 0)).length, expected.length)
    t.deepEqual(expected.filter(e =>
        newNb(p(0, 0)).some(q => q === e)
    ), [])

    t.pass()
})

test('blinker blinks', t => {

    const world = [
        p(0, 0),
        p(0, 1),
        p(0, 2),
    ]

    const expected = [
        p(0, 1),
        p(-1, 1),
        p(1, 1),
    ]

    const result = next(world)

    const diff = _.xorBy(expected, result, position)
    t.deepEqual(diff, [], diff.map(position))
    t.deepEqual(result.length, world.length)

    t.pass()
})

test('blinker blinks twice', t => {

    const world = [
        p(0, 0),
        p(0, 1),
        p(0, 2),
    ]

    const expected = [
        p(0, 0),
        p(0, 1),
        p(0, 2),
    ]

    const result = _.flow(next, next)(world)

    const diff = _.xorBy(expected, result, position)
    t.deepEqual(diff, [], diff.map(position))
    t.deepEqual(result.length, world.length)

    t.pass()
})
