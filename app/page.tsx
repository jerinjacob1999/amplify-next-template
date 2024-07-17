"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Loader } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

const client = generateClient<Schema>();


export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [todoLoading, setTodoLoading] = useState(true);

  function listTodos() {
    setTodoLoading(true);
    client.models.Todo.observeQuery().subscribe({
      next: (data) => {
        setTodos([...data.items])
        setTodoLoading(false)
      }
      ,
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    const todoContent = window.prompt("Todo content")
    if (todoContent) {
      client.models.Todo.create({
        content: window.prompt("Todo content"),
      });
    }
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      {
        todoLoading ?
          <Loader />
          :
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.content}</li>
            ))}
          </ul>
      }
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
