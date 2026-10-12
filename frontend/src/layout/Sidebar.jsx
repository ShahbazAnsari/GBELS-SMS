import { useState } from "react";
import { NavLink } from "react-router";

import menuData from "./sidebarMenu.json";
import style from "./sidebarStyle.json";

function Sidebar({ collapsed, setCollapsed }) {


  // Currently opened parent
  const [openParent, setOpenParent] = useState(null);


  // Parent menu open/close
  const toggleParent = (id) => {

    setOpenParent((current) =>
      current === id ? null : id
    );

  };


  return (

    <aside
      className={`min-h-screen
        ${collapsed
          ? style.sidebar.collapsedWidth
          : style.sidebar.expandedWidth
        }
        ${style.sidebar.background}
        ${style.sidebar.text}
        ${style.sidebar.transition}
        flex flex-col
        fixed left-0 top-0
        z-50
      `}
    >

      {/* =========================
          SIDEBAR HEADER
      ========================== */}

      <div className={style.header.container}>

        {/* Logo */}

        <div className={style.header.logo}>
          <img
            src={menuData.school.logoPath}
            alt="GBELS School Logo"
            className="w-30 h-30"
          />
          {/* {menuData.school.logo} */}
        </div>


        {/* School Name */}

        {!collapsed && (
          <div className={style.header.schoolName}>
            {menuData.school.name}
          </div>
        )}

      </div>


      {/* =========================
          MENU
      ========================== */}

      <nav className={style.menu.container}>

        {menuData.menu.map((item) => (

          <div key={item.id}>

            {/* =========================
                NORMAL MENU
            ========================== */}

            {!item.children && (

              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `${style.menu.item.base}
                  ${isActive
                    ? style.menu.item.active
                    : style.menu.item.inactive
                  }
                  ${collapsed
                    ? style.menu.item.collapsed
                    : ""
                  }`
                }
              >

                <span className="text-xl">
                  {item.icon}
                </span>

                {!collapsed && (
                  <span>
                    {item.title}
                  </span>
                )}

              </NavLink>

            )}


            {/* =========================
                PARENT MENU
            ========================== */}

            {item.children && (

              <div>

                <button
                  type="button"
                  onClick={() => toggleParent(item.id)}
                  className={`
                    ${style.menu.parent.base}
                    ${openParent === item.id
                      ? style.menu.parent.open
                      : style.menu.parent.closed
                    }
                    ${collapsed
                      ? style.menu.parent.collapsed
                      : ""
                    }
                  `}
                >

                  <span className="text-xl">
                    {item.icon}
                  </span>


                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">
                        {item.title}
                      </span>

                      <span
                        className={`
                          ${openParent === item.id
                            ? style.menu.arrow.open
                            : style.menu.arrow.closed
                          }
                        `}
                      >
                        ▼
                      </span>
                    </>
                  )}

                </button>


                {/* =========================
                    CHILDREN
                ========================== */}

                {!collapsed &&
                  openParent === item.id && (

                    <div
                      className={style.menu.children.container}
                    >

                      {item.children.map((child) => (

                        <NavLink
                          key={child.id}
                          to={child.path}
                          className={({ isActive }) =>
                            `
                            ${style.menu.children.item}
                            ${isActive
                              ? style.menu.children.active
                              : style.menu.children.inactive
                            }
                            `
                          }
                        >

                          <span>
                            {child.icon}
                          </span>

                          <span>
                            {child.title}
                          </span>

                        </NavLink>

                      ))}

                    </div>

                  )}

              </div>

            )}

          </div>

        ))}

      </nav>


      {/* =========================
          COLLAPSE BUTTON
      ========================== */}

      <div className="mt-auto p-3">

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="
            w-full
            py-3
            rounded-lg
            bg-slate-700
            hover:bg-slate-600
            transition
          "
        >

          {collapsed ? "➡️" : "⬅️"}

          {!collapsed && (
            <span className="ml-2">
              Collapse
            </span>
          )}

        </button>

      </div>

    </aside>

  );
}

export default Sidebar;