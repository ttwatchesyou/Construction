"use client";

import { Card, Col, Layout, Row, Skeleton } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Sider, Header, Content } = Layout;

const Shell = styled(Layout)`&&{min-height:100vh;background:#f0f2f8;display:flex;flex-direction:row;align-items:stretch;}`;
const Side = styled(Sider)`&&{background:#0f1626!important;flex:0 0 258px!important;max-width:258px!important;min-width:258px!important;width:258px!important;}.ant-layout-sider-children{display:flex;flex-direction:column;background:#0f1626;}@media(max-width:767px){&&{display:none;}}`;
const Brand = styled.div`display:flex;align-items:center;gap:12px;min-height:81px;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.06);`;
const BrandIcon = styled.div`width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#ff6b00,#e05e00);display:grid;place-items:center;font-size:20px;color:#fff;flex:0 0 40px;`;
const BrandLines = styled.div`display:grid;gap:7px;`;
const NavSkeleton = styled.div`display:grid;gap:15px;padding:28px 24px;.line{height:12px;border-radius:8px;background:rgba(255,255,255,.12);}.line:nth-child(3n+1){width:42%;}.line:nth-child(3n+2){width:82%;}.line:nth-child(3n){width:68%;}`;
const MainArea = styled(Layout)`&&{min-width:0;flex:1 1 auto;background:#f0f2f8;}`;
const Top = styled(Header)`&&{height:64px;background:#fff!important;padding:0 24px;border-bottom:1px solid #e8ecf0;display:flex;align-items:center;justify-content:space-between;}@media(max-width:767px){&&{padding:0 12px;}}`;
const PageContent = styled(Content)`&&{padding:24px;overflow:auto;background:#f0f2f8;}@media(min-width:768px){&& .ant-col-lg-3{flex:0 0 25%;max-width:25%;}}@media(max-width:1200px){&&{padding:18px;}}@media(max-width:767px){&&{padding:12px;}&& .ant-col-xs-12{flex:0 0 50%;max-width:50%;}}`;
const Panel = styled(Card)`&&{height:100%;border:1px solid #f0f2f8;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.04);overflow:hidden;background:#fff;}&& .ant-card-body{padding:16px;}`;
const StatCard = styled(Panel)`&& .ant-card-body{display:flex;align-items:center;gap:13px;min-height:88px;}`;
const IconBlock = styled.div`width:46px;height:46px;border-radius:13px;background:#eef4ff;flex:0 0 46px;`;
const DonutGhost = styled.div`width:142px;height:142px;border-radius:50%;background:#eef2f7;margin:16px auto 22px;position:relative;&:after{content:"";position:absolute;inset:24px;border-radius:50%;background:#fff;}`;
const LoginPage = styled.main`min-height:100vh;display:grid;place-items:center;padding:20px;background:linear-gradient(135deg,#1a1f36,#2d3561);`;
const LoginBox = styled(Card)`width:min(100%,420px);border:0;border-radius:22px;box-shadow:0 25px 60px rgba(0,0,0,.3);&& .ant-card-body{padding:36px;}`;

export function DashboardSkeleton() {
  return (
    <Shell>
      <Side width={258} trigger={null}>
        <Brand>
          <BrandIcon><ApartmentOutlined /></BrandIcon>
          <BrandLines>
            <Skeleton.Input active size="small" style={{ width: 118, height: 14, minWidth: 118 }} />
            <Skeleton.Input active size="small" style={{ width: 96, height: 10, minWidth: 96 }} />
          </BrandLines>
        </Brand>
        <NavSkeleton>{Array.from({ length: 12 }).map((_, index) => <span className="line" key={index} />)}</NavSkeleton>
      </Side>
      <MainArea>
        <Top>
          <Skeleton.Input active size="small" style={{ width: 142, height: 22, minWidth: 142 }} />
          <Skeleton.Avatar active size={40} />
        </Top>
        <PageContent>
          <Row gutter={[14, 14]}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Col xs={12} sm={6} lg={3} key={index}>
                <StatCard><IconBlock /><Skeleton active paragraph={{ rows: 1, width: "70%" }} title={{ width: "55%" }} /></StatCard>
              </Col>
            ))}
          </Row>
          <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
            <Col xs={24} lg={9}>
              <Panel><Skeleton.Input active size="small" style={{ width: 140, marginBottom: 12 }} /><DonutGhost /><Skeleton active paragraph={{ rows: 5 }} title={false} /></Panel>
            </Col>
            <Col xs={24} lg={15}>
              <Panel><Skeleton.Input active size="small" style={{ width: 150, marginBottom: 18 }} />{Array.from({ length: 3 }).map((_, index) => <Skeleton active paragraph={{ rows: 3 }} style={{ marginBottom: 18 }} key={index} />)}</Panel>
            </Col>
          </Row>
        </PageContent>
      </MainArea>
    </Shell>
  );
}

export function LoginSkeleton() {
  return (
    <LoginPage>
      <LoginBox>
        <Skeleton.Avatar active size={68} shape="square" style={{ display: "block", margin: "0 auto 18px" }} />
        <Skeleton active paragraph={{ rows: 1, width: ["46%"] }} title={{ width: "64%" }} />
        <Skeleton.Input active block size="large" style={{ marginTop: 18 }} />
        <Skeleton.Input active block size="large" style={{ marginTop: 18 }} />
        <Skeleton.Button active block size="large" style={{ marginTop: 24 }} />
      </LoginBox>
    </LoginPage>
  );
}
