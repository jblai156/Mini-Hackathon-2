import { useState } from 'react'

const lowPriorityIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="3">
    <path d="M5 9l7 7 7-7" />
  </svg>
)
const mediumPriorityIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2">
    <path d="M5 10h14" />
    <path d="M5 14h14" />
  </svg>
)
const highPriorityIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
    <path d="M5 15l7-7 7 7" />
  </svg>
)

const TaskCard = ({ task, updateTask }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const points = task.points || 0
  const updatePoints = (direction) => {
    const fib = [0, 1, 2, 3, 5, 8, 13]
    const index = fib.indexOf(points)
    const nextIndex = direction === 'up' ? index + 1 : index - 1
    const newPoints = fib[nextIndex]
    if(newPoints !== undefined) {
      updateTask({...task, points: newPoints})
    } 
  }
  return <div
    draggable
    onDragStart={(e) =>{
      e.dataTransfer.setData("id", task.id)
    }}
    className="border border-secondary rounded-4 px-2 my-2 bg-light text-black"
  >
    <div className="h3 fw-semibold mb-2">
      {isEditingTitle ? (
        <input
          autoFocus
          className="w-100"
          onBlur={() => setIsEditingTitle(false)}
          value={task.title}
          onChange={(e) => updateTask({...task, title: e.target.value})}
        />
      ): (
        <div onClick={() => setIsEditingTitle(true)}>
          {task.title}
        </div>
      )}
    </div>
    <div className="h4 d-flex gap-4 justify-content-between py-2 text-secondary fw-normal text-secondary-emphasis">
      <div className="d-flex gap-2 align-items-center">
        <div>{task.id}</div>
        {task.priority === 'high' && highPriorityIcon}
        {task.priority === 'medium' && mediumPriorityIcon}
        {task.priority === 'low' && lowPriorityIcon}
      </div>
    <div className="d-flex gap-2">
        <button className="btn p-0 text-dark" onClick={(e) => updatePoints('down')}>-</button>
        <div className="fw-bold">{points}</div>
        <button className="btn p-0 text-dark" onClick={(e) => updatePoints('up')}>+</button>
      </div>
    </div>
    </div>
  }

export const statuses = ['backlog', 'todo', 'inProgress', 'done']
export const priorities = ['low', 'medium', 'high']

export default TaskCard