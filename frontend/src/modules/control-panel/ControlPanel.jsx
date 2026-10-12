import { Outlet, useLocation } from "react-router";
import PanelPage from "./PanelPage";
import controlPanelCards from "./controlPanelCards.json";

function ControlPanel() {
  const location = useLocation();

  const isControlPanelHome =
    location.pathname === "/layout/control-panel";

  return (
    <div className="p-6 ">

      {isControlPanelHome ? (
        <PanelPage
          title="Control Panel"
          description="Manage school system settings and configuration."
          cards={controlPanelCards}
          showBack
        />
      ) : (
        <PanelPage showBack>
          <Outlet />
        </PanelPage>
      )}

    </div>
  );
}

export default ControlPanel;