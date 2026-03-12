const request = require("supertest")
const app = require("../../app")
const newTodo = require("../mock-data/new-todo.json")
const TodoModel = require("../../models/todo.model")
const endpointUrl = "/todos/"
const allTodos = require("../mock-data/all-todos.json")

TodoModel.create = jest.fn()
TodoModel.find = jest.fn()
TodoModel.findById = jest.fn()

let firstTodo

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
    it("GET " + endpointUrl, async () => {
    TodoModel.find.mockResolvedValue(allTodos)
    const response = await request(app).get(endpointUrl)
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body[0].title).toBeDefined()
    expect(response.body[0].done).toBeDefined()
    firstTodo = response.body[0] 
})
    it("GET by Id " + endpointUrl + ":todoId", async () => {
    TodoModel.findById.mockResolvedValue(firstTodo)
    const response = await request(app)
        .get(endpointUrl + firstTodo._id)
    expect(response.statusCode).toBe(200)
    expect(response.body.title).toBe(firstTodo.title)
    expect(response.body.done).toBe(firstTodo.done)
})
    it("GET todo by id doesnt exist " + endpointUrl + ":todoId", async () => {
    TodoModel.findById.mockResolvedValue(null)
    const response = await request(app)
        .get(endpointUrl + "69b2a193fa7263a81643001f")
    expect(response.statusCode).toBe(404)
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
