import React from "react";

import {
    Row,
    Col,
} from "antd";
import PageMarketPlaceSectionScreen from "./PageMarketPlaceSectionScreen";
import PageMarketPlaceSectionDrawer from "./PageMarketPlaceSectionDrawer";
import PageMarketPlaceSectionPrinters from "./PageMarketPlaceSectionPrinters";
import PageMarketPlaceSectionTerminals from "./PageMarketPlaceSectionTerminals";
import PageMarketPlaceSectionGiftCards from "./PageMarketPlaceSectionGiftCards";
const PageDashboard = () => {
    return (
        <div id="marketplace" style={{ marginTop: 30 }}>
            <Row gutter={24}>
                <Col className="gutter-row" span={24}>
                    <PageMarketPlaceSectionScreen />
                    <PageMarketPlaceSectionDrawer />
                    <PageMarketPlaceSectionPrinters />
                    <PageMarketPlaceSectionTerminals />
                    <PageMarketPlaceSectionGiftCards />
                </Col>
            </Row>
        </div>
    );
}

export default PageDashboard
