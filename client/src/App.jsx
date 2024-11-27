import { useState, useEffect } from 'react';
import './App.css';
import axios from "axios";


function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  
    const [isActive, setIsActive] = useState(false);
  
    const handleToggle = () => {
      setIsActive(!isActive);
    }

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setFilterUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) => user.name.
      toLowerCase().includes(searchText) || user.city.
        toLowerCase().includes(searchText));
    setFilterUsers(filteredUsers);
  }

  //delete user function

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilterUsers(res.data);
      })
    }
  }

  //closeModal

  const closeModal = () => {
    setIsModalOpen(false);
    getAllUsers();
  }

  //Add User Details

  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModalOpen(true);
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (!userData.name || !userData.age || !userData.city) {
      alert("Please fill out all required fields before submitting.");
      return;
    }

    try {
      if (userData.id) {
        await axios.patch(`http://localhost:8000/users/${userData.id}`,
          userData).then((res) => {
            console.log(res);
          });
      } else {
        await axios.post("http://localhost:8000/users",
          userData).then((res) => {
            console.log(res);
          })
      }
    } catch (error) {
      console.error("An error occurred while submitting the data:", error);
    }

    closeModal();
    setUserData({ name: "", age: "", city: "" });
  };

  //Update User function
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  }

  return (
    <>
      <div className='container'>
        <h3>CRUD Application with ReactJS Frontend and NodeJS Backend</h3>
        <div className='input-search' >
          <input type="search" placeholder="Search Text Here" onChange={handleSearchChange} />
          <button className='btn green' onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.map((user, index) => {
              return (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>

                  <td>
                    <button className='btn green' onClick={() => handleUpdateRecord(user)}>Edit</button>
                  </td>
                  <td>
                    <button className='btn red' onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                  <td><button
                    onClick={handleToggle}
                    style={{
                      padding: "7.5px",
                      fontSize: "14px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      backgroundColor: isActive ? "#4caf50" : "#f44336",
                      color: "#fff",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {isModalOpen && (
          <div className='modal'>
            <div className='modal-content'>
              <span className='close' onClick={closeModal}>
                &times;
              </span>
              <h2>{userData.id ? "Update Record" : "Add Record"}</h2>
              <div className="input-group">
                <label htmlFor="">Full Name</label>
                <input type="text" value={userData.name} name="name" id='name' onChange={handleData} required />
              </div>
              <div className="input-group">
                <label htmlFor="">Age</label>
                <input type="number" value={userData.age} name="age" id='age' onChange={handleData} required />
              </div>
              <div className="input-group">
                <label htmlFor="">City</label>
                <input type="text" value={userData.city} name="city" id='city' onChange={handleData} required />
              </div>
              <button className='btn green' onClick={handleSubmit}>
                {userData.id ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App