import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Input,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Table
} from "antd";
import PageMarketPlaceSectionScreen from "./PageMarketPlaceSectionScreen";
import PageMarketPlaceSectionDrawer from "./PageMarketPlaceSectionDrawer";
import PageMarketPlaceSectionPrinters from "./PageMarketPlaceSectionPrinters";
import PageMarketPlaceSectionTerminals from "./PageMarketPlaceSectionTerminals";
import PageMarketPlaceSectionGiftCards from "./PageMarketPlaceSectionGiftCards";
export default function PageDashboard() {
    return (
        <div id="marketplace" style={{ marginTop: 30 }}>
            <Row>
                <Col>
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
