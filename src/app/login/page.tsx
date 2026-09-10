"use client";

import { Form, Input, Button, Alert, Card, Typography } from "antd";
import { LockOutlined, UserOutlined, LoginOutlined, ApartmentOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = styled.main`min-height:100vh;display:grid;place-items:center;padding:20px;background:linear-gradient(135deg,#1a1f36,#2d3561);`;
const Box = styled(Card)`width:min(100%,420px);border:0;border-radius:22px;box-shadow:0 25px 60px rgba(0,0,0,.3);.ant-card-body{padding:36px;}`;
const Mark = styled.div`width:68px;height:68px;margin:0 auto 16px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(135deg,#ff6b00,#e05e00);color:#fff;font-size:30px;`;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onFinish = async (values: { username: string; password: string }) => {
    setError(""); setLoading(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.error || "เข้าสู่ระบบไม่สำเร็จ"); }
      router.replace("/");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "เชื่อมต่อระบบไม่ได้"); }
    finally { setLoading(false); }
  };
  return <Page><Box><Mark><ApartmentOutlined /></Mark><Typography.Title level={3} style={{ textAlign: "center", marginBottom: 4 }}>Construction Pro</Typography.Title><Typography.Paragraph type="secondary" style={{ textAlign: "center", marginBottom: 24 }}>ระบบบริหารงานก่อสร้าง</Typography.Paragraph>{error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}<Form layout="vertical" onFinish={onFinish}><Form.Item name="username" label="ชื่อผู้ใช้" rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}><Input size="large" prefix={<UserOutlined />} /></Form.Item><Form.Item name="password" label="รหัสผ่าน" rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}><Input.Password size="large" prefix={<LockOutlined />} /></Form.Item><Button type="primary" htmlType="submit" size="large" block icon={<LoginOutlined />} loading={loading} style={{ background: "#ff6b00", borderColor: "#ff6b00" }}>เข้าสู่ระบบ</Button></Form></Box></Page>;
}
