import { useEffect, useState } from "react";

function App() {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    department: "",
    salary: "",
  });

  const loadEmployees = () => {
    fetch("http://127.0.0.1:5000/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      department: "",
      salary: "",
    });
    setEditingId(null);
  };

  // Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      department: form.department,
      salary: Number(form.salary),
    };

    if (editingId) {
      await fetch(`http://127.0.0.1:5000/employees/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("http://127.0.0.1:5000/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    loadEmployees();
  };

  // Fill form for editing
  const editEmployee = (emp) => {
    setEditingId(emp.id);
    setForm({
      name: emp.name,
      department: emp.department,
      salary: emp.salary,
    });
  };

  // Delete
  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    await fetch(`http://127.0.0.1:5000/employees/${id}`, {
      method: "DELETE",
    });

    loadEmployees();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 InsightOps Dashboard</h1>

      <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">
          {editingId ? "Update Employee" : "Add Employee"}
        </button>

        {editingId && (
          <>
            {" "}
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </>
        )}
      </form>

      <hr />

      <h2>Employee List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.department}</td>
              <td>{emp.salary}</td>
              <td>
                <button onClick={() => editEmployee(emp)}>Edit</button>{" "}
                <button onClick={() => deleteEmployee(emp.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;