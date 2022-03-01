import React, { useState, useEffect, useRef } from "react";
// import moment, { isMoment } from "moment";
import moment from 'moment-timezone';
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import {
    Card,
    Row,
    Col,
    Button,
    Alert,
    Input,
    Table,
    Popconfirm,
    notification,
    DatePicker,
    Modal,
    Spin,
    Typography,
    Comment,
    Avatar
} from "antd";
import useAxiosQuery from "../../../../providers/useAxiosQuery";


const GiftCardCheckBalance = ({ history, match }) => {
    useEffect(() => {
        setTimeout(() => {
            $("#cardNumber").focus();
        }, 500);
        return () => {};
    }, []);

    const [cardNumber, setCardNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [cardData, setCardData] = useState();

    // const {
    //     data: dataCheckBalance,
    //     isLoading: isLoadingCheckBalance
    // } = useAxiosQuery(
    //     'GET',
    //     `merchant_gift_card_account_cards?id=${match.params.id}`,
    //     'merchant_gift_card_account_cards',
    //     res => {
    //         if (res.success) {
    //             // console.log(res)
    //             // if (res.data) {
    //             //     setCardData(res.data);
    //             // } else {
    //             //     setErrorMessage("Card Not Found");
    //             // }
    //             setCardData(res.balance);
    //             setLoadingSpinner(false);
    //         }
    //     }
    // )

    const {
        mutate: mutateCheckBalance,
    } = useAxiosQuery('POST', 'api/v1/merchant_gift_card_account_cards', 'merchant_gift_card_account_cards')

    const handleCheckBalance = () => {
        setErrorMessage("");
        setLoadingSpinner(true);
        setCardData(null);
        mutateCheckBalance({
            card_number : cardNumber,
            account_id : match.params.id,
        },{
            onSuccess: res => {
                if (res.data) {
                    setCardData(res.data);
                    console.log(res.data)
                } else {
                    setErrorMessage("Card Not Found");
                }
                setLoadingSpinner(false);
            },
            onError: err => {
                // console.log(err);
            }
        })
    };

    return (
        <div
            style={{
                // width: 500,
                // top: "30%",
                // display: 'flex',
                // justifyContent: 'center',
                // flexDirection: 'column',
                // left: "50%",
                // position: "absolute",
                // margin: "-100px 0 0 -250px",

            }}
        >
            <Row
                gutter={24}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
            >
                <Col
                    className='gutter-row'
                    span={8}
                    offset={8}

                >
                    <Card
                        title="Card Balances"
                        style={{
                            top: "106px",
                            marginBottom: '122px',
                            boxShadow: "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}
                            className="table-responsive"
                        >
                            {/* <Table
                                dataSource={dataCheckBalance ? dataCheckBalance.data : []}
                                rowKey={record => record.id}
                                pagination={false}
                            >
                                <Table.Column
                                    title="Card Number"
                                    dataIndex="card_number"
                                    key="card_number"
                                />
                                <Table.Column
                                    title="Balance"
                                    key="balance"
                                    dataIndex="balance"
                                    render={(text, record) => {
                                        return record.balance.toFixed(2)
                                    }}
                                />
                            </Table> */}

                            <h3 className="text-center">
                                Enter Gift Card Number
                            </h3>
                            <Input
                                id="cardNumber"
                                onChange={e =>
                                    setCardNumber(e.target.value)
                                }
                                value={cardNumber}
                            />
                            <Button
                                color="primary"
                                onClick={e => handleCheckBalance()}
                                style={{marginTop: '5px'}}
                                type="primary"
                            >
                                {loadingSpinner ? (
                                    <>
                                        Checking Balance{" "}
                                        <i className="fa fa-spinner fa-spin"></i>
                                    </>
                                ) : (
                                    <>Check Balance</>
                                )}
                            </Button>

                            <br />
                            {errorMessage != "" && (
                                <Alert
                                    // style={{ textAlign: "center" }}
                                    message={errorMessage}
                                    type="error"
                                />
                            )}

                            {cardData && (
                                <div className="text-center">
                                    <h3>Balance</h3>
                                    <h1 style={{ fontSize: '35px', fontWeight: 'bold' }}>
                                        ${" "}{cardData.balance.toFixed(2)}
                                    </h1>
                                </div>
                            )}

                        </div>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}

export default GiftCardCheckBalance;
