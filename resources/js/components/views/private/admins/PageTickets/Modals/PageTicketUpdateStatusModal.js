import React from "react";
import { Input, Modal, Alert, Select, Button } from "antd";

const PageTicketUpdateStatus = ({
    showSubmitModal,
    setShowSubmitModal,
    handleToggleSubmitModal,
    updateField,
    ticketData,
    submitButtonTextUpdate,
    Updatesubmit,
    success,
    status,
    isLoadingMutateUpdatesubmit
}) => {
    return (
        <Modal
            visible={showSubmitModal}
            style={{ width: "300px" }}
            title="Update Status"
            onCancel={() => {
                setShowSubmitModal(false);
            }}
            footer={[
                <Button
                    key="submit"
                    onClick={() => {
                        Updatesubmit();
                    }}
                    type="primary"
                    loading={isLoadingMutateUpdatesubmit}
                >
                    Submit
                </Button>,
                <Button
                    key="back"
                    onClick={() => {
                        setShowSubmitModal(false);
                    }}
                >
                    Cancel
                </Button>
            ]}
        >
            <div className="pre-line">
                <Select
                    onChange={e => updateField(e)}
                    style={{ width: "100%" }}
                    defaultValue={status}
                >
                    <Select.Option key="Awaiting Customer Reply" value="Awaiting Customer Reply">Awaiting Customer Reply</Select.Option>
                    <Select.Option key="Awaiting Support Reply" value="Awaiting Support Reply">Awaiting Support Reply</Select.Option>
                    <Select.Option key="On Hold" value="On Hold">On Hold</Select.Option>
                    <Select.Option key="Closed" value="Closed">Closed</Select.Option>
                    <Select.Option key="Archived" value="Archived">Archive</Select.Option>
                </Select>
            </div>
        </Modal>
    );
};

export default PageTicketUpdateStatus;
