import React, {useEffect, useState} from "react";
import {
    Comment,
    Avatar,
    Form,
    Button,
    List,
    Input,
    notification,
    Card,
    Image,
    Popconfirm
} from 'antd';
import {
    SaveOutlined,
} from "@ant-design/icons";
import moment from 'moment';

import useAxiosQuery from "../../../../providers/useAxiosQuery";
import getUserData from "../../../../providers/getUserData";

const PageTicketNotes = ({ticket_id}) => {
    const userdata = getUserData();
    const [form] = Form.useForm()
    const { TextArea } = Input
    // let avatarImage = localStorage.profile_image ? localStorage.profile_image : 'https://joeschmoe.io/api/v1/1'

    const handleSubmit = (data) => {
        if (data) {
            mutateAddNotes({
                ticket_id: ticket_id,
                submitted_by: userdata.id,
                notes: data.comment_notes,
            }, {
                onSuccess: res => {
                    if (res) {
                        console.log('res', res)
                        form.resetFields()
                    }
                }
            })
        }
    }

    const {
        mutate: mutateAddNotes,
        isLoading: isLoadingAddNotes
    } = useAxiosQuery('POST', 'api/v1/ticket_notes', 'ticket_notes')

    const {
        data: dataTicketNotes,
        isLoading: isLoadingTicketNotes,
        isFetching : isFetchingTicketNotes
    } = useAxiosQuery(
        'GET',
        `api/v1/ticket_notes?ticket_id=${ticket_id}`,
        'ticket_notes',
        res => {
            if (res) {
                console.log('dataTicketNotes', res)
                console.log('DEFAULT_IMAGE', process.env.DEFAULT_IMAGE)
            }
        }
    )

    let avatarImage = localStorage.profile_image ? localStorage.profile_image.split("/") : "";

    return (
        <Card
            title="Ticket Notes"
        >
            {dataTicketNotes && dataTicketNotes.data.map((row, index) => {
                let image_type = row.submitted_by.upload  ? row.submitted_by.upload.split("/") : process.env.DEFAULT_IMAGE;
                return <Comment
                    author={<a>{row.submitted_by.name}</a>}
                    key={index}
                    avatar={
                        <Image
                            src={
                                row.submitted_by.upload ?
                                    image_type[0] == "https:" ?
                                        row.submitted_by.upload
                                    :
                                        window.location.origin +"/storage/"+ row.submitted_by.upload
                                :
                                window.location.origin +"/images/default.png"
                            }
                            alt={row.submitted_by.name}
                            preview={false}
                        />
                    }
                    content={
                        <p>
                            {row.notes}
                        </p>
                    }
                />
            }
            )}
            <Comment
                avatar={
                    <Image
                        src={
                            avatarImage[0] == "https:"
                                ? localStorage.profile_image
                                : userdata.upload ?
                                    window.location.origin +"/storage/"+ localStorage.profile_image
                                    :
                                    window.location.origin +"/images/default.png"
                        }
                        alt={userdata.name}
                        preview={false}
                    />
                }
                content={
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="comment_notes"
                            rules={[{ required: true, message: 'Please input your note!' }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                htmlType="submit"
                                loading={isLoadingAddNotes}
                                type="primary"
                                icon={<SaveOutlined />}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                }
            />
        </Card>
    );
}

export default PageTicketNotes;
