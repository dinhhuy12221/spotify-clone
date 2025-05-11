import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:8000/api/admin/users", {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    });
    const data = await res.json();
    setUsers(data);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    });
    fetchUsers();
  };

  const handleCreate = async () => {
    await fetch("http://localhost:8000/api/admin/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify(form),
    });
    setForm({ username: '', email: '', password: '' });
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Tạo người dùng mới</h2>
        <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="bg-gray-800 p-2 mr-2" />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-gray-800 p-2 mr-2" />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="bg-gray-800 p-2 mr-2" />
        <button onClick={handleCreate} className="bg-green-600 px-4 py-2 rounded">Tạo</button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Danh sách người dùng</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="bg-gray-800 p-4 rounded mb-3 flex justify-between items-center">
              <div>
                <p><strong>{user.username}</strong></p>
                <p>{user.email}</p>
              </div>
              <button onClick={() => handleDelete(user.id)} className="bg-red-600 px-4 py-1 rounded">Xoá</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
