import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBoardById } from "../api/boardApi";
import { createTask, deleteTask } from "../api/taskApi";
import { createColumn, deleteColumn } from "../api/columnApi";
import Navbar from "../components/Navbar";
import ColumnList from "../components/ColumnList";
import toast from "react-hot-toast";
import useSocket from "../hooks/useSocket";

const BoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newColTitle, setNewColTitle] = useState("");
  const [showColForm, setShowColForm] = useState(false);
  const socket = useSocket(id);

  useEffect(() => {
    if (!socket) return;

    socket.on("taskAdded", (task) =>
      setTasks((prev) =>
        prev.find((t) => t._id === task._id) ? prev : [...prev, task],
      ),
    );

    socket.on("taskUpdated", (task) =>
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t))),
    );

    socket.on("taskDeleted", ({ taskId }) =>
      setTasks((prev) => prev.filter((t) => t._id !== taskId)),
    );

    socket.on("columnAdded", (col) =>
      setColumns((prev) =>
        prev.find((c) => c._id === col._id) ? prev : [...prev, col],
      ),
    );

    socket.on("columnDeleted", ({ columnId }) => {
      setColumns((prev) => prev.filter((c) => c._id !== columnId));
      setTasks((prev) => prev.filter((t) => t.columnId !== columnId));
    });

    return () => {
      [
        "taskAdded",
        "taskUpdated",
        "taskDeleted",
        "columnAdded",
        "columnDeleted",
      ].forEach((e) => socket.off(e));
    };
  }, [socket]);

  // Wrap fetchBoard in useCallback so it has a stable reference
const fetchBoard = useCallback(async () => {
  try {
    const { data } = await getBoardById(id);
    setBoard(data.board);
    setColumns(data.columns);
    setTasks(data.tasks);
  } catch {
    toast.error('Board not found');
    navigate('/dashboard');
  } finally {
    setLoading(false);
  }
}, [id, navigate]);

  // Now include fetchBoard in the dependency array safely
  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // Add task to a column
  const handleAddTask = async (taskData) => {
    try {
      const { data } = await createTask(taskData);
      setTasks((prev) => [...prev, data]);
      toast.success("Task added!");
    } catch {
      toast.error("Failed to add task");
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch {
      toast.error("Failed to delete task");
    }
  };

  // Add a new column
  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;
    try {
      const { data } = await createColumn({
        title: newColTitle.trim(),
        boardId: id,
      });
      setColumns((prev) => [...prev, data]);
      setNewColTitle("");
      setShowColForm(false);
      toast.success("Column added!");
    } catch {
      toast.error("Failed to add column");
    }
  };

  // Delete a column and all its tasks
  const handleDeleteColumn = async (columnId) => {
    if (!window.confirm("Delete this column and all its tasks?")) return;
    try {
      await deleteColumn(columnId);
      setColumns((prev) => prev.filter((c) => c._id !== columnId));
      setTasks((prev) => prev.filter((t) => t.columnId !== columnId));
    } catch {
      toast.error("Failed to delete column");
    }
  };

  // Tasks filtered to a specific column
  const tasksForColumn = (colId) => tasks.filter((t) => t.columnId === colId);

  if (loading) return <div style={{ padding: 40 }}>Loading board...</div>;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: board?.background || "#0052CC",
      }}
    >
      <Navbar />

      {/* Board header */}
      <div style={styles.boardHeader}>
        <h1 style={styles.boardTitle}>{board?.title}</h1>
        <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
          Back to Boards
        </button>
      </div>

      {/* Horizontal columns scroll area */}
      <div style={styles.columnsArea}>
        {columns.map((col) => (
          <ColumnList
            key={col._id}
            column={col}
            tasks={tasksForColumn(col._id)}
            boardId={id}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onDeleteColumn={handleDeleteColumn}
          />
        ))}

        {/* Add column form */}
        <div style={styles.addColBox}>
          {showColForm ? (
            <form onSubmit={handleAddColumn}>
              <input
                style={styles.colInput}
                type="text"
                autoFocus
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                placeholder="Column name..."
              />
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="submit" style={styles.colAddBtn}>
                  Add Column
                </button>
                <button
                  type="button"
                  style={styles.colCancelBtn}
                  onClick={() => {
                    setShowColForm(false);
                    setNewColTitle("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowColForm(true)}
              style={styles.addColBtn}
            >
              + Add another list
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  boardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
  },
  boardTitle: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "700",
    textShadow: "0 1px 3px rgba(0,0,0,0.3)",
  },
  backBtn: {
    padding: "6px 14px",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  columnsArea: {
    display: "flex",
    gap: "12px",
    padding: "0 16px 16px",
    overflowX: "auto",
    flex: 1,
    alignItems: "flex-start",
  },
  addColBox: {
    background: "rgba(255,255,255,0.2)",
    borderRadius: "8px",
    padding: "12px",
    minWidth: "272px",
    flexShrink: 0,
  },
  addColBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    width: "100%",
    textAlign: "left",
  },
  colInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  colAddBtn: {
    padding: "6px 14px",
    background: "#0052CC",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  colCancelBtn: {
    padding: "6px 10px",
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },
};
export default BoardPage;
