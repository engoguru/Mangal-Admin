import { Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import CustomModal from "../../components/CustomModal";
import { Link } from "react-router-dom";
import { deleteLiveThunk, getAllLiveThunk, resetState } from "../../features/liveLink/livelinkSlice";

const columns = [
    {
      title: "S.No.",
      dataIndex: "key",
    },
    {
      title: "Link",
      dataIndex: "link",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
];

const Links = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [appId, setappId] = useState("");

  const showModal = (e) => {
    setOpen(true);
    setappId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getAllLiveThunk());
  }, []);

  const addState = useSelector((state) => state?.liveLink?.liveLink?.data);

  const data1 = [];
  for (let i = 0; i < addState?.length; i++) {
    data1.push({
      key: i + 1,

      link: (
        <>
          <div>
            <Link target="_blank" to={addState[i]?.link}>{ addState[i]?.link }</Link>
          </div>
        </>
      ),
      action: (
        <>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(addState[i]?._id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }

  const deleteData = (e) => {
    dispatch(deleteLiveThunk(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getAllLiveThunk());
    }, 100);
  };


  return (
    <>
    <div>
      <h3 className="mb-4 title">Live Link</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
         hideModal={hideModal}
         open={open}
          performAction={() => {
            deleteData(appId);
          }}
          title="Are you sure you want to delete this Data?"
      />
    </div>
  </>
  )
}

export default Links;


