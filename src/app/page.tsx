"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Badge, Button, Card, Col, Layout, List, Menu, Progress, Row, Statistic, Tag, Typography } from "antd";
import type { MenuProps } from "antd";
import { ApartmentOutlined, BarChartOutlined, BellOutlined, BoxPlotOutlined, CameraOutlined, CheckCircleOutlined, ClockCircleOutlined, DashboardOutlined, DollarOutlined, FileTextOutlined, MenuOutlined, LogoutOutlined, TeamOutlined, TruckOutlined, UserSwitchOutlined } from "@ant-design/icons";
import type { ComponentType } from "react";
import styled from "styled-components";
import { apiEnabled, apiFetch } from "@/lib/api";

const { Sider, Header, Content } = Layout;
const { Text, Title } = Typography;
const orange = "#ff6b00";

type Project = { code: string; name: string; client: string; status: string; color: "orange" | "green"; assigned: number; income: string; budget: string; expense: string; expensePct: number };
type Activity = { title: string; detail: string; value: string; avatar?: string };
type DashboardStats = { projects: number; income: number; balance: number; pendingExpenses: number; pendingMaterials: number; checkins: number };
type DashboardData = { stats: DashboardStats; projects: Project[]; expenses: Activity[]; attendance: Activity[] };
type StatItem = readonly [ComponentType, string, string, string];

const money = (value: number) => `฿${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const fallbackData: DashboardData = {
  stats: { projects: 12, income: 1240000, balance: 876420.5, pendingExpenses: 8, pendingMaterials: 5, checkins: 18 },
  projects: [
    { code: "PRJ-20260405-001", name: "งานต่อเติมอาคารธรรมชาติ", client: "บริษัท ธรรมชาติ จำกัด", status: "กำลังดำเนินการ", color: "orange", assigned: 4, income: "฿100,000.00", budget: "฿450,000.00", expense: "฿47,521.92", expensePct: 11 },
    { code: "PRJ-20260401-002", name: "โครงการนิทรรศการกลางแจ้ง", client: "ศูนย์เรียนรู้เมือง", status: "กำลังดำเนินการ", color: "orange", assigned: 8, income: "฿280,000.00", budget: "฿600,000.00", expense: "฿120,400.00", expensePct: 20 },
    { code: "PRJ-20260320-003", name: "ปรับปรุงสำนักงานชั้น 2", client: "บริษัท เอ จำกัด", status: "เสร็จสิ้น", color: "green", assigned: 0, income: "฿320,000.00", budget: "฿320,000.00", expense: "฿276,500.00", expensePct: 86 },
  ],
  expenses: [{ title: "ค่าวัสดุก่อสร้าง", detail: "งานต่อเติมอาคารธรรมชาติ", value: "฿24,500.00" }, { title: "ค่าน้ำมันรถขนของ", detail: "โครงการนิทรรศการ", value: "฿3,200.00" }],
  attendance: [{ title: "นที แสงทอง", detail: "ไซต์งาน PRJ-20260405-001", value: "08:02 น.", avatar: "น" }, { title: "กิตติ ช่างดี", detail: "ออฟฟิศ", value: "07:48 น.", avatar: "ก" }],
};

const menuItems: MenuProps["items"] = [
  { type: "group", label: "ภาพรวม", children: [{ key: "dashboard", icon: <DashboardOutlined />, label: "แดชบอร์ด" }] },
  { type: "group", label: "โครงการ", children: [{ key: "projects", icon: <ApartmentOutlined />, label: "จัดการโครงการ" }, { key: "assignments", icon: <UserSwitchOutlined />, label: "มอบหมายงาน" }, { key: "materials", icon: <TruckOutlined />, label: "สั่งซื้อวัสดุ" }] },
  { type: "group", label: "การเงิน", children: [{ key: "cashflow", icon: <BarChartOutlined />, label: "กระแสเงินสด" }, { key: "expenses", icon: <FileTextOutlined />, label: "ใบเสร็จค่าใช้จ่าย" }, { key: "wages", icon: <DollarOutlined />, label: "ค่าแรง" }] },
  { type: "group", label: "ทีมงาน", children: [{ key: "attendance", icon: <ClockCircleOutlined />, label: "การเข้างาน" }, { key: "updates", icon: <CameraOutlined />, label: "อัพเดทไซต์งาน" }, { key: "users", icon: <TeamOutlined />, label: "จัดการพนักงาน" }] },
];

const Shell = styled(Layout)`&&{min-height:100vh;background:#f0f2f8;display:flex;flex-direction:row;align-items:stretch;}`;
const Side = styled(Sider)<{ $open: boolean }>`&&{background:#0f1626!important;flex:0 0 258px!important;max-width:258px!important;min-width:258px!important;width:258px!important;}.ant-layout-sider-children{display:flex;flex-direction:column;background:#0f1626;}@media(max-width:767px){&&{position:fixed!important;inset:0 auto 0 0!important;height:100vh!important;z-index:1001;box-shadow:8px 0 24px rgba(0,0,0,.18);transform:translateX(${(p) => (p.$open ? "0" : "-100%")});transition:transform .2s ease;}}`;
const MainArea = styled(Layout)`&&{min-width:0;flex:1 1 auto;background:#f0f2f8;}`;
const Brand = styled.div`display:flex;align-items:center;gap:12px;min-height:81px;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.06);color:#fff;`;
const BrandIcon = styled.div`width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#ff6b00,#e05e00);display:grid;place-items:center;font-size:20px;color:#fff;flex:0 0 40px;`;
const BrandText = styled.div`min-width:0;strong{display:block;font-size:14px;line-height:1.2;color:#fff;white-space:nowrap;}span{display:block;color:rgba(255,255,255,.46);font-size:11px;line-height:1.2;margin-top:3px;white-space:nowrap;}`;
const Nav = styled(Menu)`&&{flex:1;background:transparent!important;border-inline-end:0!important;padding:12px 10px;color:rgba(255,255,255,.72);}&& .ant-menu-item-group-title{color:rgba(255,255,255,.36);font-size:10px;padding:13px 14px 6px;line-height:1.2;}&& .ant-menu-item{color:rgba(255,255,255,.68);border-radius:8px;margin:3px 0;width:100%;height:40px;line-height:40px;}&& .ant-menu-item .ant-menu-title-content{color:inherit;}&& .ant-menu-item-selected{background:rgba(255,107,0,.16)!important;color:#fff!important;}&& .ant-menu-item:hover{color:#fff!important;background:rgba(255,255,255,.06);}`;
const UserArea = styled.div`padding:16px 20px;border-top:1px solid rgba(255,255,255,.06);color:#fff;`;
const User = styled.div`display:flex;align-items:center;gap:10px;margin-bottom:12px;strong{display:block;font-size:12px;}span{display:block;color:rgba(255,255,255,.4);font-size:10px;}`;
const MainHeader = styled(Header)`&&{height:64px;line-height:1;background:#fff!important;padding:0 24px;border-bottom:1px solid #e8ecf0;display:flex;justify-content:space-between;align-items:center;color:#1a1f36;}@media(max-width:767px){&&{padding:0 12px;}}.header-date{display:block;}@media(max-width:480px){.header-date{display:none;}}`;
const PageContent = styled(Content)`&&{padding:24px;overflow:auto;background:#f0f2f8;}@media(min-width:768px){&& .ant-col-lg-3{flex:0 0 25%;max-width:25%;}}@media(max-width:1200px){&&{padding:18px;}}@media(max-width:767px){&&{padding:12px;}&& .ant-col-xs-12{flex:0 0 50%;max-width:50%;}}`;
const Panel = styled(Card)`&&{height:100%;border:1px solid #f0f2f8;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.04);overflow:hidden;background:#fff;}&& .ant-card-head{min-height:54px;border-bottom:1px solid #f0f2f8;padding:0 18px;}&& .ant-card-head-title{font-size:14px;font-weight:800;color:#1a1f36;}&& .ant-card-extra{padding:0;}&& .ant-card-body{padding:16px;}`;
const Stat = styled(Card)`&&{height:100%;border:1px solid #f0f2f8;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.04);background:#fff;overflow:hidden;}&& .ant-card-body{min-width:0;padding:16px;display:flex;align-items:center;gap:13px;height:100%;}&& .ant-statistic{min-width:0;}&& .ant-statistic-title{font-size:11px;color:#94a3b8;margin-bottom:2px;white-space:normal;}&& .ant-statistic-content{font-size:clamp(15px,1.55vw,20px);font-weight:800;color:#1a1f36;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}@media(max-width:767px){&& .ant-card-body{padding:12px;gap:9px;}&& .ant-statistic-title{font-size:10px;}&& .ant-statistic-content{font-size:15px;}}`;
const StatIcon = styled.div<{ $tone: string }>`width:46px;height:46px;border-radius:13px;display:grid;place-items:center;font-size:20px;color:${(p) => p.$tone};background:${(p) => `${p.$tone}16`};flex-shrink:0;@media(max-width:767px){width:36px;height:36px;font-size:16px;}`;
const ProjectBox = styled.div<{ $tone: string }>`padding:12px;border:1px solid #f0f2f8;border-top:3px solid ${(p) => p.$tone};border-radius:12px;margin-bottom:8px;&:last-child{margin-bottom:0;}h3{font-size:13px;margin:2px 0;color:#1a1f36;}p{font-size:11px;color:#64748b;margin:0;}`;
const ProjectTop = styled.div`display:flex;justify-content:space-between;gap:12px;@media(max-width:480px){display:block;}`;
const Code = styled.div`font-size:10px;font-weight:700;color:#ff6b00;`;
const Meta = styled.div`text-align:right;white-space:nowrap;@media(max-width:480px){text-align:left;margin-top:8px;}`;
const BarLabel = styled.div`display:flex;justify-content:space-between;gap:8px;color:#94a3b8;font-size:10px;margin-top:9px;span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}span+span{text-align:right;}`;
const ProjectProgress = styled(Progress)`&&{display:block;margin-top:4px;}&& .ant-progress-outer{display:block;padding-inline-end:0;}&& .ant-progress-inner{display:block;width:100%;background:#eef0f2;}`;
const Donut = styled.div`width:142px;height:142px;border-radius:50%;background:conic-gradient(#ff6b00 0 58%,#2e7d32 58% 83%,#1565c0 83%);display:grid;place-items:center;margin:6px auto 14px;position:relative;&:after{content:"";position:absolute;width:94px;height:94px;border-radius:50%;background:#fff;}& div{position:relative;z-index:1;text-align:center;}strong{display:block;font-size:25px;color:#1a1f36;}span{font-size:11px;color:#94a3b8;}`;
const Legend = styled.div`display:grid;gap:7px;font-size:12px;color:#64748b;span{display:flex;align-items:center;gap:7px;}b{margin-left:auto;color:#1a1f36;}`;
const Dot = styled.i<{ $color: string }>`width:9px;height:9px;border-radius:3px;background:${(p) => p.$color};display:inline-block;`;
const QuickLinks = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:15px;a{background:#f8fafc;border-radius:8px;padding:8px 10px;font-size:11px;color:#475569;}b{color:#ff6b00;}`;
const ActivityItem = styled.div`display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f0f2f8;`;
const ActivityText = styled.div`flex:1;min-width:0;strong{display:block;font-size:12px;color:#1a1f36;}span{display:block;font-size:11px;color:#94a3b8;margin-top:2px;}`;
const Overlay = styled.button<{ $show: boolean }>`display:none;border:0;background:rgba(15,22,38,.48);position:fixed;inset:0;z-index:1000;@media(max-width:767px){display:${(p) => (p.$show ? "block" : "none")};}`;

function ProjectCard({ project }: { project: Project }) {
  const tone = project.color === "green" ? "#2e7d32" : orange;
  return <ProjectBox $tone={tone}><ProjectTop><div><Code>{project.code}</Code><h3>{project.name}</h3><p>{project.client}</p></div><Meta><Tag color={project.color}>{project.status}</Tag><Text type="secondary" style={{ display: "block", fontSize: 10 }}>{project.assigned} ช่างวันนี้</Text></Meta></ProjectTop><BarLabel><span>รับ {project.income}</span><span>งบ {project.budget}</span></BarLabel><ProjectProgress percent={project.color === "green" ? 100 : 62} showInfo={false} strokeColor="#2e7d32" size="small" /><BarLabel><span>ใช้ {project.expense}</span><span>{project.expensePct}%</span></BarLabel><ProjectProgress percent={project.expensePct} showInfo={false} strokeColor="#c62828" size="small" /></ProjectBox>;
}

function ActivityList({ items, attendanceMode = false }: { items: Activity[]; attendanceMode?: boolean }) {
  return <List<Activity> dataSource={items} rowKey="title" renderItem={(item) => <ActivityItem>{attendanceMode && <Avatar style={{ background: "#e3f2fd", color: "#1565c0" }}>{item.avatar}</Avatar>}<ActivityText><strong>{item.title}</strong><span>{item.detail}</span></ActivityText>{attendanceMode ? <Tag color="green">{item.value}</Tag> : <Text strong>{item.value}</Text>}</ActivityItem>} />;
}

export default function Home() {
  const router = useRouter();
  const logout = async () => { await apiFetch("/auth/logout", { method: "POST" }); router.replace("/login"); };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState(fallbackData);
  const stats: StatItem[] = [[ApartmentOutlined, "โครงการทั้งหมด", String(data.stats.projects), orange], [BarChartOutlined, "รายรับรวม", money(data.stats.income), "#1565c0"], [DollarOutlined, "คงเหลือ", money(data.stats.balance), "#2e7d32"], [FileTextOutlined, "รออนุมัติ (บิล)", String(data.stats.pendingExpenses), "#c62828"], [DollarOutlined, "ค่าแรงค้างจ่าย", "฿125,600.00", "#e65100"], [BoxPlotOutlined, "คำขอวัสดุรอ", String(data.stats.pendingMaterials), "#1565c0"], [ClockCircleOutlined, "เช็คอินวันนี้", String(data.stats.checkins), "#2e7d32"], [CheckCircleOutlined, "กำลังดำเนินการ", "7", "#6a1b9a"]];

  useEffect(() => {
    if (!apiEnabled) return;
    apiFetch("/auth/me").then((response) => {
      if (response.status === 401) router.replace("/login");
      return response.ok;
    }).catch(() => undefined);
    apiFetch("/dashboard").then((response) => response.ok ? response.json() : null).then((apiData) => {
      if (apiData?.projects && apiData?.stats) {
        const projects = apiData.projects.map((project: Record<string, string | number>) => ({
          ...project,
          color: project.status === "completed" ? "green" : "orange",
          assigned: Number(project.assigned ?? 0),
          income: money(Number(project.income ?? 0)),
          budget: money(Number(project.budget ?? 0)),
          expense: money(Number(project.expense ?? 0)),
          expensePct: Number(project.budget) > 0 ? Math.round((Number(project.expense) / Number(project.budget)) * 100) : 0,
        })) as Project[];
        setData({ ...fallbackData, stats: apiData.stats, projects });
      }
    }).catch(() => undefined);
  }, [router]);

  useEffect(() => {
    const handleLogoutClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest("button");
      if (button?.textContent?.includes("ออกจากระบบ")) logout();
    };
    document.addEventListener("click", handleLogoutClick);
    return () => document.removeEventListener("click", handleLogoutClick);
  });

  return <Shell><Overlay $show={mobileMenuOpen} aria-label="ปิดเมนู" onClick={() => setMobileMenuOpen(false)} /><Side $open={mobileMenuOpen} width={258} trigger={null}><Brand><BrandIcon><ApartmentOutlined /></BrandIcon><BrandText><strong>Construction Pro</strong><span>Management System</span></BrandText></Brand><Nav mode="inline" theme="dark" items={menuItems} selectedKeys={["dashboard"]} /><UserArea><User><Avatar style={{ background: orange }}>ส</Avatar><div><strong>สมชาย ใจดี</strong><span>Super Admin</span></div></User><Button block ghost icon={<LogoutOutlined />} style={{ color: "rgba(255,255,255,.6)", borderColor: "rgba(255,255,255,.1)" }}>ออกจากระบบ</Button></UserArea></Side><MainArea><MainHeader><div style={{ display: "flex", alignItems: "center", gap: 14 }}><Button type="text" icon={<MenuOutlined />} onClick={() => setMobileMenuOpen((open) => !open)} /><Title level={4} style={{ margin: 0 }}>แดชบอร์ด</Title></div><div style={{ display: "flex", alignItems: "center", gap: 18 }}><Text type="secondary" className="header-date">15 เมษายน 2569</Text><Badge count={3} size="small"><Button shape="circle" icon={<BellOutlined />} /></Badge></div></MainHeader><PageContent><Row gutter={[14, 14]}>{stats.map(([Icon, label, value, tone]) => <Col xs={12} sm={6} lg={3} key={label}><Stat><StatIcon $tone={tone}><Icon /></StatIcon><Statistic title={label} value={value} /></Stat></Col>)}</Row><Row gutter={[14, 14]} style={{ marginTop: 14 }}><Col xs={24} lg={9}><Panel title={<><BarChartOutlined style={{ color: orange }} /> สถานะโครงการ</>}><Donut><div><strong>12</strong><span>โครงการ</span></div></Donut><Legend><span><Dot $color="#ff6b00" />กำลังดำเนินการ <b>7</b></span><span><Dot $color="#2e7d32" />เสร็จสิ้น <b>3</b></span><span><Dot $color="#1565c0" />ส่งมอบแล้ว <b>2</b></span></Legend><QuickLinks><a href="#">▦ โครงการ</a><a href="#">▰ วัสดุ <b>5</b></a><a href="#">฿ ค้างจ่าย</a><a href="#">⌁ cashflow</a></QuickLinks></Panel></Col><Col xs={24} lg={15}><Panel title={<><ApartmentOutlined style={{ color: orange }} /> โครงการล่าสุด</>} extra={<Button type="link" size="small">ดูทั้งหมด</Button>}>{data.projects.map((project) => <ProjectCard project={project} key={project.code} />)}</Panel></Col></Row><Row gutter={[14, 14]} style={{ marginTop: 14 }}><Col xs={24} lg={12}><Panel title={<><FileTextOutlined style={{ color: "#c62828" }} /> ค่าใช้จ่ายรออนุมัติ</>} extra={<Button type="link" size="small" danger>ดูทั้งหมด</Button>}><ActivityList items={data.expenses} /></Panel></Col><Col xs={24} lg={12}><Panel title={<><ClockCircleOutlined style={{ color: "#1565c0" }} /> การเข้างานวันนี้</>} extra={<Button type="link" size="small">ดูทั้งหมด</Button>}><ActivityList items={data.attendance} attendanceMode /></Panel></Col></Row></PageContent></MainArea></Shell>;
}
