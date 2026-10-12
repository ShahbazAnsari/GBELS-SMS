import PanelPage from "../../control-panel/PanelPage";
import schoolManagementCards from "./schoolManagementCards.json";

function SchoolManagement() {
  return (
    <PanelPage
      title="School Management"
      description="Manage schools and branches."
      cards={schoolManagementCards}
    />
  );
}

export default SchoolManagement;