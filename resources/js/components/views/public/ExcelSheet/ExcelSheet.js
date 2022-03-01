import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
    Button,
    Container,
    Input,
    Table,
    Card,
    CardBody,
    Row,
    Col,
    CardHeader
} from "reactstrap";
import readXlsxFile from "read-excel-file";
import moment from "moment";
import { number_format } from "../../../providers/number_format";
import useAxiosQuery from "../../../providers/useAxiosQuery";

const ExcelSheet = () => {
    const [workbook, setWorkBook] = useState();
    const [filteredWorkbook, setFilteredWorkbook] = useState();
    const [pdfs, setPdfs] = useState();
    useEffect(() => {
        console.log("pdfs", pdfs);
        //
        return () => {};
    }, [pdfs]);

    useEffect(() => {
        console.log("workbook", workbook);
        if (workbook) {
            console.log("workbook", workbook);
            // console.log("pdf.dba_name", pdf.dba_name);
            let filtered = [];
            pdfs.map((pdf, key) => {
                let _filtered = workbook.filter(
                    p =>
                        p.merchant_name.indexOf(pdf.dba_name) !== -1 &&
                        p.charge_type == null
                );
                filtered = [...filtered, ..._filtered];
            });

            console.log("filtered", filtered);
            setFilteredWorkbook(filtered);
        }
        return () => {};
    }, [workbook]);

    function excelDateToJSDate(excelDate) {
        var date = new Date(
            Math.round((excelDate - (25567 + 1)) * 86400 * 1000)
        );
        var converted_date = date.toISOString().split("T")[0];
        return moment(converted_date).format("MM/YYYY");
    }

    const onChangeHandler = (e) => {
        let files = e.target.files;
        let _pdfs = [];
        Object.values(files).map((file, key) => {
            var reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = function() {};

            reader.onloadend = () => {
                let result = btoa(reader.result);
                _pdfs.push(result);

                if (key == files.length - 1) {
                    console.log("_pdfs", _pdfs);
                    setTimeout(() => {
                        // axios.post(
                        //         window.location
                        //             .origin +
                        //             "/pdfUploadAdaptMSMerchantStatement",
                        //         { pdfs: _pdfs }
                        //     )
                        //     .then(
                        //         ({ data: res }) => {
                        //             setPdfs(
                        //                 res.data
                        //             );
                        //         }
                        //     );
                        mutateFile({pdfs: _pdfs}, {
                            onSuccess: res => {
                                console.log('@res file', res)
                                setPdfs(
                                    res.data
                                );
                            }
                        })
                    }, 1000);
                }
            };
            reader.onerror = function() {
                console.log(
                    "there are some problems"
                );
            };
        });
    }

    const {
        mutate: mutateFile,
        isLoading: isLoadingFile
    } = useAxiosQuery('POST', 'pdfUploadAdaptMSMerchantStatement', 'file')


    return (
        <div className="app" style={{ padding: 20 }}>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <h4>Upload AdaptMS Merchant Statement</h4>
                            <Input
                                type="file"
                                accept=".pdf"
                                multiple
                                onChange={e => onChangeHandler(e)}
                            />
                            {pdfs && (
                                <div>
                                    <i className="fa fa-check"></i> PDF
                                    Successfully Uploaded{" "}
                                    <div>
                                        <Table bordered size="sm">
                                            <thead>
                                                <tr>
                                                    <th>Dba Name</th>
                                                    <th>Visa</th>
                                                    <th>MasterCard</th>
                                                    <th>JCB</th>
                                                    <th>American Express</th>
                                                    <th>Discover</th>
                                                    <th>Debit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pdfs.map((pdf, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>
                                                                {pdf.dba_name}
                                                            </td>
                                                            <td>
                                                                {number_format(
                                                                    pdf.visa
                                                                )}
                                                            </td>
                                                            <td>
                                                                {number_format(
                                                                    pdf.mastercard
                                                                )}
                                                            </td>
                                                            <td>
                                                                {number_format(
                                                                    pdf.jcb
                                                                )}
                                                            </td>
                                                            <td>
                                                                {number_format(
                                                                    pdf.american_express
                                                                )}
                                                            </td>
                                                            <td>
                                                                {number_format(
                                                                    pdf.discover
                                                                )}
                                                            </td>
                                                            <td>
                                                                {number_format(
                                                                    pdf.debit
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {pdfs && (
                <Card>
                    <CardBody>
                        <h4>Upload Merchant Detail Vertical</h4>
                        <Input
                            type="file"
                            accept=".xlsx"
                            onChange={e => {
                                readXlsxFile(e.target.files[0], {
                                    dateFormat: "m/d/yyyy"
                                }).then(rows => {
                                    let columns = rows[0];
                                    let index_merchant_number = columns.indexOf(
                                        "Merchant Number"
                                    );
                                    let index_merchant_name = columns.indexOf(
                                        "Merchant Name"
                                    );
                                    let index_date = columns.indexOf("Date");
                                    let index_charge_type = columns.indexOf(
                                        "ChargeType"
                                    );
                                    let index_card = columns.indexOf("Card");
                                    let index_sales_volume = columns.indexOf(
                                        "Sales Volume"
                                    );
                                    let index_sales_count = columns.indexOf(
                                        "Sales Count"
                                    );
                                    let values = [];
                                    rows.map((row, key) => {
                                        if (key > 0) {
                                            values.push({
                                                date: excelDateToJSDate(
                                                    row[index_date]
                                                ),
                                                merchant_number:
                                                    row[index_merchant_number],
                                                merchant_name:
                                                    row[index_merchant_name],
                                                charge_type:
                                                    row[index_charge_type],
                                                charge_type:
                                                    row[index_charge_type],
                                                card: row[index_card],
                                                sales_volume:
                                                    row[index_sales_volume],
                                                sales_count:
                                                    row[index_sales_count]
                                            });
                                        }
                                    });
                                    setWorkBook(values);
                                });
                            }}
                        />
                        {filteredWorkbook && (
                            <div>
                                <i className="fa fa-check"></i> File
                                Successfully Uploaded
                                <div className="table-responsive">
                                    <Table bordered size="sm">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Merchant Number</th>
                                                <th>Merchant Name</th>
                                                <th>Charge Type</th>
                                                <th>Card</th>
                                                <th>Sales Volume</th>
                                                <th>Sales Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredWorkbook &&
                                                filteredWorkbook.map(
                                                    (row, row_key) => {
                                                        let diff = 0;
                                                        let calc_amount = 0;

                                                        let pdf = pdfs.find(
                                                            p =>
                                                                row.merchant_name.indexOf(
                                                                    p.dba_name
                                                                ) !== -1
                                                        );

                                                        switch (row.card) {
                                                            case "Visa":
                                                                calc_amount =
                                                                    pdf.visa;
                                                                break;
                                                            case "Mastercard":
                                                                calc_amount =
                                                                    pdf.mastercard;
                                                                break;
                                                            case "JCB":
                                                                calc_amount =
                                                                    pdf.jcb;
                                                                break;
                                                            case "Amex Opt Blue":
                                                                calc_amount =
                                                                    pdf.american_express;
                                                                break;
                                                            case "Discover Acquiring":
                                                                calc_amount =
                                                                    pdf.discover;
                                                                break;
                                                            case "Debit":
                                                                calc_amount =
                                                                    pdf.debit;
                                                                break;

                                                            default:
                                                                break;
                                                        }

                                                        diff =
                                                            calc_amount -
                                                            row.sales_volume;

                                                        return (
                                                            <tr key={row_key}>
                                                                <td>
                                                                    {row.date}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        row.merchant_number
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        row.merchant_name
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        row.charge_type
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {row.card}
                                                                </td>
                                                                <td>
                                                                    {number_format(
                                                                        row.sales_volume
                                                                    )}
                                                                    <br />
                                                                    Diff:{" "}
                                                                    <span
                                                                        style={{
                                                                            color:
                                                                                diff ==
                                                                                0
                                                                                    ? "green"
                                                                                    : "red"
                                                                        }}
                                                                    >
                                                                        {number_format(
                                                                            diff
                                                                        )}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        row.sales_count
                                                                    }
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>
            )}
        </div>
    );
};

export default ExcelSheet;
