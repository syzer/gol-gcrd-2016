const _ = require('lodash')

const p = (x, y) => ({
    y() {
        return y
    },
    x() {
        return x
    }
})

// O.O is bad
const newNb = (q) => ([
    p(q.x() - 1, q.y() - 1),
    p(q.x() - 1, q.y()),
    p(q.x() - 1, q.y() + 1),
    p(q.x(), q.y() - 1),
    p(q.x() + 1, q.y() - 1),
    p(q.x(), q.y() + 1),
    p(q.x() + 1, q.y()),
    p(q.x() + 1, q.y() + 1),
])

const distance = (p, q) => Math.max(
    Math.abs(q.y() - p.y()),
    Math.abs(q.x() - p.x())
)

const isNb = (p, q) => distance(p, q) === 1

const countNb = (world, point) =>
    world.filter((c, i) => isNb(c, point)).length

const isAlive = (world, cell) =>
countNb(world, cell) === 3 || countNb(world, cell) === 2

const isNewAlive = (world, cell) =>
countNb(world, cell) === 3

const newNbALive = (world, cell) =>
    newNb(cell).filter(newCell => isNewAlive(world, newCell))

// O.O is terrible because we need to write like that
const position = (p) => p.x() + ',' + p.y() + ';'

// [p, p, p] => [p2, p, p2, p2]
const next = (world) =>
    world.reduce((acc, cell) =>
            isAlive(world, cell)
                ? _.uniqBy(acc.concat(cell).concat(newNbALive(world, cell)), position)
                : acc
        , [])

module.exports = {
    next, p, distance, isNb, countNb, newNb, position
}
