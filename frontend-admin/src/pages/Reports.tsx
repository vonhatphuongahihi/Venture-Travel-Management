import Layout from "@/components/Layout";
import { TouristReports } from "@/components/TouristReports";

export default function Reports() {
  return (
    <Layout title="Báo cáo">
      <div className="mb-4 flex items-center justify-between">
        <TouristReports />
      </div>
    </Layout>
  );
}
