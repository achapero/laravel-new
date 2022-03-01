// const puppeteer = require("puppeteer");

// (async () => {
//     const browser = await puppeteer.launch({ headless: false });
//     const browserWSEndpoint = browser.wsEndpoint();
//     browser.disconnect(); // Disconnect from the browser, but don't close it
//     console.log(browserWSEndpoint); // Communicate the Websocket URL to the client-side
//     // example output: ws://127.0.0.1:55620/devtools/browser/e62ec4c8-1f05-42a1-86ce-7b8dd3403f91
// })();

const puppeteer = require("puppeteer");
const express = require("express");
const axios = require("axios");
// const shell = require("shelljs");

const app = express();

app.get("/paysafe_crawler", async (req, res) => {
    let ignore = ["DELETED", "DECLINED", "PENDING"];
    if (ignore.includes(req.query.merchant_number)) {
        await browser.close();
        res.writeHead(200, {
            "Content-Type": "application/json"
            // "Content-Length":
        });
        res.end([]);
    } else {
        let email = "jesse1294";
        let pass = "cUxnu7HhOL6E";
        // console.log("process.env.EMAIL", email);
        // console.log("process.env.PASSWORD", pass);

        const browser = await puppeteer.launch({
            // headless: false
            // executablePath: "/usr/bin/google-chrome",
            args: ["--no-sandbox", "--single-process", "--no-zygote"]
        });
        let recordList = [];
        try {
            const page = await browser.newPage();

            process.on("unhandledRejection", (reason, p) => {
                console.error(
                    "Unhandled Rejection at: Promise",
                    p,
                    "reason:",
                    reason
                );
                browser.close();
            });

            // await page.setDefaultNavigationTimeout(120000);
            await page.setViewport({
                width: 1920,
                height: 1080
            });
            await page.goto(
                "https://www.instoreportal.com/ords/f?p=118:LOGIN_DESKTOP:0"
            );
            // await page.waitForSelector("#etrust-accept-btn-handler");
            // await page.click("#etrust-accept-btn-handler");
            // Login
            await page.click("#P101_USERNAME", { clickCount: 3 });
            await page.type("#P101_USERNAME", email);
            console.log("Attempted to enter email");
            // Login
            await page.click("#P101_PASSWORD", { clickCount: 3 });
            await page.type("#P101_PASSWORD", pass);
            console.log("Attempted to enter password");

            console.log("submit click");

            await Promise.all([
                page.click("#P101_LOGIN"),
                page.waitForNavigation({ waitUntil: "networkidle0" })
            ]);

            // Invalid Login Credentials

            await page.waitForSelector(
                "#wrapper > div > div.leftpanel > ul > li:nth-child(3) > a"
            );
            if (req.query.type == "paysafe_accounts") {
                let page_url = await page.url();
                let merchant_list_no = page_url.split(
                    "https://www.instoreportal.com/ords/f?p=118:1007:"
                );
                merchant_list_no = merchant_list_no[1].split(":::::");
                merchant_list_no = merchant_list_no[0];
                console.log("merchant_list_no", merchant_list_no);
                await page.goto(
                    "https://www.instoreportal.com/ords/f?p=118:MERCH_LIST:" +
                        merchant_list_no +
                        "::NO:RP,RIR::"
                );
                // await page.click(
                //     "#wrapper > div > div.leftpanel > ul > li:nth-child(3) > a"
                // );
                await page.waitForSelector("#apexir_NUM_ROWS");
                console.log("await for rows dropdown select");
                await page.select("#apexir_NUM_ROWS", "100000");
                console.log("click rows dropdown select");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                console.log("wait for all rows to be rendered");
                recordList = await page.$$eval(
                    ".apexir_WORKSHEET_DATA tbody tr",
                    trows => {
                        let rowList = [];
                        trows.forEach(row => {
                            let record = {
                                app_number: "",
                                merchant_number: "",
                                merchant_name: "",
                                agent_number: "",
                                agent_name: "",
                                rep_number: "",
                                rep_name: "",
                                status: "",
                                approved_date: "",
                                closed_date: "",
                                corp_name: "",
                                phone_number: "",
                                owner_name: ""
                            };
                            // record.country = row.querySelector("a").innerText; // (tr < th < a) anchor tag text contains country name
                            const tdList = Array.from(
                                row.querySelectorAll("td"),
                                column => column.innerText
                            ); // getting textvalue of each column of a row and adding them to a list.
                            record.app_number = tdList[1];
                            record.merchant_number = tdList[2];
                            record.merchant_name = tdList[3];
                            record.agent_number = tdList[4];
                            record.agent_name = tdList[5];
                            record.rep_number = tdList[6];
                            record.rep_name = tdList[7];
                            record.status = tdList[8];
                            record.approved_date = tdList[9];
                            record.closed_date = tdList[10];
                            record.corp_name = tdList[11];
                            record.phone_number = tdList[12];
                            record.owner_name = tdList[13];
                            if (tdList.length >= 3) {
                                rowList.push(record);
                            }
                        });
                        return rowList;
                    }
                );
                // console.log("recordList", recordList);
                console.log("done");
                // Respond with the image
            }

            if (req.query.type == "paysafe_batches") {
                let page_url = await page.url();
                let merchant_list_no = page_url.split(
                    "https://www.instoreportal.com/ords/f?p=118:1007:"
                );
                merchant_list_no = merchant_list_no[1].split(":::::");
                merchant_list_no = merchant_list_no[0];
                console.log("merchant_list_no", merchant_list_no);
                await page.goto(
                    "https://www.instoreportal.com/ords/f?p=118:MERCH_LIST:" +
                        merchant_list_no +
                        "::NO:RP,RIR::"
                );

                await page.type("#apexir_SEARCH", req.query.merchant_number);
                await page.click("#apexir_btn_SEARCH");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                await page.click(".apexir_WORKSHEET_DATA a:nth-child(1)");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                // await page.click("#R3301472136202533300 > ul > li:nth-child(3) > a");
                recordList = await getPaysafeBatches(page, "2001");
            }

            if (req.query.type == "paysafe_deposits") {
                let page_url = await page.url();
                let merchant_list_no = page_url.split(
                    "https://www.instoreportal.com/ords/f?p=118:1007:"
                );
                merchant_list_no = merchant_list_no[1].split(":::::");
                merchant_list_no = merchant_list_no[0];
                console.log("merchant_list_no", merchant_list_no);
                await page.goto(
                    "https://www.instoreportal.com/ords/f?p=118:MERCH_LIST:" +
                        merchant_list_no +
                        "::NO:RP,RIR::"
                );

                await page.type("#apexir_SEARCH", req.query.merchant_number);
                await page.click("#apexir_btn_SEARCH");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                await page.click(".apexir_WORKSHEET_DATA a:nth-child(1)");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                // await page.click("#R3301472136202533300 > ul > li:nth-child(3) > a");
                recordList = await getPaysafeDeposits(page, "2001");
            }

            if (req.query.type == "paysafe_money_transactions") {
                let page_url = await page.url();
                let merchant_list_no = page_url.split(
                    "https://www.instoreportal.com/ords/f?p=118:1007:"
                );
                merchant_list_no = merchant_list_no[1].split(":::::");
                merchant_list_no = merchant_list_no[0];
                console.log("merchant_list_no", merchant_list_no);
                await page.goto(
                    "https://www.instoreportal.com/ords/f?p=118:MERCH_LIST:" +
                        merchant_list_no +
                        "::NO:RP,RIR::"
                );
                console.log(
                    "req.query.merchant_number",
                    req.query.merchant_number
                );
                await page.type("#apexir_SEARCH", req.query.merchant_number);
                await page.click("#apexir_btn_SEARCH");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                await page.click(".apexir_WORKSHEET_DATA a:nth-child(1)");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                recordList = await getPaysafeMoneyTransactions(
                    page,
                    "2001",
                    req.query.merchant_number
                );
            }

            if (req.query.type == "paysafe_chargebacks") {
                let page_url = await page.url();
                let merchant_list_no = page_url.split(
                    "https://www.instoreportal.com/ords/f?p=118:1007:"
                );
                merchant_list_no = merchant_list_no[1].split(":::::");
                merchant_list_no = merchant_list_no[0];
                console.log("merchant_list_no", merchant_list_no);
                await page.goto(
                    "https://www.instoreportal.com/ords/f?p=118:MERCH_LIST:" +
                        merchant_list_no +
                        "::NO:RP,RIR::"
                );
                console.log(
                    "req.query.merchant_number",
                    req.query.merchant_number
                );
                await page.type("#apexir_SEARCH", req.query.merchant_number);
                await page.click("#apexir_btn_SEARCH");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                await page.click(".apexir_WORKSHEET_DATA a:nth-child(1)");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                recordList = await getPaysafeChargebacks(page, "2001");
            }

            if (req.query.type == "paysafe_retrievals") {
                let page_url = await page.url();
                let merchant_list_no = page_url.split(
                    "https://www.instoreportal.com/ords/f?p=118:1007:"
                );
                merchant_list_no = merchant_list_no[1].split(":::::");
                merchant_list_no = merchant_list_no[0];
                console.log("merchant_list_no", merchant_list_no);
                await page.goto(
                    "https://www.instoreportal.com/ords/f?p=118:MERCH_LIST:" +
                        merchant_list_no +
                        "::NO:RP,RIR::"
                );
                console.log(
                    "req.query.merchant_number",
                    req.query.merchant_number
                );
                await page.type("#apexir_SEARCH", req.query.merchant_number);
                await page.click("#apexir_btn_SEARCH");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                await page.click(".apexir_WORKSHEET_DATA a:nth-child(1)");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                recordList = await getPaysafeRetrievals(page, "2001");
            }

            if (req.query.type == "paysafe_batch_details") {
                console.log(
                    "req.query.merchant_number",
                    req.query.merchant_number
                );
                let page_url = await page.url();
                let merchant_list_no = page_url.split(
                    "https://www.instoreportal.com/ords/f?p=118:1007:"
                );
                merchant_list_no = merchant_list_no[1].split(":::::");
                merchant_list_no = merchant_list_no[0];
                console.log("merchant_list_no", merchant_list_no);
                await page.goto(
                    "https://www.instoreportal.com/ords/f?p=118:MERCH_LIST:" +
                        merchant_list_no +
                        "::NO:RP,RIR::"
                );

                await page.type("#apexir_SEARCH", req.query.merchant_number);
                await page.click("#apexir_btn_SEARCH");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                await page.click(".apexir_WORKSHEET_DATA a:nth-child(1)");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });

                let merchant_page_url = await page.url();
                merchant_page_url = merchant_page_url.split("::NO:");
                merchant_page_url = merchant_page_url[0] + "::NO:::";
                merchant_page_url = merchant_page_url.replace("2001", "2002");
                console.log("merchant_page_url", merchant_page_url);
                await page.goto(merchant_page_url);
                await page.waitForSelector("#apexir_LOADER", { hidden: true });

                const [button] = await page.$x(
                    "//a[contains(., '" + req.query.batch_no + "')]"
                );
                if (button) {
                    await button.click();
                }
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                await page.waitForSelector("#report_batchdetails");

                // console.log("done");
                var _continue = true;
                var page_count = 0;
                do {
                    await console.log("on batch detail page");
                    await console.log("_continue", _continue);
                    let _recordList = await page.$$eval(
                        "#report_batchdetails tbody tr",
                        trows => {
                            let rowList = [];
                            trows.forEach(row => {
                                let record = {
                                    merchant_number: "",
                                    trx_date: "",
                                    entry_mode: "",
                                    card_type: "",
                                    card_number: "",
                                    trx_type: "",
                                    trx_code: "",
                                    trx_amount: ""
                                };
                                // record.country = row.querySelector("a").innerText; // (tr < th < a) anchor tag text contains country name
                                const tdList = Array.from(
                                    row.querySelectorAll("td"),
                                    column => column.innerText
                                ); // getting textvalue of each column of a row and adding them to a list.
                                record.merchant_number = tdList[0];
                                record.trx_date = tdList[1];
                                record.entry_mode = tdList[2];
                                record.card_type = tdList[3];
                                record.card_number = tdList[4];
                                record.trx_type = tdList[5];
                                record.trx_code = tdList[6];
                                record.trx_amount = tdList[7]
                                    .replace(/,/g, "")
                                    .replace("$", "");

                                // if (tdList.length >= 3) {
                                rowList.push(record);
                                // }
                            });
                            return rowList;
                        }
                    );

                    recordList = [...recordList, ..._recordList];

                    try {
                        await page.click(
                            "#report_3313604760201013144_catch > div.tb-pagination.uReportPagination.clearfix > table > tbody > tr > td:nth-child(4) > li > a"
                        );
                        await page.waitForResponse(
                            response => response.status() === 200
                        );
                        page_count++;
                        console.log("page", page_count);
                    } catch (error) {
                        _continue = false;
                    }
                } while (_continue);
            }

            if (req.query.type == "paysafe_merchant_data") {
                let page_url = await page.url();
                let merchant_list_no = page_url.split(
                    "https://www.instoreportal.com/ords/f?p=118:1007:"
                );
                merchant_list_no = merchant_list_no[1].split(":::::");
                merchant_list_no = merchant_list_no[0];
                console.log("merchant_list_no", merchant_list_no);
                await page.goto(
                    "https://www.instoreportal.com/ords/f?p=118:MERCH_LIST:" +
                        merchant_list_no +
                        "::NO:RP,RIR::"
                );
                console.log("crawler for ", req.query.merchant_number);
                await page.type("#apexir_SEARCH", req.query.merchant_number);
                await page.click("#apexir_btn_SEARCH");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                await page.click(".apexir_WORKSHEET_DATA a:nth-child(1)");
                await page.waitForSelector("#apexir_LOADER", { hidden: true });
                // await page.click("#R3301472136202533300 > ul > li:nth-child(3) > a");

                let data = {
                    batch_list: [],
                    deposits: [],
                    money_transactions: [],
                    chargebacks: [],
                    retrievals: [],
                    batch_details: []
                };
                // START PAYSAFE BATCHES
                data.batch_list = await getPaysafeBatches(page);
                data.deposits = await getPaysafeDeposits(page);
                data.money_transactions = await getPaysafeMoneyTransactions(
                    page,
                    "2003",
                    req.query.merchant_number
                );
                data.chargebacks = await getPaysafeChargebacks(page);
                data.retrievals = await getPaysafeRetrievals(page);

                data.batch_details = await getPaysafeBatchDetails(
                    page,
                    data.batch_list
                );
                console.log("data", data);

                recordList = data;
            }
            await browser.close();
            // shell.exec("pkill chrome");
            // console.log("recordList", recordList);
            res.writeHead(200, {
                "Content-Type": "application/json"
                // "Content-Length":
            });
            res.end(JSON.stringify(recordList));
        } catch (error) {
            console.log("error", error);
            axios
                .post(`http://newpromise.test/crawler_alert`, {
                    error: error
                })
                .then(res => {
                    // console.log(`statusCode: ${res.status}`);
                    // console.log(res);
                })
                .catch(error => {
                    console.error(error);
                });
            await browser.close();
            // shell.exec("pkill chrome");
            res.writeHead(200, {
                "Content-Type": "application/json"
                // "Content-Length":
            });
            res.end("error");
        } finally {
            await browser.close();
            // shell.exec("pkill chrome");
        }
    }
});

app.listen(4000);
const getPaysafeBatches = async (page, from = "2001") => {
    console.log("crawling batch list");
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace(from, "2002");
    console.log("merchant_page_url", merchant_page_url);
    await page.goto(merchant_page_url);
    await page.waitForSelector("#apexir_LOADER", { hidden: true });

    return await page.$$eval("#report_R3301483245271715641 tbody tr", trows => {
        let rowList = [];
        trows.forEach(row => {
            let record = {
                batch_number: "",
                merchant_number: "",
                closed_date: "",
                batch_date: "",
                net_items: "",
                batch_amount: ""
            };
            // record.country = row.querySelector("a").innerText; // (tr < th < a) anchor tag text contains country name
            const tdList = Array.from(
                row.querySelectorAll("td"),
                column => column.innerText
            ); // getting textvalue of each column of a row and adding them to a list.
            record.batch_number = tdList[0];
            record.merchant_number = tdList[1];
            record.closed_date = tdList[2];
            record.batch_date = tdList[3];
            record.net_items = tdList[4];
            record.batch_amount = tdList[5].replace(/,/g, "").replace("$", "");

            if (tdList.length >= 3) {
                rowList.push(record);
            }
        });
        return rowList;
    });
};

const getPaysafeDeposits = async (page, from = "2002") => {
    console.log("crawling deposits");
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace(from, "2003");
    console.log("merchant_page_url", merchant_page_url);
    await page.goto(merchant_page_url);
    await page.waitForSelector("#apexir_LOADER", { hidden: true });

    return await page.$$eval("#report_depositList tbody tr", trows => {
        let rowList = [];
        trows.forEach(row => {
            let record = {
                merchant_number: "",
                ach_date: "",
                transmission_date: "",
                trace_number: "",
                dda_number: "",
                tr_number: "",
                amount: ""
            };
            // record.country = row.querySelector("a").innerText; // (tr < th < a) anchor tag text contains country name
            const tdList = Array.from(
                row.querySelectorAll("td"),
                column => column.innerText
            ); // getting textvalue of each column of a row and adding them to a list.
            record.merchant_number = tdList[1];
            record.ach_date = tdList[2];
            record.transmission_date = tdList[3];
            record.trace_number = tdList[4];
            record.dda_number = tdList[5];
            record.tr_number = tdList[6];
            record.amount = tdList[7].replace(/,/g, "").replace("$", "");

            if (tdList.length >= 3) {
                rowList.push(record);
            }
        });
        return rowList;
    });
};

const getPaysafeMoneyTransactions = async (
    page,
    from = "2003",
    merchant_number
) => {
    console.log("crawling money transactions");
    console.log("from", from);
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace(from, "2012");
    console.log("merchant_page_url", merchant_page_url);
    await page.goto(merchant_page_url);
    await page.waitForSelector("#apexir_LOADER", { hidden: true });
    await page.select("#P2012_ROWS", "100");
    // console.log("merchant_number", merchant_number);
    await page.waitForNavigation();
    // await page.waitForSelector("#apexir_LOADER", { hidden: true });
    console.log("loading done");
    return await page.$$eval(
        "#report_R3314535836296424833 tbody tr",
        (trows, merchant_number) => {
            let rowList = [];
            trows.forEach(row => {
                let record = {
                    merchant_number: merchant_number,
                    batch_number: "",
                    card_number: "",
                    transaction_date: "",
                    amount: "",
                    transaction_type: "",
                    entry_mode: "",
                    card_type: ""
                };
                console.log("row", row);
                // record.country = row.querySelector("a").innerText; // (tr < th < a) anchor tag text contains country name
                const tdList = Array.from(
                    row.querySelectorAll("td"),
                    column => column.innerText
                ); // getting textvalue of each column of a row and adding them to a list.
                record.batch_number = tdList[0];
                record.card_number = tdList[1];
                record.transaction_date = tdList[2];
                record.amount = tdList[3].replace(/,/g, "").replace("$", "");
                record.transaction_type = tdList[4];
                record.entry_mode = tdList[5];
                record.card_type = tdList[6];

                rowList.push(record);
            });
            return rowList;
        },
        merchant_number
    );
};

const getPaysafeChargebacks = async (page, from = "2012") => {
    console.log("crawling chargebacks");
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace(from, "2005");
    console.log("merchant_page_url", merchant_page_url);
    await page.goto(merchant_page_url);
    await page.waitForSelector("#apexir_LOADER", { hidden: true });
    // await page.waitForSelector("#apexir_LOADER", { hidden: true });
    console.log("loading done");
    return await page.$$eval("#report_R3302300240817004985 tbody tr", trows => {
        let rowList = [];
        trows.forEach(row => {
            let record = {
                merchant_number: "",
                amount: "",
                case_number: "",
                card_number: "",
                transaction_date: "",
                received_date: "",
                resolved_date: "",
                reason: ""
            };
            // record.country = row.querySelector("a").innerText; // (tr < th < a) anchor tag text contains country name
            const tdList = Array.from(
                row.querySelectorAll("td"),
                column => column.innerText
            ); // getting textvalue of each column of a row and adding them to a list.
            record.merchant_number = tdList[0];
            record.amount = tdList[1].replace(/,/g, "").replace("$", "");
            record.case_number = tdList[2];
            record.card_number = tdList[3];
            record.transaction_date = tdList[4];
            record.received_date = tdList[5];
            record.resolved_date = tdList[6];
            record.reason = tdList[7];

            rowList.push(record);
        });
        return rowList;
    });
};

const getPaysafeRetrievals = async (page, from = "2005") => {
    console.log("crawling retrievals");
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace(from, "2006");
    console.log("merchant_page_url", merchant_page_url);
    await page.goto(merchant_page_url);
    await page.waitForSelector("#apexir_LOADER", { hidden: true });
    // await page.waitForSelector("#apexir_LOADER", { hidden: true });
    console.log("loading done");
    return await page.$$eval("#report_R7023428224567488 tbody tr", trows => {
        let rowList = [];
        trows.forEach(row => {
            let record = {
                merchant_number: "",
                amount: "",
                family_id: "",
                case_number: "",
                card_number: "",
                transaction_date: "",
                received_date: "",
                resolved_date: "",
                reason: ""
            };
            // record.country = row.querySelector("a").innerText; // (tr < th < a) anchor tag text contains country name
            const tdList = Array.from(
                row.querySelectorAll("td"),
                column => column.innerText
            ); // getting textvalue of each column of a row and adding them to a list.
            if (tdList[0] != "No data available for selected date range.") {
                record.merchant_number = tdList[0];
                record.amount = tdList[1].replace(/,/g, "").replace("$", "");
                record.family_id = tdList[2];
                record.case_number = tdList[3];
                record.card_number = tdList[4];
                record.transaction_date = tdList[5];
                record.received_date = tdList[6];
                record.resolved_date = tdList[7];
                record.reason = tdList[8];

                rowList.push(record);
            }
        });
        return rowList;
    });
};

const getPaysafeBatchDetails = async (page, batch_list, from = "2006") => {
    console.log("crawling batch details");
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace(from, "2002");
    console.log("merchant_page_url_detail", merchant_page_url);
    // await page.goto(merchant_page_url);
    // await page.waitForSelector("#apexir_LOADER", { hidden: true });
    let recordList = [];
    for await (let batch_promise of batch_list) {
        await page.goto(merchant_page_url);
        await page.waitForSelector("#apexir_LOADER", { hidden: true });
        let batch_number = batch_promise["batch_number"];
        console.log('batch["batch_number"]', batch_number);
        const [button] = await page.$x(
            "//a[contains(., '" + batch_number + "')]"
        );

        if (button) {
            await button.click();
            // console.log("button", button);
        }
        await page.waitForSelector("#apexir_LOADER", { hidden: true });
        await page.waitForSelector("#report_batchdetails");

        // console.log("done");
        var _continue = true;
        var page_count = 0;
        do {
            await console.log("on batch detail page");
            await console.log("_continue", _continue);
            await console.log("waiting for report_batchdetails");
            await page.waitForSelector("#report_batchdetails tbody tr");
            let _recordList = await page.$$eval(
                "#report_batchdetails tbody tr",
                (trows, batch_number) => {
                    let rowList = [];
                    trows.forEach(row => {
                        let record = {
                            batch_number: batch_number,
                            merchant_number: "",
                            trx_date: "",
                            entry_mode: "",
                            card_type: "",
                            card_number: "",
                            trx_type: "",
                            trx_code: "",
                            trx_amount: ""
                        };
                        // record.country = row.querySelector("a").innerText; // (tr < th < a) anchor tag text contains country name
                        const tdList = Array.from(
                            row.querySelectorAll("td"),
                            column => column.innerText
                        ); // getting textvalue of each column of a row and adding them to a list.
                        record.merchant_number = tdList[0];
                        record.trx_date = tdList[1];
                        record.entry_mode = tdList[2];
                        record.card_type = tdList[3];
                        record.card_number = tdList[4];
                        record.trx_type = tdList[5];
                        record.trx_code = tdList[6];
                        record.trx_amount = tdList[7]
                            .replace(/,/g, "")
                            .replace("$", "");

                        if (record.merchant_number != "report total:") {
                            rowList.push(record);
                        }
                    });
                    return rowList;
                },
                batch_number
            );

            recordList = [...recordList, ..._recordList];
            console.log("recordList", recordList.length);
            let next_button =
                (await page.$(
                    "#report_3313604760201013144_catch > div.tb-pagination.uReportPagination.clearfix > table > tbody > tr > td:nth-child(4) > li > a"
                )) || "";
            console.log("next_button", next_button != "" ? true : false);
            if (next_button != "") {
                try {
                    console.log("clicking next button");
                    await page.click(
                        "#report_3313604760201013144_catch > div.tb-pagination.uReportPagination.clearfix > table > tbody > tr > td:nth-child(4) > li > a"
                    );
                    console.log("waiting for response");
                    await page.waitForResponse(
                        response => response.status() === 200
                    );
                    page_count++;
                    console.log("page", page_count);
                } catch (error) {
                    _continue = false;
                }
            } else {
                _continue = false;
            }
        } while (_continue);
        // console.log("recordList", recordList);

        // batch_promise["batch_details"] = recordList;
        // batch_details.push(recordList);
    }

    return recordList;
};
