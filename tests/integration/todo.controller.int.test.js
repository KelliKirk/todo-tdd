const request = require("supertest")
const app = require("../../app")
const newTodo = require("../mock-data/new-todo.json")
const TodoModel = require("../../models/todo.model")
const endpointUrl = "/todos/"

TodoModel.create = jest.fn()

describe(endpointUrl, () => {
    it("POST " + endpointUrl, async () => {
        TodoModel.create.mockResolvedValue(newTodo)
        const response = await request(app)
            .post(endpointUrl)
            .send(newTodo)
        expect(response.statusCode).toBe(201)
        expect(response.body.title).toBe(newTodo.title)
        expect(response.body.done).toBe(newTodo.done)
    })
    it("should return error 500 on malformed data with POST" + endpointUrl, async () => {
        TodoModel.create.mockRejectedValue(new Error("Todo validation failed: done: Path 'done' is required"))
        const response = await request(app)
            .post(endpointUrl)
            .send({ title: "Missing done property" })
        expect(response.statusCode).toBe(500)
        expect(response.body).toStrictEqual({ message: "Todo validation failed: done: Path 'done' is required" })
    })
})
