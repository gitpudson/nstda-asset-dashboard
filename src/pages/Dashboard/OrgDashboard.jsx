import { useParams } from "react-router-dom";

import Home from "./Home";
import AssetTable from "../../components/tables/AssetTable";

export default function OrgDashboard() {

  const { org } = useParams();

  return (
    <>
      <Home org={org} />

      <AssetTable org={org} />
    </>
  );
}