require("dotenv/config");
// import * from 'dotenv/config'
// const Apify = require("apify");
// import Apify from "apify";
// import puppeteer from "puppeteer";
const puppeteer = require("puppeteer");
const select = require("puppeteer-select");
const Apify = require("apify");

const ApifyPaysafeAccounts = async () => {
    Apify.main(async () => {
        let email = "jesse1294";
        let pass = "!0d6xt%^2MAl";
        let merchant_number = "5428141406500023";
        const browser = await puppeteer.launch({
            headless: false
            // executablePath: "/usr/bin/google-chrome-stable",
            // args: ["--no-sandbox"]
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        // await page.goto("https://randomword.com/");

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
        await page.type("#P101_PASSWORD", pass);
        console.log("Attempted to enter password");

        // await Apify.utils.puppeteer.injectJQuery(page);
        // await page.evaluate(() => {
        //     $("#P101_LOGIN").submit();
        //     console.log("submit");
        // });
        await page.click("#P101_LOGIN");
        console.log("submit click");
        await page.waitForSelector(
            "#wrapper > div > div.leftpanel > ul > li:nth-child(3) > a"
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

        await page.type("#apexir_SEARCH", merchant_number);
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
            retrievals: []
        };
        // START PAYSAFE BATCHES
        data.batch_list = await getPaysafeBatches(page);
        data.deposits = await getPaysafeDeposits(page);
        data.money_transactions = await getPaysafeMoneyTransactions(page);
        data.chargebacks = await getPaysafeChargebacks(page);
        data.retrievals = await getPaysafeRetrievals(page);

        await getPaysafeBatchDetails(page, data.batch_list);
        console.log("data", data);
        // END PAYSAFE BATCHES
        await page.close();
        await browser.close();
    });
};

// export default ApifyPaysafeAccounts;
ApifyPaysafeAccounts();
// export default ApifyPaysafeAccounts;
const getPaysafeBatches = async page => {
    console.log("crawling batch list");
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace("2001", "2002");
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
            record.batch_amount = tdList[5];

            if (tdList.length >= 3) {
                rowList.push(record);
            }
        });
        return rowList;
    });
};

const getPaysafeDeposits = async page => {
    console.log("crawling deposits");
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace("2002", "2003");
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
            record.amount = tdList[7];

            if (tdList.length >= 3) {
                rowList.push(record);
            }
        });
        return rowList;
    });
};

const getPaysafeMoneyTransactions = async page => {
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace("2003", "2012");
    console.log("merchant_page_url", merchant_page_url);
    await page.goto(merchant_page_url);
    await page.waitForSelector("#apexir_LOADER", { hidden: true });
    await page.select("#P2012_ROWS", "100");
    // console.log("click rows dropdown select");
    await page.waitForNavigation();
    // await page.waitForSelector("#apexir_LOADER", { hidden: true });
    console.log("loading done");
    return await page.$$eval("#report_R3314535836296424833 tbody tr", trows => {
        let rowList = [];
        trows.forEach(row => {
            let record = {
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
            record.amount = tdList[3];
            record.transaction_type = tdList[4];
            record.entry_mode = tdList[5];
            record.card_type = tdList[6];

            rowList.push(record);
        });
        return rowList;
    });
};

const getPaysafeChargebacks = async page => {
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace("2012", "2005");
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
            record.amount = tdList[1];
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

const getPaysafeRetrievals = async page => {
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace("2005", "2006");
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
                record.amount = tdList[1];
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

const getPaysafeBatchDetails = async (page, batch_list) => {
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace("2006", "2002");
    console.log("merchant_page_url_detail", merchant_page_url);
    // await page.goto(merchant_page_url);
    // await page.waitForSelector("#apexir_LOADER", { hidden: true });
    for await (let batch_promise of batch_list) {
        await page.goto(merchant_page_url);
        await page.waitForSelector("#apexir_LOADER", { hidden: true });
        console.log('batch["batch_number"]', batch_promise["batch_number"]);
        const [button] = await page.$x(
            "//a[contains(., '" + batch_promise["batch_number"] + "')]"
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
        let recordList = [];
        do {
            await console.log("on batch detail page");
            await console.log("_continue", _continue);
            await page.waitForSelector("#report_batchdetails tbody tr");
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
                        record.trx_amount = tdList[7];

                        // if (tdList.length >= 3) {
                        rowList.push(record);
                        // }
                    });
                    return rowList;
                }
            );
            // console.log("_recordList", _recordList);
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
        // console.log("recordList", recordList);

        batch_promise["batch_details"] = recordList;
    }

    return batch_list;
};
