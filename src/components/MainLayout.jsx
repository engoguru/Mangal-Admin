import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { AiOutlineDashboard, AiOutlineLogout, AiOutlineUserSwitch } from "react-icons/ai";
import { FaClipboardCheck, FaRegFileAlt, FaUsers, FaWpforms, FaQrcode } from "react-icons/fa";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { RiUserShared2Line } from "react-icons/ri";
import { CiCircleList } from "react-icons/ci";
import { MdOutlineLiveTv, MdTempleHindu, MdMenu, MdClose, MdKeyboardArrowDown } from "react-icons/md";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);   // desktop: icon-only rail
  const [mobileOpen, setMobileOpen] = useState(false); // mobile: off-canvas drawer
  const [openGroups, setOpenGroups] = useState({});
  const [accountOpen, setAccountOpen] = useState(false);
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

  // Highlight the menu item matching the current route (/admin/<key>)
  const activeKey = location.pathname.replace(/^\/admin\/?/, "").replace(/\/$/, "");

  const initials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "A";

  const items = [
    ...(!isSubAdmin ? [
      { key: "", icon: <AiOutlineDashboard />, label: "Contact Query" },
      {
        key: "user", icon: <RiUserShared2Line />, label: "Admin",
        children: [
          { key: "add-admins", icon: <PiUsersThreeDuotone />, label: "Add Admins" },
          { key: "admins", icon: <AiOutlineUserSwitch />, label: "Admin List" },
        ],
      },
      {
        key: "live-link", icon: <MdOutlineLiveTv />, label: "Live Darshan",
        children: [
          { key: "add-live-link", icon: <MdOutlineLiveTv />, label: "Add Link" },
          { key: "link-list", icon: <CiCircleList />, label: "Live Link" },
        ],
      },
    ] : []),
    {
      key: "catalog", icon: <FaWpforms />, label: "Abhisheks Form Registration",
      children: [
        { key: "bhomayag--registration", icon: <CiCircleList />, label: "Bhomayag Abhishek" },
        { key: "panchamrit--registration", icon: <CiCircleList />, label: "Panchamrit Abhishek" },
        { key: "hawanatmak--registration", icon: <CiCircleList />, label: "Hawanatmak Shanti Abhishek" },
        { key: "nitya--mangal--registration", icon: <CiCircleList />, label: "Nitya Mangal Abhishek" },
        { key: "special--registration", icon: <CiCircleList />, label: "Special Abhishek" },
        { key: "abhishek--registration", icon: <CiCircleList />, label: "Abhishek" },
        { key: "donate", icon: <CiCircleList />, label: "Donation" },
      ],
    },
    { key: "temple-booking", icon: <FaClipboardCheck />, label: "Offline Booking" },
    { key: "booking-report", icon: <FaRegFileAlt />, label: "Booking Report" },
    { key: "user-wise-report", icon: <FaUsers />, label: "Users Report" },
    // { key: "offline-prasad", icon: <FaUtensils />, label: "Prasad" },
    { key: "scan-ticket", icon: <FaQrcode />, label: "Scan Ticket" },
  ];

  // Auto-open the group that contains the active page; close drawer on navigation
  useEffect(() => {
    items.forEach((it) => {
      if (it.children?.some((c) => c.key === activeKey)) {
        setOpenGroups((g) => ({ ...g, [it.key]: true }));
      }
    });
    setMobileOpen(false);
    setAccountOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const go = (key) => navigate(key);

  const itemBase =
    "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.95rem] font-medium transition";
  const itemState = (active) =>
    active
      ? "bg-linear-to-r from-crimson to-sindoor text-white shadow-glow"
      : "text-white/75 hover:bg-white/10 hover:text-white";

  const NavList = ({ rail }) => (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {items.map((it) => {
        if (!it.children) {
          return (
            <button key={it.key || "root"} onClick={() => go(it.key)} title={rail ? it.label : undefined}
              className={`${itemBase} ${itemState(activeKey === it.key)} ${rail ? "justify-center px-0" : ""}`}>
              <span className="text-xl">{it.icon}</span>
              {!rail && <span className="truncate">{it.label}</span>}
            </button>
          );
        }
        const isOpen = !!openGroups[it.key];
        const hasActive = it.children.some((c) => c.key === activeKey);
        return (
          <div key={it.key}>
            <button
              onClick={() => (rail ? (setCollapsed(false), setOpenGroups((g) => ({ ...g, [it.key]: true }))) : setOpenGroups((g) => ({ ...g, [it.key]: !g[it.key] })))}
              title={rail ? it.label : undefined}
              className={`${itemBase} ${hasActive && !isOpen ? "bg-white/10 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"} ${rail ? "justify-center px-0" : ""}`}
            >
              <span className="text-xl">{it.icon}</span>
              {!rail && (
                <>
                  <span className="flex-1 truncate">{it.label}</span>
                  <MdKeyboardArrowDown className={`text-xl transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </>
              )}
            </button>
            {!rail && isOpen && (
              <div className="mb-1 ml-5 mt-1 space-y-0.5 border-l border-gold/30 pl-3">
                {it.children.map((c) => (
                  <button key={c.key} onClick={() => go(c.key)}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition ${
                      activeKey === c.key ? "bg-gold/20 font-semibold text-gold-soft" : "text-white/65 hover:bg-white/10 hover:text-white"
                    }`}>
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  const Brand = ({ rail }) => (
    <div className={`flex items-center gap-3 border-b border-white/10 px-4 py-4 ${rail ? "justify-center px-0" : ""}`}>
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-crimson to-gold text-white shadow-glow">
        <MdTempleHindu size={22} />
      </div>
      {!rail && (
        <div className="min-w-0 leading-tight">
          <p className="truncate font-display text-lg text-white">Mangal Grah Mandir</p>
          <p className="text-xs text-gold-soft/80">Admin Panel</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-svh bg-paper">

      {/* Desktop sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 hidden flex-col bg-maroon shadow-2xl transition-[width] duration-300 lg:flex ${collapsed ? "w-20" : "w-72"}`}>
        <Brand rail={collapsed} />
        <NavList rail={collapsed} />
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setMobileOpen(false)} />
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[82%] max-w-xs flex-col bg-maroon shadow-2xl transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between pr-3">
          <div className="flex-1"><Brand /></div>
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-full text-xl text-white/80 hover:bg-white/10"><MdClose /></button>
        </div>
        <NavList />
        <div className="border-t border-white/10 p-3">
          <button onClick={signOut} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white/10 font-semibold text-white transition hover:bg-white/15">
            <AiOutlineLogout /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className={`transition-[padding] duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}>

        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-white/85 px-3 backdrop-blur-md sm:px-6">
          <button
            onClick={() => (window.matchMedia("(min-width:1024px)").matches ? setCollapsed(!collapsed) : setMobileOpen(true))}
            aria-label="Toggle menu"
            className="grid size-11 place-items-center rounded-xl text-2xl text-maroon transition hover:bg-maroon/5 active:scale-95"
          >
            <MdMenu />
          </button>

          <div className="relative">
            <button onClick={() => setAccountOpen(!accountOpen)} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition hover:bg-maroon/5">
              <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-crimson to-sindoor font-bold text-white">{initials(adminData.name)}</span>
              <span className="hidden leading-tight sm:block">
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-maroon">{adminData.name || "Admin"}</span>
                  {adminData.role && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${isSubAdmin ? "bg-gold/30 text-maroon" : "bg-sindoor/10 text-sindoor"}`}>
                      {adminData.role.toUpperCase()}
                    </span>
                  )}
                </span>
                <span className="block max-w-56 truncate text-xs text-muted">{adminData.email}</span>
              </span>
              <MdKeyboardArrowDown className={`hidden text-lg text-muted transition-transform sm:block ${accountOpen ? "rotate-180" : ""}`} />
            </button>

            {accountOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setAccountOpen(false)} />
                <div className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                  <div className="border-b border-line p-4">
                    <p className="font-semibold text-maroon">{adminData.name || "Admin"}</p>
                    <p className="truncate text-sm text-muted">{adminData.email}</p>
                  </div>
                  <button onClick={signOut} className="flex w-full items-center gap-2 px-4 py-3 text-left font-medium text-red-600 transition hover:bg-red-50">
                    <AiOutlineLogout /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="page-content mx-auto w-full max-w-[1600px] p-2 sm:p-6">
          <div className="min-h-[60svh] rounded-2xl border border-line bg-white p-3 shadow-card sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
