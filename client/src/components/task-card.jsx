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

const TaskCard = ({ task, updateTask, teamMembers = [] }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [draft, setDraft] = useState({
    description: task.description || '',
    taskCode: task.taskCode || '',
    priority: task.priority || 'medium',
    assignedTo: task.assignedTo || '',
    deadline: task.deadline || '',
  })

  const points = task.points || 0

  const updatePoints = (direction) => {
    const fib = [0, 1, 2, 3, 5, 8, 13]
    const index = fib.indexOf(points)
    const nextIndex = direction === 'up' ? index + 1 : index - 1
    const newPoints = fib[nextIndex]

    if (newPoints !== undefined) {
      updateTask({ ...task, points: newPoints })
    }
  }

  const openEdit = () => {
    setDraft({
      description: task.description || '',
      taskCode: task.taskCode || '',
      priority: task.priority || 'medium',
      assignedTo: task.assignedTo || '',
      deadline: task.deadline || '',
    })
    setIsEditing(true)
  }

  const saveEdit = async () => {
    await updateTask({
      ...task,
      ...draft,
      createdAt: task.createdAt || new Date().toISOString().split('T')[0],
    })
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  return (
    <div className="my-2">
      {/* ORIGINAL CARD */}
      <div
        draggable
        onDragStart={(e) => {
          if (isEditing) return
          e.dataTransfer.setData("id", task.id)
        }}
        className="border border-secondary rounded-4 px-2 py-2 bg-light text-black"
      >
        {/* TITLE */}
        <div className="h3 fw-semibold mb-2 d-flex justify-content-between">
          {isEditingTitle ? (
            <input
              autoFocus
              className="w-100"
              onBlur={() => setIsEditingTitle(false)}
              value={task.title}
              onChange={(e) => updateTask({ ...task, title: e.target.value })}
            />
          ) : (
            <div onClick={() => setIsEditingTitle(true)}>
              {task.title}
            </div>
          )}

          <button
            className="btn btn-sm btn-outline-dark ms-2"
            onClick={openEdit}
          >
            Edit
          </button>
        </div>

        {/* BOTTOM ROW */}
        <div className="h4 d-flex gap-4 justify-content-between py-2 text-secondary fw-normal text-secondary-emphasis">
          <div className="d-flex gap-2 align-items-center">
            <div>{task.taskCode ? <div>{task.taskCode}</div> : null}</div>

            {/* KEEP YOUR ICONS EXACTLY */}
            {task.priority === 'high' && highPriorityIcon}
            {task.priority === 'medium' && mediumPriorityIcon}
            {task.priority === 'low' && lowPriorityIcon}
          </div>

          <div className="d-flex gap-2">
            <button className="btn p-0 text-dark" onClick={() => updatePoints('down')}>-</button>
            <div className="fw-bold">{points}</div>
            <button className="btn p-0 text-dark" onClick={() => updatePoints('up')}>+</button>
          </div>
        </div>

        {/* EXTRA INFO */}
        {!isEditing && (
          <div className="small text-muted">
            {task.assignedTo && <div><strong>Assigned:</strong> {task.assignedTo}</div>}
            {task.deadline && <div><strong>Deadline:</strong> {task.deadline}</div>}
            {task.description && <div><strong>Desc:</strong> {task.description}</div>}
          </div>
        )}
      </div>

      {/* EDIT PANEL */}
      {isEditing && (
        <div className="border rounded-4 p-3 mt-2 bg-white shadow-sm">
          <textarea
            className="form-control mb-2"
            rows="2"
            placeholder="Description"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />

          <input
            className="form-control mb-2"
            placeholder="Task Code"
            value={draft.taskCode}
            onChange={(e) => setDraft({ ...draft, taskCode: e.target.value })}
          />

          <select
            className="form-select mb-2"
            value={draft.priority}
            onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>

          <select
            className="form-select mb-2"
            value={draft.assignedTo}
            onChange={(e) => setDraft({ ...draft, assignedTo: e.target.value })}
          >
            <option value="">Assign to...</option>
            {teamMembers.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="form-control mb-3"
            value={draft.deadline}
            onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
          />

          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={saveEdit}>
              Save
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export const statuses = ['backlog', 'todo', 'inProgress', 'done']
export const priorities = ['low', 'medium', 'high']

export default TaskCard