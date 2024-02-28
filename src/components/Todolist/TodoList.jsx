import React, { useEffect, useState } from "react";
import "./todolist.scss";
import { useSelector, useDispatch } from "react-redux";
import { taskActions } from "../../store/slices/task.slice";
import axios from "axios";

const TodoList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((store) => store.tasks);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [TaskToDelete, setJobToDelete] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedTaskName, setSelectedTaskName] = useState("");

  const tasksData = tasks.tasks.filter((task) => {
    if (activeTab === "completed") {
      return task.status === "completed";
    } else if (activeTab === "incomplete") {
      return task.status !== "completed";
    }
    return true;
  });
  console.log("tasksData", tasksData);

  const [newTask, setNewTask] = useState("");

  const updateTask = async (id) => {
    const taskId = id;
    const newName = prompt("Nhập tên công việc");
    if (!newName) {
      console.log("Tên công việc không được để trống");
      return;
    }
    try {
      await axios.patch(`http://localhost:3000/tasks/${taskId}`, {
        name: newName,
      });
      dispatch(taskActions.getTasks());
    } catch (error) {
      console.error("Error", error);
    }
  };
  const handleDeleteConfirmed = async (id) => {
    const taskId = id;
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      dispatch(taskActions.deleteTask(taskId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error", error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (newTask.trim() === "") {
      setShowAlertModal(true);
      return;
    }
    try {
      axios
        .post("http://localhost:3000/tasks", {
          name: newTask,
          status: "incomplete",
        })
        .then((response) => {
          dispatch(taskActions.addTask(response.data));
          setNewTask("");
        });
    } catch (error) {
      console.error("Error", error);
    }
  };
  const deleteTask = (id, name) => {
    setShowDeleteModal(true);
    setJobToDelete(id);
    setSelectedTaskName(name);
  };
  useEffect(() => {
    dispatch(taskActions.getTasks());
  }, [dispatch]);

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/7.1.0/mdb.min.css"
        rel="stylesheet"
      />
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card">
                <div className="card-body p-5">
                  <form
                    className="d-flex justify-content-center align-items-center mb-4"
                    onSubmit={handleSubmit}
                  >
                    <div className="form-outline flex-fill">
                      <input
                        type="text"
                        id="form2"
                        className="form-control"
                        value={newTask}
                        onChange={(event) => setNewTask(event.target.value)}
                      />
                      <label className="form-label" htmlFor="form2">
                        Nhập tên công việc
                      </label>
                    </div>
                    <button type="submit" className="btn btn-info ms-2">
                      Thêm
                    </button>
                  </form>
                  <ul className="nav nav-tabs mb-4 pb-2">
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "all" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("all")}
                      >
                        Tất cả
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "completed" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("completed")}
                      >
                        Đã hoàn thành
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "incomplete" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("incomplete")}
                      >
                        Chưa hoàn thành
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content" id="ex1-content">
                    <div className="tab-pane fade show active">
                      <ul className="list-group mb-0">
                        {tasksData.map((task) => (
                          <li
                            key={task.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="form1"
                                checked={task.status === "completed"}
                                onChange={() =>
                                  dispatch(
                                    taskActions.updateTaskStatus(task.id)
                                  )
                                }
                              />
                              <label
                                className={`form-check-label ${
                                  task.status === "completed" ? "completed" : ""
                                }`}
                                htmlFor="form1"
                              >
                                {task.name}
                              </label>
                            </div>
                            <div className="button-hero">
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => deleteTask(task.id, task.name)}
                              >
                                Xóa
                              </button>
                              <button
                                type="button"
                                className="btn btn-warning"
                                onClick={() => updateTask(task.id)}
                              >
                                Sửa
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="overlay" hidden={!showDeleteModal}>
        <div className="modal-custom">
          <div className="modal-header-custom">
            <h5>Xác nhận</h5>
            <i className="fas fa-xmark"></i>
          </div>
          <div className="modal-body-custom">
            <p>Bạn chắc chắn muốn xóa công việc {selectedTaskName}?</p>
          </div>
          <div className="modal-footer-footer">
            <button
              className="btn btn-light"
              onClick={() => setShowDeleteModal(false)}
            >
              Hủy
            </button>

            <button
              className="btn btn-danger"
              onClick={() => handleDeleteConfirmed(TaskToDelete)}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
      <div className="overlay" hidden={!showAlertModal}>
        <div className="modal-custom">
          <div className="modal-header-custom">
            <h5>Cảnh báo</h5>
            <i className="fas fa-xmark"></i>
          </div>
          <div className="modal-body-custom">
            <p>Tên công việc không được phép để trống.</p>
          </div>
          <div className="modal-footer-footer">
            <button
              className="btn btn-light"
              onClick={() => setShowAlertModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoList;
