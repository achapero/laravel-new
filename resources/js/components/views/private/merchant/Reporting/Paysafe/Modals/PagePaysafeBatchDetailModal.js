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

const PagePaysafeBatchDetailModal = ({
    batch_number,
    merchant_number,
    showModalBatchDetails,
    toggleModalBatchDetails,
    setShowModalBatchDetails
}) => {
    const [List, setList] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [batchDetailSummary, setBatchDetailSummary] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: "100",
        column: localStorage.account_batch_detail_modal_table_sort_column,
        order: localStorage.account_batch_detail_modal_table_sort_order
    });
    const {
        mutate: mutateBatchDetailModal,
        isLoading: isLoadingBatchDetailModal
    } = useAxiosQuery(
        "POST",
        "api/v1/paysafe/batch/detail/filtered",
        "batch_detail_modal_merchant_list"
    );

    useEffect(() => {
        if (showModalBatchDetails) {
            console.log("@dataTableInfo", dataTableInfo);
            localStorage.account_batch_detail_modal_table_sort_column =
                dataTableInfo.column;
            localStorage.account_batch_detail_modal_table_sort_order =
                dataTableInfo.order;
            getBatchDetailList();
        }
        return () => {};
    }, [dataTableInfo, showModalBatchDetails]);

    const getBatchDetailList = () => {
        mutateBatchDetailModal(
            { ...dataTableInfo, batch_number: batch_number },
            {
                onSuccess: res => {
                    setList(res);
                    setBatchDetailSummary(res.summary);
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
        mutate: mutateGetBatchDetailList,
        isLoading: isLoadingGetBatchDetailList
    } = useAxiosQuery(
        "POST",
        "api/v1/paysafe/batch/detail/bulkinsert",
        "paysafe_get_batch_detail_list"
    );

    const handleGetBatchDetailList = e => {
        let data = {
            batch_number,
            merchant_number
        };
        mutateGetBatchDetailList(data, {
            onSuccess: res => {
                notification.success({
                    message: "Batches Data Updated"
                });
                getBatchDetailList();
            },
            onError: err => {
                console.log(err);
            }
        });
    };

    const getCardTypeTotal = card_type => {
        if (card_type == "Report Total") {
            let total = arrayColumn(batchDetailSummary, "total_amount");

            var sum = total.reduce(function(a, b) {
                return a + b;
            }, 0);

            return "$" + number_format(sum, 2);
        } else {
            let index = arrayColumn(batchDetailSummary, "card_type").indexOf(
                card_type
            );
            if (index !== -1) {
                return (
                    "$" +
                    number_format(batchDetailSummary[index]["total_amount"], 2)
                );
            }
        }
    };

    const checkIfDefault = column => {
        if (localStorage.account_batch_detail_modal_table_sort_column) {
            if (
                localStorage.account_batch_detail_modal_table_sort_column ==
                column
            ) {
                return (
                    localStorage.account_batch_detail_modal_table_sort_order +
                    "end"
                );
            }
        }

        return null;
    };

    return (
        <>
            <Modal
                visible={showModalBatchDetails}
                onCancel={() => {
                    setShowModalBatchDetails(false);
                }}
                width={850}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowModalBatchDetails(false);
                        }}
                    >
                        Cancel
                    </Button>
                ]}
                title="Batch Detail"
            >
                <Row>
                    <Col md={24}>
                        <table
                            className="tblBatchSummary"
                            style={{
                                width: "40%",
                                margin: "auto",
                                fontSize: "18px",
                                marginBottom: "50px"
                            }}
                        >
                            <tbody>
                                <tr style={{ borderBottom: "1px solid #ddd" }}>
                                    <td>Visa</td>
                                    <td>{getCardTypeTotal("Visa")}</td>
                                </tr>
                                <tr
                                    style={{
                                        borderBottom: "1px solid #ddd"
                                    }}
                                >
                                    <td>MasterCard</td>
                                    <td>{getCardTypeTotal("MasterCard")}</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid #ddd" }}>
                                    <td>Amex</td>
                                    <td>{getCardTypeTotal("Amex")}</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid #ddd" }}>
                                    <td>Discover Acquirer</td>
                                    <td>
                                        {getCardTypeTotal("Discover Acquirer")}
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid #ddd" }}>
                                    <td>
                                        <b>Report Total</b>
                                    </td>
                                    <td>
                                        <b>
                                            {getCardTypeTotal("Report Total")}
                                        </b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col md={24}>
                        <Row>
                            <Col md={8} xs={0}>
                                {" "}
                                <Button
                                    type="primary"
                                    title="Upload"
                                    icon={<ReloadOutlined />}
                                    loading={isLoadingGetBatchDetailList}
                                    onClick={e => handleGetBatchDetailList()}
                                >
                                    Refresh Batch Detail
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
                                    <CSVLink
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
                                    </CSVLink>
                                </div>
                            </Col>
                        </Row>
                        <Divider />

                        <div className="table-responsive">
                            <ResizableAntdTable
                                scroll={{ x: "max-content" }}
                                loading={isLoadingBatchDetailModal}
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

                                    // localStorage.account_batch_detail_modal_table_sort_column =
                                    //     sorter.columnKey;
                                    // localStorage.account_batch_detail_modal_table_sort_order = sorter.order
                                    //     ? sorter.order.replace("end", "")
                                    //     : null;

                                    setCsvData(extra.currentDataSource);
                                }}
                            >
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="batch_number"
                                    key="batch_number"
                                    title={
                                        <CustomTableTitle
                                            title="Batch #"
                                            dataIndex="batch_number"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="merchant_number"
                                    key="merchant_number"
                                    title={
                                        <CustomTableTitle
                                            title="Merchant Number"
                                            dataIndex="batch_number"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="entry_mode"
                                    key="entry_mode"
                                    title={
                                        <CustomTableTitle
                                            title="Entry Moder"
                                            dataIndex="entry_mode"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="card_type"
                                    key="card_type"
                                    title={
                                        <CustomTableTitle
                                            title="Card Type"
                                            dataIndex="card_type"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="card_number"
                                    key="card_number"
                                    title={
                                        <CustomTableTitle
                                            title="Card Number"
                                            dataIndex="card_number"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="trx_type"
                                    key="trx_type"
                                    title="Type"
                                    title={
                                        <CustomTableTitle
                                            title="Type"
                                            dataIndex="trx_type"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="trx_code"
                                    key="trx_code"
                                    title={
                                        <CustomTableTitle
                                            title="Code"
                                            dataIndex="trx_code"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                />
                                <Table.Column
                                    ellipsis={true}
                                    dataIndex="trx_amount"
                                    key="trx_amount"
                                    title={
                                        <CustomTableTitle
                                            title="Amount"
                                            dataIndex="trx_amount"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                        />
                                    }
                                    render={(text, record) => {
                                        return (
                                            <>
                                                $
                                                {number_format(
                                                    record.trx_amount,
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

export default PagePaysafeBatchDetailModal;
