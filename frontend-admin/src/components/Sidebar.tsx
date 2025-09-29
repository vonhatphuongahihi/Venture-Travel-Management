import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";

const navItems = [
  {
    to: "/overview",
    label: "Tổng quan",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M8.25 2.75H3.66667C3.16041 2.75 2.75 3.16041 2.75 3.66667V10.0833C2.75 10.5896 3.16041 11 3.66667 11H8.25C8.75626 11 9.16667 10.5896 9.16667 10.0833V3.66667C9.16667 3.16041 8.75626 2.75 8.25 2.75Z"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M18.3334 2.75H13.75C13.2438 2.75 12.8334 3.16041 12.8334 3.66667V6.41667C12.8334 6.92293 13.2438 7.33333 13.75 7.33333H18.3334C18.8396 7.33333 19.25 6.92293 19.25 6.41667V3.66667C19.25 3.16041 18.8396 2.75 18.3334 2.75Z"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M18.3334 11H13.75C13.2438 11 12.8334 11.4104 12.8334 11.9167V18.3333C12.8334 18.8396 13.2438 19.25 13.75 19.25H18.3334C18.8396 19.25 19.25 18.8396 19.25 18.3333V11.9167C19.25 11.4104 18.8396 11 18.3334 11Z"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.25 14.6665H3.66667C3.16041 14.6665 2.75 15.0769 2.75 15.5832V18.3332C2.75 18.8394 3.16041 19.2498 3.66667 19.2498H8.25C8.75626 19.2498 9.16667 18.8394 9.16667 18.3332V15.5832C9.16667 15.0769 8.75626 14.6665 8.25 14.6665Z"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
  {
    to: "/tours",
    label: "Tour",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M3.66663 13.7502C3.66663 13.7502 4.58329 12.8335 7.33329 12.8335C10.0833 12.8335 11.9166 14.6668 14.6666 14.6668C17.4166 14.6668 18.3333 13.7502 18.3333 13.7502V2.75016C18.3333 2.75016 17.4166 3.66683 14.6666 3.66683C11.9166 3.66683 10.0833 1.8335 7.33329 1.8335C4.58329 1.8335 3.66663 2.75016 3.66663 2.75016V13.7502Z"
          stroke="currentColor"
          stroke-width="1.46"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3.66663 20.1667V13.75"
          stroke="currentColor"
          stroke-width="1.46"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
  {
    to: "/bookings",
    label: "Đặt tour",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M18.3334 6.4165H3.66671C2.65419 6.4165 1.83337 7.23732 1.83337 8.24984V17.4165C1.83337 18.429 2.65419 19.2498 3.66671 19.2498H18.3334C19.3459 19.2498 20.1667 18.429 20.1667 17.4165V8.24984C20.1667 7.23732 19.3459 6.4165 18.3334 6.4165Z"
          stroke="currentColor"
          stroke-width="1.46"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14.6667 19.25V4.58333C14.6667 4.0971 14.4736 3.63079 14.1297 3.28697C13.7859 2.94315 13.3196 2.75 12.8334 2.75H9.16671C8.68048 2.75 8.21416 2.94315 7.87035 3.28697C7.52653 3.63079 7.33337 4.0971 7.33337 4.58333V19.25"
          stroke="currentColor"
          stroke-width="1.46"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
  {
    to: "/places",
    label: "Điểm đến",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M18.3333 9.16634C18.3333 13.7433 13.2559 18.5099 11.5509 19.9821C11.392 20.1015 11.1987 20.1661 11 20.1661C10.8012 20.1661 10.6079 20.1015 10.449 19.9821C8.74404 18.5099 3.66663 13.7433 3.66663 9.16634C3.66663 7.22142 4.43924 5.35616 5.81451 3.98089C7.18978 2.60562 9.05504 1.83301 11 1.83301C12.9449 1.83301 14.8101 2.60562 16.1854 3.98089C17.5607 5.35616 18.3333 7.22142 18.3333 9.16634Z"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M11 11.917C12.5188 11.917 13.75 10.6858 13.75 9.16699C13.75 7.64821 12.5188 6.41699 11 6.41699C9.48122 6.41699 8.25 7.64821 8.25 9.16699C8.25 10.6858 9.48122 11.917 11 11.917Z"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
  {
    to: "/reports",
    label: "Báo cáo",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M13.75 1.83301H5.49996C5.01373 1.83301 4.54741 2.02616 4.2036 2.36998C3.85978 2.7138 3.66663 3.18011 3.66663 3.66634V18.333C3.66663 18.8192 3.85978 19.2856 4.2036 19.6294C4.54741 19.9732 5.01373 20.1663 5.49996 20.1663H16.5C16.9862 20.1663 17.4525 19.9732 17.7963 19.6294C18.1401 19.2856 18.3333 18.8192 18.3333 18.333V6.41634L13.75 1.83301Z"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.8334 1.83301V5.49967C12.8334 5.9859 13.0265 6.45222 13.3703 6.79604C13.7142 7.13985 14.1805 7.33301 14.6667 7.33301H18.3334"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.16671 8.25H7.33337"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14.6667 11.917H7.33337"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14.6667 15.583H7.33337"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
  {
    to: "/users",
    label: "Người dùng",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M14.6667 19.25V17.4167C14.6667 16.4442 14.2804 15.5116 13.5928 14.8239C12.9051 14.1363 11.9725 13.75 11 13.75H5.50004C4.52758 13.75 3.59495 14.1363 2.90732 14.8239C2.21968 15.5116 1.83337 16.4442 1.83337 17.4167V19.25"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14.6666 2.86719C15.4529 3.07103 16.1492 3.53018 16.6463 4.17258C17.1434 4.81498 17.4131 5.60425 17.4131 6.41652C17.4131 7.22879 17.1434 8.01807 16.6463 8.66046C16.1492 9.30286 15.4529 9.76202 14.6666 9.96585"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M20.1666 19.25V17.4166C20.166 16.6042 19.8956 15.815 19.3979 15.1729C18.9001 14.5308 18.2032 14.0722 17.4166 13.8691"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.25004 10.0833C10.2751 10.0833 11.9167 8.44171 11.9167 6.41667C11.9167 4.39162 10.2751 2.75 8.25004 2.75C6.225 2.75 4.58337 4.39162 4.58337 6.41667C4.58337 8.44171 6.225 10.0833 8.25004 10.0833Z"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
  {
    to: "/settings",
    label: "Cài đặt",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M11.2017 1.83301H10.7983C10.3121 1.83301 9.84579 2.02616 9.50197 2.36998C9.15816 2.7138 8.965 3.18011 8.965 3.66634V3.83134C8.96467 4.15284 8.8798 4.4686 8.71891 4.74694C8.55802 5.02529 8.32676 5.25643 8.04833 5.41717L7.65417 5.64634C7.37547 5.80725 7.05932 5.89196 6.7375 5.89196C6.41568 5.89196 6.09954 5.80725 5.82084 5.64634L5.68333 5.57301C5.26264 5.33033 4.76285 5.2645 4.29367 5.38996C3.82449 5.51542 3.42426 5.82192 3.18084 6.24217L2.97917 6.59051C2.73649 7.0112 2.67066 7.51099 2.79612 7.98017C2.92158 8.44936 3.22808 8.84959 3.64834 9.09301L3.78584 9.18468C4.06292 9.34464 4.29332 9.57434 4.45413 9.85094C4.61494 10.1275 4.70057 10.4414 4.7025 10.7613V11.2288C4.70378 11.5519 4.61968 11.8695 4.45871 12.1496C4.29774 12.4297 4.06561 12.6623 3.78584 12.8238L3.64834 12.9063C3.22808 13.1498 2.92158 13.55 2.79612 14.0192C2.67066 14.4884 2.73649 14.9882 2.97917 15.4088L3.18084 15.7572C3.42426 16.1774 3.82449 16.4839 4.29367 16.6094C4.76285 16.7349 5.26264 16.669 5.68333 16.4263L5.82084 16.353C6.09954 16.1921 6.41568 16.1074 6.7375 16.1074C7.05932 16.1074 7.37547 16.1921 7.65417 16.353L8.04833 16.5822C8.32676 16.7429 8.55802 16.9741 8.71891 17.2524C8.8798 17.5308 8.96467 17.8465 8.965 18.168V18.333C8.965 18.8192 9.15816 19.2856 9.50197 19.6294C9.84579 19.9732 10.3121 20.1663 10.7983 20.1663H11.2017C11.6879 20.1663 12.1542 19.9732 12.498 19.6294C12.8418 19.2856 13.035 18.8192 13.035 18.333V18.168C13.0353 17.8465 13.1202 17.5308 13.2811 17.2524C13.442 16.9741 13.6732 16.7429 13.9517 16.5822L14.3458 16.353C14.6245 16.1921 14.9407 16.1074 15.2625 16.1074C15.5843 16.1074 15.9005 16.1921 16.1792 16.353L16.3167 16.4263C16.7374 16.669 17.2372 16.7349 17.7063 16.6094C18.1755 16.4839 18.5757 16.1774 18.8192 15.7572L19.0208 15.3997C19.2635 14.979 19.3293 14.4792 19.2039 14.01C19.0784 13.5408 18.7719 13.1406 18.3517 12.8972L18.2142 12.8238C17.9344 12.6623 17.7023 12.4297 17.5413 12.1496C17.3803 11.8695 17.2962 11.5519 17.2975 11.2288V10.7705C17.2962 10.4475 17.3803 10.1298 17.5413 9.84971C17.7023 9.56962 17.9344 9.33703 18.2142 9.17551L18.3517 9.09301C18.7719 8.84959 19.0784 8.44936 19.2039 7.98017C19.3293 7.51099 19.2635 7.0112 19.0208 6.59051L18.8192 6.24217C18.5757 5.82192 18.1755 5.51542 17.7063 5.38996C17.2372 5.2645 16.7374 5.33033 16.3167 5.57301L16.1792 5.64634C15.9005 5.80725 15.5843 5.89196 15.2625 5.89196C14.9407 5.89196 14.6245 5.80725 14.3458 5.64634L13.9517 5.41717C13.6732 5.25643 13.442 5.02529 13.2811 4.74694C13.1202 4.4686 13.0353 4.15284 13.035 3.83134V3.66634C13.035 3.18011 12.8418 2.7138 12.498 2.36998C12.1542 2.02616 11.6879 1.83301 11.2017 1.83301Z"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z"
          stroke="currentColor"
          stroke-width="1.45833"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
];

export function Sidebar() {
  return (
    <aside className="w-60 min-h-screen flex flex-col bg-[#F8FAFC] border border-gray-200 rounded-[8.75px]">
      {/* Logo */}
      <div className="flex justify-center items-center p-6 border-b border-gray-200">
        <img src={logo} alt="Venture" className="w-[150px]" />
      </div>

      {/* Menu */}
      <nav className="flex-1 p-6 flex flex-col gap-3">
        {navItems.map((item) => (
         <NavLink
  key={item.to}
  to={item.to}
  className={({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 text-sm transition ${
      isActive
        ? "rounded-[8.75px] border border-[#BBEBFD] bg-[rgba(228,248,255,0.80)] text-[#09BCFD] font-medium"
        : "text-gray-700 hover:bg-[rgba(228,248,255,0.80)] rounded"
    }`
  }
>
  {({ isActive }) => (
    <>
      <span className={isActive ? "text-[#09BCFD]" : "text-gray-500"}>
        {item.icon}
      </span>
      <span>{item.label}</span>
    </>
  )}
</NavLink>
        ))}
      </nav>

      {/* Đăng xuất */}
      <div className="p-2 mt-auto border-t border-gray-200">
        <button className="flex w-full items-center gap-3 rounded px-6 py-2 text-sm text-gray-700 hover:bg-[rgba(228,248,255,0.80)]">
          <span className="text-gray-500">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
