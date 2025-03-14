import { Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import "./AdminStyle.css";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import CategoryDistributionChart from "../../components/overview/CategoryDistributionChart";
import UsersTable from "../../components/users/UsersTable";
import { useSocket } from "../../contexts/WebSocketContext";

export interface Charts {
  name: string;
  value: number;
}

interface TableData {
  id: number;
  email: string;
  streak_count: number;
  total_readings: number;
  biggest_streak: number;
  last_read: string;
}

const x = [
  {
    id: 2,
    email: "sa",
    streak_count: 2,
    total_readings: 2,
    biggest_streak: 2,
    last_read: "string",
  },
  {
    id: 2,
    email: "sa",
    streak_count: 2,
    total_readings: 2,
    biggest_streak: 2,
    last_read: "string",
  },
  {
    id: 2,
    email: "sa",
    streak_count: 2,
    total_readings: 2,
    biggest_streak: 2,
    last_read: "string",
  },
  {
    id: 2,
    email: "sa",
    streak_count: 2,
    total_readings: 2,
    biggest_streak: 2,
    last_read: "string",
  },
];

const array_utm_source: Charts[] = [
  { name: "Campaign", value: 1 },
  { name: "Promo", value: 1 },
  { name: "Marketing", value: 1 },
  { name: "Tech Case", value: 1 },
  { name: "Newsletter", value: 1 },
];

const Admin = () => {
  const { ArrayRooms } = useSocket();
  return (
    <>
      <section className="bg-gray-800 section-admin">
        <div className="relative z-10 flex-1 overflow-auto admin">
          <Header title="The News Admin" />

          <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
            {/* STATS */}
            <motion.div
              className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <StatCard
                name="Total De Noticias Abertas"
                icon={Zap}
                value={35}
                color="#6366F1"
              />
              <StatCard
                name="Total De Usuarios"
                icon={Users}
                value={35}
                color="#8B5CF6"
              />
            </motion.div>

            {/* CHARTS */}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* <SalesOverviewChart /> */}
              <CategoryDistributionChart
                title={"Utm Source"}
                categoryData={array_utm_source}
              />
              <CategoryDistributionChart
                title={"Utm Medium"}
                categoryData={array_utm_source}
              />
              {/* <SalesChannelChart /> */}
            </div>
            <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-1">
              <CategoryDistributionChart
                title={"Utm Campaign"}
                categoryData={array_utm_source}
              />
            </div>
            <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-1">
              <UsersTable userData={x} />
            </div>
          </main>
        </div>
      </section>
    </>
  );
};
export default Admin;
