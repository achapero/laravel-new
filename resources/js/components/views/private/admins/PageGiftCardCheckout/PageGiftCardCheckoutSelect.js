import {
    Layout, Card, Button, Row, Col, Input, Table, Popconfirm, Divider, notification, Image, Tooltip,
    Drawer, Space, Tabs, Menu, AutoComplete, Select
} from "antd";
import {
    DeleteFilled, EditFilled, PlusCircleOutlined, FileExcelOutlined, SettingOutlined, EyeOutlined, UsergroupDeleteOutlined,
    UserAddOutlined, ArrowLeftOutlined, MailOutlined, AppstoreOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment} from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import moment, { isMoment } from "moment";
import { values } from "lodash";


const PageGiftCardCheckoutSelect = () => {
    let history = useHistory();
    const { Option } = Select;

    const { data: dataMerchant, isLoading: isLoadingMerchant, refetch: refetchMerchant } = useAxiosQuery(
        `GET`,
        `api/v1/auth_net_merchants`,
        `get_merchant_serch`,
        res => {

        }
    )

    const handlerSearch = value => {
        if(value){
            history.push("/giftcard-checkout/" + value);
        }
    }

    return (
        <Content
            className="site-layout-background"
            style={{
                margin: "24px 16px",
                minHeight: 'auto',
                background: "transparent"
            }}
        >
            <Row gutter={24}>
                <Col span={12} offset={6}>
                    <Card
                        style={{
                            marginTop: "100px",
                            paddingTop: "50px",
                            paddingBottom: "50px",
                            paddingRight: "10px",
                            paddingLeft: "10px",
                            textAlign: "center",
                            height: "230px"
                        }}
                    >
                        <h3 style={{ margin: "auto", fontSize: '1.53125rem' }} >
                            Search Merchant <i className="fa fa-search"></i>
                        </h3><br/>
                        <Select
                            showSearch
                            allowClear
                            size="large"
                            style={{ textAlign: "left", width: '100%' }}
                            placeholder="Search Merchant"
                            onChange={e => handlerSearch(e)}
                        >
                            <Option value=""><b>Select Merchant</b></Option>
                            {dataMerchant &&
                                dataMerchant.data.map((data, item) => {
                                    return <Option value={data.merchant_email}>{data.merchant_name}</Option>
                                })
                            }
                        </Select>
                    </Card>
                </Col>
            </Row>
        </Content>
    )
}

export default PageGiftCardCheckoutSelect;
