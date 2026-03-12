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
})