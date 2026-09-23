// import { Table } from "antd";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { deleteUserThunk, getUsers } from "../../features/customers/customerSlice";
// import { base_url } from "../../utils/base_url";
// import axios from "axios";
// import { MdDelete } from "react-icons/md";
// import CustomModal from "../../components/CustomModal";
// import { AiFillDelete } from "react-icons/ai";

// const columns = [
 
//   {
//     title: "User Id",
//     dataIndex: "id",
//   },
//   {
//     title: "Name",
//     dataIndex: "name",
//   },
//   {
//     title: "Role",
//     dataIndex: "role",
//   },
//   {
//     title: "Email",
//     dataIndex: "email",
//   },
//   {
//     title:"Action",
//     dataIndex:"action"
//   }
// ];


// const User = () => {

//   const [open, setOpen] = useState(false);
//   const [userId, setUserId] = useState("");
//     const dispatch = useDispatch();
  
//     useEffect(() => {
//       dispatch(getUsers());
//     }, []);
  
//     const adminState = useSelector((state) => state.customer.customers);
//     console.log(adminState,"opo")
//     const data1 = [];
//     for (let i = 0; i < adminState?.data?.length; i++) {
//       data1.push({
//         id: adminState.data[i]._id,
//         name: adminState.data[i].username,
//         email: adminState.data[i].email,
//         role: adminState.data[i].role,
//         action:(
//           <>
//               <button
//             className="ms-3 fs-3 text-danger bg-transparent border-0"
//             onClick={() => showModal(adminState.data[i].id)}
//           >
//             <AiFillDelete />
//           </button>
//           </>
//         )
//       });
//     }

//     const showModal = (e) => {
//       setOpen(true);
//       setUserId(e);
//     };
  
//     const hideModal = () => {
//       setOpen(false);
//     };
  
//     const deleteUser = (e) => {
//       dispatch(deleteUserThunk(e))
//       setOpen(false);
//       setTimeout(() => {
//         dispatch(getUsers());
//       }, 100);
//     };
  
//     return (
//       <>
//         <div>
//           <h3 className="mb-4 title">Admin Details</h3>
//           <div>
//             <Table columns={columns} dataSource={data1} />
//           </div>
//       </div>

//       <CustomModal
//         hideModal={hideModal}
//         open={open}
//         performAction={() => deleteUser(userId)}
//         title="Are you sure you want to delete this data?"
//       />
//       </>
//     );
//   };
// export default User



import React, { useEffect, useMemo, useState } from "react";
import { Table, Select, Input, Space, Tag, Tooltip, Card } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteUserThunk,
  getUsers,
} from "../../features/customers/customerSlice";

import CustomModal from "../../components/CustomModal";

const { Search } = Input;
const { Option } = Select;

const User = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const [roleFilter, setRoleFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const users = useSelector((state) => state.customer.customers?.data || []);
  const loading = useSelector((state) => state.customer.isLoading);

  const showModal = (id) => {
    setUserId(id);
    setOpen(true);
  };

  const hideModal = () => setOpen(false);

  const deleteUser = () => {
    dispatch(deleteUserThunk(userId));
    setOpen(false);

    setTimeout(() => {
      dispatch(getUsers());
    }, 300);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatch =
        roleFilter === "all" || user.role === roleFilter;

      const searchMatch =
        user.username
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        user.email
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

      return roleMatch && searchMatch;
    });
  }, [users, roleFilter, searchText]);

  const columns = [
    {
      title: "#",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => {
        let color = "blue";

        if (role === "superadmin") color = "red";
        if (role === "admin") color = "green";
        if (role === "subadmin") color = "orange";

        return (
          <Tag color={color} style={{ textTransform: "capitalize" }}>
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Delete User">
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => showModal(record._id)}
          >
            <DeleteOutlined />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Card
        className="shadow-sm border-0"
        title={<h4 className="mb-0">Users Management</h4>}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">

          <Search
            placeholder="Search by name or email..."
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Space>
            <span>Filter by Role:</span>

            <Select
              style={{ width: 180 }}
              value={roleFilter}
              onChange={setRoleFilter}
            >
              <Option value="all">All Roles</Option>
              <Option value="superadmin">Super Admin</Option>
              <Option value="admin">Admin</Option>
              <Option value="subadmin">Sub Admin</Option>
            </Select>
          </Space>
        </div>

        <Table
          rowKey="_id"
          bordered
          loading={loading}
          columns={columns}
          dataSource={filteredUsers}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>

      <CustomModal
        open={open}
        hideModal={hideModal}
        performAction={deleteUser}
        title="Are you sure you want to delete this user?"
      />
    </>
  );
};

export default User;