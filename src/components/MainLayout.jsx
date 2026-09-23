// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
// import { AiOutlineDashboard, AiOutlineLogout, AiOutlineUserSwitch } from "react-icons/ai";
// import { FaClipboardCheck, FaRegFileAlt, FaUsers, FaWpforms, FaUtensils } from "react-icons/fa";
// import { Layout, Menu, Button, theme } from "antd";
// import { Outlet } from "react-router-dom";
// import { PiUsersThreeDuotone } from "react-icons/pi";
// import { RiUserShared2Line } from "react-icons/ri";
// import { CiCircleList } from "react-icons/ci";
// import { MdOutlineLiveTv } from "react-icons/md";
// import { FaQrcode } from "react-icons/fa";
// const { Header, Sider, Content } = Layout;

// const MainLayout = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const { token: { colorBgContainer } } = theme.useToken();
//   const navigate = useNavigate();

//   // Safely parse user from localStorage — handle any shape
//   const raw = (() => {
//     try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
//   })();

//   const adminData = raw?.admin ?? {
//     role:  raw?.role  ?? "",
//     name:  raw?.name  ?? "",
//     email: raw?.email ?? "",
//   };

//   const isSubAdmin = adminData?.role === "subadmin";

//   return (
//     <Layout>
//       <Sider trigger={null} collapsible collapsed={collapsed}>
//         <div className="logo">
//           <h2 className="text-light fs-5 text-center py-2 mb-0">
//             <span className="sm-logo">MGM</span>
//             <span className="lg-logo">Mangal Grah Mandir</span>
//           </h2>
//         </div>
//         <Menu
//           theme="dark"
//           mode="inline"
//           defaultSelectedKeys={[""]}
//           onClick={({ key }) => {
//             if (key === "signout") {
//               localStorage.clear();
//                 navigate("/");
//               window.location.reload();

//             } else {
//               navigate(key);
//             }
//           }}
//           items={[
//             ...(!isSubAdmin ? [
//               {
//                 key: "",
//                 icon: <AiOutlineDashboard className="fs-4" />,
//                 label: "Contact Query",
//               },
//               {
//                 key: "user",
//                 icon: <RiUserShared2Line className="fs-4" />,
//                 label: "Admin",
//                 children: [
//                   { key: "add-admins", icon: <PiUsersThreeDuotone className="fs-4" />, label: "Add Admins" },
//                   { key: "admins",     icon: <AiOutlineUserSwitch  className="fs-4" />, label: "Admin List" },
//                 ],
//               },
//               {
//                 key: "live-link",
//                 icon: <MdOutlineLiveTv className="fs-4" />,
//                 label: "Live Darshan",
//                 children: [
//                   { key: "add-live-link", icon: <MdOutlineLiveTv className="fs-4" />, label: "Add Link"   },
//                   { key: "link-list",     icon: <CiCircleList    className="fs-4" />, label: "Live Link"  },
//                 ],
//               },


//             ] : []),
//             {
//               key: "catalog",
//               icon: <FaWpforms className="fs-4" />,
//               label: "Abhisheks Form Registration",
//               children: [
//                 { key: "bhomayag--registration",      icon: <CiCircleList className="fs-4" />, label: "Bhomayag Abhishek"          },
//                 { key: "panchamrit--registration",    icon: <CiCircleList className="fs-4" />, label: "Panchamrit Abhishek"        },
//                 { key: "hawanatmak--registration",    icon: <CiCircleList className="fs-4" />, label: "Hawanatmak Shanti Abhishek" },
//                 { key: "nitya--mangal--registration", icon: <CiCircleList className="fs-4" />, label: "Nitya Mangal Abhishek"      },
//                 { key: "special--registration",       icon: <CiCircleList className="fs-4" />, label: "Special Abhishek"           },
//                 { key: "abhishek--registration",      icon: <CiCircleList className="fs-4" />, label: "Abhishek"                   },
//                 { key: "donate",                      icon: <CiCircleList className="fs-4" />, label: "Donation"                   },
//               ],
//             },
//             { key: "temple-booking",  icon: <FaClipboardCheck className="fs-4" />, label: "Offline Booking"  },
//             { key: "booking-report",  icon: <FaRegFileAlt     className="fs-4" />, label: "Booking Report"   },
//             { key: "user-wise-report",icon: <FaUsers          className="fs-4" />, label: "Users Report"     },
//             { key: "offline-prasad",  icon: <FaUtensils       className="fs-4" />, label: "Prasad"           },

//              { key: "scan-ticket",  icon: <FaQrcode className="fs-4" />, label: "Scan Ticket"           },

//             { key: "signout",         icon: <AiOutlineLogout  className="fs-4" />, label: "Sign Out"         },
//           ]}
//         />
//       </Sider>

//       <Layout>
//         <Header
//           className="d-flex  py-1 justify-content-between ps-1 px-5"
//           style={{ padding: 0, background: colorBgContainer }}
//         >
//           <Button
//             type="text"
//             icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//             onClick={() => setCollapsed(!collapsed)}
//             style={{ fontSize: "15px", width: 50, height: 50,color:"white", fontWeight:"bold" }}
//           />

//           <div className="d-flex gap-3 align-items-center">
//             <img
//               height={32} width={32}
//               src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=338&ext=jpg"
//               alt="avatar"
//             />
//             <div>
//               <h5 className="mb-0">
//                 {adminData.name || "Admin"}
//                 {adminData.role ? ` (${adminData.role.toUpperCase()})` : ""}
//               </h5>
//               <p className="mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
//                 {adminData.email}
//               </p>
//             </div>
//           </div>
//         </Header>

//         <Content style={{ margin: "24px 16px", padding: 24, minHeight: 280, background: colorBgContainer }}>
//           <Outlet />
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default MainLayout;




import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined } from "@ant-design/icons";
import { AiOutlineDashboard, AiOutlineLogout, AiOutlineUserSwitch } from "react-icons/ai";
import { FaClipboardCheck, FaRegFileAlt, FaUsers, FaWpforms, FaUtensils } from "react-icons/fa";
import { Layout, Menu, Button, theme, Avatar, Dropdown, Tag, Space, Typography } from "antd";
import { Outlet } from "react-router-dom";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { RiUserShared2Line } from "react-icons/ri";
import { CiCircleList } from "react-icons/ci";
import { MdOutlineLiveTv, MdTempleHindu } from "react-icons/md";
import { FaQrcode } from "react-icons/fa";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, colorPrimary } } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  // Safely parse user from localStorage — handle any shape
  const raw = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();

  const adminData = raw?.admin ?? {
    role: raw?.role ?? "",
    name: raw?.name ?? "",
    email: raw?.email ?? "",
  };

  const isSubAdmin = adminData?.role === "subadmin";

  const signOut = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  // Highlight the menu item matching the current route
  const activeKey = location.pathname.replace(/^\//, "");

  const initials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "A";

  const accountMenuItems = [
    {
      key: "account-info",
      label: (
        <div style={{ padding: "4px 4px 8px", minWidth: 180 }}>
          <Text strong>{adminData.name || "Admin"}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {adminData.email}
          </Text>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "signout",
      icon: <AiOutlineLogout />,
      label: "Sign Out",
      danger: true,
      onClick: signOut,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: "#0f172a",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="logo"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 10,
            padding: collapsed ? "18px 0" : "18px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              flexShrink: 0,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${colorPrimary}, #f5a623)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MdTempleHindu size={19} color="#fff" />
          </div>
          {!collapsed && (
            <Text
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              Mangal Grah Mandir
            </Text>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          style={{ background: "transparent", marginTop: 8 }}
          onClick={({ key }) => {
            if (key === "signout") {
              signOut();
            } else {
              navigate(key);
            }
          }}
          items={[
            ...(!isSubAdmin ? [
              {
                key: "",
                icon: <AiOutlineDashboard className="fs-4" />,
                label: "Contact Query",
              },
              {
                key: "user",
                icon: <RiUserShared2Line className="fs-4" />,
                label: "Admin",
                children: [
                  { key: "add-admins", icon: <PiUsersThreeDuotone className="fs-4" />, label: "Add Admins" },
                  { key: "admins", icon: <AiOutlineUserSwitch className="fs-4" />, label: "Admin List" },
                ],
              },
              {
                key: "live-link",
                icon: <MdOutlineLiveTv className="fs-4" />,
                label: "Live Darshan",
                children: [
                  { key: "add-live-link", icon: <MdOutlineLiveTv className="fs-4" />, label: "Add Link" },
                  { key: "link-list", icon: <CiCircleList className="fs-4" />, label: "Live Link" },
                ],
              },


            ] : []),
            {
              key: "catalog",
              icon: <FaWpforms className="fs-4" />,
              label: "Abhisheks Form Registration",
              children: [
                { key: "bhomayag--registration", icon: <CiCircleList className="fs-4" />, label: "Bhomayag Abhishek" },
                { key: "panchamrit--registration", icon: <CiCircleList className="fs-4" />, label: "Panchamrit Abhishek" },
                { key: "hawanatmak--registration", icon: <CiCircleList className="fs-4" />, label: "Hawanatmak Shanti Abhishek" },
                { key: "nitya--mangal--registration", icon: <CiCircleList className="fs-4" />, label: "Nitya Mangal Abhishek" },
                { key: "special--registration", icon: <CiCircleList className="fs-4" />, label: "Special Abhishek" },
                { key: "abhishek--registration", icon: <CiCircleList className="fs-4" />, label: "Abhishek" },
                { key: "donate", icon: <CiCircleList className="fs-4" />, label: "Donation" },
              ],
            },
            { key: "temple-booking", icon: <FaClipboardCheck className="fs-4" />, label: "Offline Booking" },
            { key: "booking-report", icon: <FaRegFileAlt className="fs-4" />, label: "Booking Report" },
            { key: "user-wise-report", icon: <FaUsers className="fs-4" />, label: "Users Report" },
            // { key: "offline-prasad", icon: <FaUtensils className="fs-4" />, label: "Prasad" },
            { key: "scan-ticket", icon: <FaQrcode className="fs-4" />, label: "Scan Ticket" },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 20px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid rgba(5, 5, 5, 0.06)",
            position: "sticky",
            top: 0,
            zIndex: 10,
            boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.82)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 44, height: 44 }}
          />

          <Dropdown menu={{ items: accountMenuItems }} trigger={["click"]} placement="bottomRight">
            <Space style={{ cursor: "pointer", padding: "6px 10px", borderRadius: 8 }}>
              <Avatar
                size={36}
                style={{ backgroundColor: colorPrimary, fontWeight: 600 }}
              >
                {initials(adminData.name)}
              </Avatar>
              <div style={{ lineHeight: 1.2, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Text strong>{adminData.name || "Admin"}</Text>
                  {adminData.role && (
                    <Tag color={isSubAdmin ? "gold" : "blue"} style={{ marginRight: 0, fontSize: 11, lineHeight: "16px" }}>
                      {adminData.role.toUpperCase()}
                    </Tag>
                  )}
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {adminData.email}
                </Text>
              </div>
              <DownOutlined style={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }} />
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: 12,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;