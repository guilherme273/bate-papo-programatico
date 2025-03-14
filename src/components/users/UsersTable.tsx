import { ChangeEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

interface UserTableTypes {
  email: string;
  streak_count: number;
  total_readings: number;
  biggest_streak: number;
  last_read: string;
}

interface Props {
  userData: UserTableTypes[];
}

const UsersTable: React.FC<Props> = ({ userData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(userData);

  const getHour = (date: string) => {
    return new Date(date).toLocaleString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
  };

  useEffect(() => {
    setFilteredUsers(userData); // Atualiza os usuários filtrados ao passar novos dados
  }, [userData]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = userData.filter(
      (user) =>
        user.email.toLowerCase().includes(term) ||
        user.streak_count.toString().includes(term)
    );
    setFilteredUsers(filtered);
  };

  return (
    <motion.div
      className="p-6 bg-opacity-50 border border-gray-700 shadow-lg bg-slate-950 backdrop-blur-md rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Users</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="py-2 pl-10 pr-4 text-white placeholder-gray-400 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Streak Count
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Total Readings
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Biggest Streak
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Last Read
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={index} // Usando o 'id' que foi gerado acima
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300 hover:text-blue-500">
                    <Link to={`/${user.email}`}>{user.email}</Link>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-100 bg-blue-800 rounded-full">
                    {user.streak_count}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-100 bg-blue-800 rounded-full ">
                    {user.total_readings}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-100 bg-blue-800 rounded-full">
                    {user.biggest_streak}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-100 bg-blue-800 rounded-full">
                    {getHour(user.last_read)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersTable;
