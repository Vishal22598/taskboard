import { useState } from 'react';
import TaskCard    from './TaskCard';
import AddTaskForm from './AddTaskForm';

const ColumnList = ({ column, tasks, boardId, columns,
                      onAddTask, onTaskUpdate, onTaskDelete, onDeleteColumn  }) => {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (taskData) => {
    await onAddTask(taskData);
    setShowForm(false);
  };

  return (
    <div style={styles.column}>
      {/* Column header */}
      <div style={styles.header}>
        <h3 style={styles.title}>
          {column.title}
          <span style={styles.count}>
            {tasks.length}   {/* task count badge */}
          </span>
        </h3>
        <button
          onClick={() => onDeleteColumn(column._id)}
          style={styles.colDeleteBtn}
          title="Delete column"
        >
          x
        </button>
      </div>

      {/* Task cards */}
      <div style={styles.taskList}>
        {tasks.length === 0 ? (
          <p style={styles.emptyText}>No tasks yet</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              columns={columns}            // ← pass all columns
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
            />
          ))
        )}
      </div>


      {/* Add task */}
      {showForm ? (
        <AddTaskForm
          columnId={column._id}
          boardId={boardId}
          onAdd={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button onClick={() => setShowForm(true)} style={styles.addTaskBtn}>
          + Add a task
        </button>
      )}
    </div>
  );
};

const styles = {
  column:       { background:'#ebecf0', borderRadius:'8px', padding:'12px',
                  width:'272px', minWidth:'272px', maxHeight:'calc(100vh - 140px)',
                  overflowY:'auto', flexShrink:0 },
  header:       { display:'flex', justifyContent:'space-between',
                  alignItems:'center', marginBottom:'10px' },
  title:        { fontSize:'14px', fontWeight:'700', color:'#172b4d',
                  display:'flex', alignItems:'center', gap:'8px', margin:0 },
  count:        { background:'#dfe1e6', color:'#626f86', fontSize:'12px',
                  fontWeight:'600', padding:'1px 7px', borderRadius:'10px' },
  colDeleteBtn: { background:'none', border:'none', color:'#97a0af',
                  cursor:'pointer', fontSize:'18px', lineHeight:1 },
  taskList:     { marginBottom:'8px', minHeight:'8px' },
  emptyText:    { fontSize:'12px', color:'#97a0af', textAlign:'center',
                  padding:'12px 0', fontStyle:'italic' },
  addTaskBtn:   { width:'100%', padding:'8px', background:'none', border:'none',
                  textAlign:'left', color:'#5e6c84', cursor:'pointer',
                  fontSize:'14px', borderRadius:'4px' }
};
export default ColumnList;
