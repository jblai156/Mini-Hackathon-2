import "../App.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, useEffect } from 'react'
import TaskCard, { statuses } from '../components/task-card'
import { collection, onSnapshot, doc, setDoc, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

function BoardView() {
  const [tasks, setTasks] = useState([])
  const [currentlyHoveringOver, setCurrentlyHoveringOver] = useState(null)
  const [addingToColumn, setAddingToColumn] = useState(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const columns = statuses.map((status) => {
    const tasksInColumn = tasks.filter((task) => task.status === status)
    return {
      status,
      tasks: tasksInColumn
    }
  })

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'boards', 'board1', 'tasks'),
      (snapshot) => {
        const tasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setTasks(tasks)
      }
    )

    return () => unsubscribe()
  }, [])

  const updateTask = async (task) => {
    await setDoc(doc(db, 'boards', 'board1', 'tasks', task.id), task)
  }

  const createTask = async (status) => {
  if (!newTaskTitle.trim()) return

  const nextNumber = tasks.length + 1

  await addDoc(collection(db, 'boards', 'board1', 'tasks'), {
    title: newTaskTitle,
    status,
    priority: 'medium',
    points: 1,
    taskCode: `TASK-${nextNumber}`
  })

  setNewTaskTitle('')
  setAddingToColumn(null)
}

  const handleDrop = (e, status) => {
    e.preventDefault()
    setCurrentlyHoveringOver(null)

    const id = e.dataTransfer.getData('id')
    const task = tasks.find((task) => task.id === id)

    if (task) {
      updateTask({ ...task, status })
    }
  }

  const handleDragEnter = (status) => {
    setCurrentlyHoveringOver(status)
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {columns.map((column) => (
          <div
            key={column.status}
            onDrop={(e) => handleDrop(e, column.status)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => handleDragEnter(column.status)}
            className="col-md-3 border-end px-3 pb-3"
          >
            <div className="d-flex justify-content-between align-items-center mb-3 fw-bold text-secondary-emphasis">
              <h2 className="text-capitalize m-0">{column.status}</h2>
              <span className="fs-2 fw-semibold">
                {column.tasks.reduce((total, task) => total + (task?.points || 0), 0)}
              </span>
            </div>

            <div
              className={`rounded-3 p-2 min-vh-100 ${
                currentlyHoveringOver === column.status ? 'bg-secondary-subtle' : ''
              }`}
            >
              {column.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  updateTask={updateTask}
                />
              ))}

              {addingToColumn === column.status ? (
                <div className="mt-2">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    autoFocus
                  />
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => createTask(column.status)}
                    >
                      Add
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        setAddingToColumn(null)
                        setNewTaskTitle('')
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-link text-decoration-none p-0 mt-2"
                  onClick={() => setAddingToColumn(column.status)}
                >
                  + Add task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BoardView