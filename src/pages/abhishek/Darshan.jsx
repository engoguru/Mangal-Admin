import { Table, Form, Input, Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import CustomModal from "../../components/CustomModal";
import { Link } from "react-router-dom";
import { deleteDarshanThunk, getAllDarshanThunk, searchDarshanThunk } from "../../features/darshan/darshanSlice";
import { formatDate } from "../../utils";

const columns = [
    {
      title: "S.No.",
      dataIndex: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Adhar Card No.",
      dataIndex: "adhar",
    },
    {
      title: "Visiting Date",
      dataIndex: "visDate",
    },
    {
      title: "Wish",
      dataIndex: "message",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];
  

const Darshan = () => {
  const [open, setOpen] = useState(false);
  const [drId, setDrId] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDarshanThunk());
  }, [dispatch]);

  const drState = useSelector((state) => state?.darshan?.darshan);

  const data = [];
  for (let i = 0; i < drState?.length; i++) {
    data?.push({
      key: i,
      name: drState[i].name,
      email:  (
        <>
            <div>
              <Link to={`mailto: ${drState[i].email}`}>{drState[i].email}</Link>
            </div>
        </>
      ),
      phone: (
        <>
            <div>
              <Link to={`tel: +91${drState[i].mobile_no}`}>{drState[i].mobile_no}</Link>
            </div>
        </>
      ),
      adhar: drState[i].adhar_no,
     
      visDate:(
        <div>
          <p>{formatDate(new Date(drState[i]?.date))}</p>
        </div>
      ),
      message: drState[i].message,
      date: (
        <div>
          <p>{formatDate(drState[i].created_at)}</p>
        </div>
      ),
      action: (
        <>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(drState[i].id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }

  const showModal = (e) => {
    setOpen(true);
    setDrId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deleteBhomayag = (e) => {
    dispatch(deleteDarshanThunk(e))
    setOpen(false);
    setTimeout(() => {
      dispatch(getAllDarshanThunk());
    }, 100);
  };

  const onFinish = (values) => {
    dispatch(searchDarshanThunk(values));
  };

  return (
    <>
      <div>
        <h3 className="mb-4 title">Sugam Darshan Booking</h3>
        <Form layout="inline" onFinish={onFinish} className="mb-4">
          <Form.Item name="name" label="Name">
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="adhar_no" label="Adhar No">
            <Input placeholder="Adhar No" />
          </Form.Item>
          <Form.Item name="mobile_no" label="Mobile No">
            <Input placeholder="Mobile No" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
        <Table columns={columns} dataSource={data} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteBhomayag(drId)}
        title="Are you sure you want to delete this Data?"
      />
    </>
  )
}

export default Darshan
