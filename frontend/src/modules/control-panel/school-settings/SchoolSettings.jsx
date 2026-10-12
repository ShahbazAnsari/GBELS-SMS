import { useNavigate } from "react-router";
import PanelPage from "../PanelPage";
import schoolSettingsCards from "./schoolSettingsCards.json"

function SchoolSettings() {
  const navigate = useNavigate();

  return (
    <PanelPage
      title="School Settings"
      description="Configure academic and school-related system settings."
      cards={schoolSettingsCards}
      onCardClick={(card) => navigate(card.path)}
    />
  );
}

export default SchoolSettings;