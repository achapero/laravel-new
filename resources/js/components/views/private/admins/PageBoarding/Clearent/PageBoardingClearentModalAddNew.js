import { AutoComplete, Form, Input, notification } from "antd";
import { useForm } from "antd/lib/form/Form";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";

const PageBoardingClearentModalAddNew = ({
    showModalAddNew,
    setShowModalAddNew
}) => {
    const [form] = useForm();
    const {
        data: dataUsersList,
        isLoading: isLoadingDataUsersList
    } = useAxiosQuery("GET", "api/v1/users", "users_list", res => {
        if (res.success) {
        }
    });

    const {
        mutate: mutateAddNewBoarding,
        isLoading: isLoadingMutateAddNewBoarding
    } = useAxiosQuery(
        "POST",
        "api/v1/applicationReview/addNewFromBlank",
        "boarding_table"
    );

    const handleSubmitAddNewBoarding = values => {
        mutateAddNewBoarding(values, {
            onSuccess: res => {
                console.log(res);
                notification.success({
                    message: "New Boarding Successfully Added"
                });
                setShowModalAddNew(false);
                form.resetFields();
            }
        });
    };
    return (
        <Modal
            title="Select an existing Profile or enter a new unique email address"
            okText="Add"
            cancelText="Cancel"
            visible={showModalAddNew}
            onCancel={e => setShowModalAddNew(false)}
            onOk={e => form.submit()}
            confirmLoading={isLoadingMutateAddNewBoarding}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={values => {
                    // console.log("values", values);
                    handleSubmitAddNewBoarding(values);
                }}
            >
                <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                        { required: true, message: "This field is required" }
                    ]}
                >
                    <AutoComplete
                        style={{ width: "100%" }}
                        onSelect={e => console.log(e)}
                        onSearch={e => console.log(e)}
                        filterOption={(input, option) =>
                            option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {dataUsersList &&
                            dataUsersList.data.map((user, key) => {
                                return (
                                    <AutoComplete.Option
                                        key={key}
                                        value={user.email}
                                    >
                                        {`${user.email} ${
                                            user.user_fields
                                                ? user.user_fields.merchant_name
                                                    ? " -" +
                                                      user.user_fields
                                                          .merchant_name +
                                                      ""
                                                    : ""
                                                : ""
                                        }`}
                                    </AutoComplete.Option>
                                );
                            })}
                    </AutoComplete>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PageBoardingClearentModalAddNew;
