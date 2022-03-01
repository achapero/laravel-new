import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Table,
    Input,
    Divider,
    Popconfirm,
    notification,
    Modal
} from "antd";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import { arrayColumn } from "../../../../../../providers/arrayColumn";
import { number_format } from "../../../../../../providers/number_format";
import moment from "moment";
import { CSVLink } from "react-csv";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    ReloadOutlined
} from "@ant-design/icons";

import CustomTableTitle from "../../../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

const PagePaysafeDepositDetailModal = ({
    showModalDepositDetails,
    merchant_number,
    setShowModalDepostDetails,
    toggleModalBatchDetails
}) => {
    const [List, setList] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [batchDetailSummary, setBatchDetailSummary] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: "100",
        column: localStorage.account_deposit_detail_modal_table_sort_column,
        order: localStorage.account_deposit_detail_modal_table_sort_order
    });
    const {
        mutate: mutateDepositDetailModal,
        isLoading: isLoadingDepositDetailModal
    } = useAxiosQuery(
        "POST",
        "api/v1/paysafe/deposit/detailModal",
        "deposit_detail_modal_merchant_list"
    );

    useEffect(() => {
        if (showModalDepositDetails) {
            console.log("@dataTableInfo", dataTableInfo);
            localStorage.account_deposit_detail_modal_table_sort_column =
                dataTableInfo.column;
            localStorage.account_deposit_detail_modal_table_sort_order =
                dataTableInfo.order;
            getDepositDetailList();
        }
        return () => {};
    }, [dataTableInfo, showModalDepositDetails]);

    const getDepositDetailList = () => {
        mutateDepositDetailModal(
            { ...dataTableInfo, merchant_number: merchant_number },
            {
                onSuccess: res => {
                    setList(res);
                    console.log(res);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDataTableInfo({
                ...dataTableInfo,
                filter_value: searchText,
                page_number: 1
            });
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchText]);

    const {
        mutate: mutateGetDepositDetailList,
        isLoading: isLoadingGetDepositDetailList
    } = useAxiosQuery(
        "POST",
        "api/v1/paysafe/deposit/bulkinsert",
        "paysafe_get_batch_detail_list"
    );

    const handleGetDepositDetailList = e => {
        let data = {
            merchant_number
        };
        mutateGetDepositDetailList(data, {
            onSuccess: res => {
                notification.success({
                    message: "Deposits Data Updated"
                });
                getDepositDetailList();
            },
            onError: err => {
                console.log(err);
            }
        });
    };
    const checkIfDefault = column => {
        if (localStorage.account_deposit_detail_modal_table_sort_column) {
            if (
                localStorage.account_deposit_detail_modal_table_sort_column ==
                column
            ) {
                return (
                    localStorage.account_deposit_detail_modal_table_sort_order +
                    "end"
                );
            }
        }

        return null;
    };

    return (
        <>
            <Modal
                visible={showModalDepositDetails}
                onCancel={() => {
                    setShowModalDepostDetails(false);
                }}
                width={850}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowModalDepostDetails(false);
                        }}
                    >
                        Cancel
                    </Button>
                ]}
                title="Deposits"
            >
                <Row>
                    <Col md={24}>
                        <Row>
                            <Col md={8} xs={0}>
                                {" "}
                                <Button
                                    type="primary"
                                    title="Upload"
                                    icon={<ReloadOutlined />}
                                    loading={isLoadingGetDepositDetailList}
                                    onClick={e => handleGetDepositDetailList()}
                                >
                                    Refresh Deposit List
                                </Button>
                            </Col>
                            <Col md={8} sm={0}></Col>
                            <Col md={8} sm={24}>
                                <div style={{ display: "flex" }}>
                                    {" "}
                                    <Input.Search
                                        placeholder="Global Search"
                                        onSearch={e =>
                                            setDataTableInfo({
                                                ...dataTableInfo,
                                                filter_value: e,
                                                page_number: 1
                                            })
                                        }
                                        onChange={e =>
                                            setSearchText(e.target.value)
                                        }
                                    />
                                    {/* <CSVLink
                                        data={
                                            csvData.length > 0
                                                ? csvData
                                                : List.length != 0
                                                ? List.data.data
                                                : []
                                        }
                                        filename="Boarding Applicants"
                                    >
                                        <Button
                                            icon={<FileExcelOutlined />}
                                        ></Button>
                                    </CSVLink> */}
                                </div>
                            </Col>
                        </Row>
                        <Divider />

                        <div className="table-responsive">
                            <ResizableAntdTable
                                scroll={{ x: "max-content" }}
                                loading={isLoadingDepositDetailModal}
                                rowKey={record => record.id}
                                dataSource={
                                    List.length != 0 ? List.data.data : []
                                }
                                pagination={{
                                    pageSize: dataTableInfo.page_size,
                                    current:
                                        List.length != 0
                                            ? List.data.current_page
                                            : 1,
                                    showSizeChanger: true,
                                    total:
                                        List.length != 0 ? List.data.total : 1,

                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} of ${total} items`,

                                    pageSizeOptions: [100, 200]
                                }}
                                onChange={(
                                    pagination,
                                    filters,
                                    sorter,
                                    extra
                                ) => {
                                    setDataTableInfo({
                                        ...dataTableInfo,
                                        page_number: pagination.current,
                                        page_size: pagination.pageSize
                                        // column: sorter.columnKey,
                                        // order: sorter.order
                                        //     ? sorter.order.replace("end", "")
                                        //     : null
                                    });

                                    // localStorage.account_deposit_detail_modal_table_sort_column =
                                    //     sorter.columnKey;
                                    // localStorage.account_deposit_detail_modal_table_sort_order = sorter.order
                                    //     ? sorter.order.replace("end", "")
                                    //     : null;

                                    setCsvData(extra.currentDataSource);
                                }}
                            >
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="merchant_number"
                                    key="merchant_number"
                                    title="Merchant Number"
                                    title={
                                        <CustomTableTitle
                                            title="Merchant Number"
                                            dataIndex="merchant_number"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="ach_date"
                                    key="ach_date"
                                    title="Ach Date"
                                    title={
                                        <CustomTableTitle
                                            title="Ach Date"
                                            dataIndex="ach_date"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                    render={(text, record) => {
                                        return moment(record.ach_date).format(
                                            "L"
                                        );
                                    }}
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="transmission_date"
                                    key="transmission_date"
                                    title={
                                        <CustomTableTitle
                                            title="Transmission Date"
                                            dataIndex="transmission_date"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                    render={(text, record) => {
                                        return moment(
                                            record.transmission_date
                                        ).format("L");
                                    }}
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="trace_number"
                                    key="trace_number"
                                    title={
                                        <CustomTableTitle
                                            title="Trace Number"
                                            dataIndex="trace_number"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="dda_number"
                                    key="dda_number"
                                    title={
                                        <CustomTableTitle
                                            title="DDA Amount"
                                            dataIndex="dda_number"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                />

                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="tr_number"
                                    key="tr_number"
                                    title={
                                        <CustomTableTitle
                                            title="TR Amount"
                                            dataIndex="tr_number"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="amount"
                                    key="amount"
                                    title={
                                        <CustomTableTitle
                                            title="Amount"
                                            dataIndex="amount"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                    render={(text, record) => {
                                        return (
                                            <>
                                                $
                                                {number_format(
                                                    record.amount,
                                                    2
                                                )}
                                            </>
                                        );
                                    }}
                                />
                            </ResizableAntdTable>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default PagePaysafeDepositDetailModal;
