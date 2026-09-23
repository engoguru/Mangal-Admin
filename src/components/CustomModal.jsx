import {Modal} from "antd";

const CustomModal = ({open, hideModal, performAction, title}) => {
  return (
    <>
      <Modal
        title="Confirmation"
        open={open}
        onOk={performAction}
        onCancel={hideModal}
        okType="Ok"
        cancelText="Cancel"
      >
        <p>{title}</p>
      </Modal>
    </>
  )
}

export default CustomModal
