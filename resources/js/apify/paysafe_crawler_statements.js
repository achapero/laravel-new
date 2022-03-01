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
// const shell = require("shelljs");

const app = express();

app.get("/paysafe_crawler_statements", async (req, res) => {
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
            headless: false
            // executablePath: "/usr/bin/google-chrome",
            // args: ["--no-sandbox", "--single-process", "--no-zygote"]
        });
        let recordList = [];
        try {
            const page = await browser.newPage();
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
            recordList = await getPaysafeStatements(page, "2001");

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
const getPaysafeStatements = async (page, from = "2001") => {
    console.log("crawling statement list");
    let merchant_page_url = await page.url();
    merchant_page_url = merchant_page_url.split("::NO:");
    merchant_page_url = merchant_page_url[0] + "::NO:::";
    merchant_page_url = merchant_page_url.replace(from, "2004");
    console.log("merchant_page_url", merchant_page_url);
    await page.goto(merchant_page_url);
    await page.waitForSelector("#apexir_LOADER", { hidden: true });

    await page.waitForTimeout(4000);

    recordList = await page.$$eval("#statements li a", links => {
        console.log("links", links);
        links.forEach(link => {
            console.log("link", link);
        });
    });

    await page.waitForTimeout(4000);
};
