import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Flex, Select, Text } from "@mantine/core";
import { DatePicker, MonthPicker, YearPicker } from "@mantine/dates";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
export default function Dashboard({ auth, occurrences }) {
  const [date, setDate] = useState(new Date());
  const [selectValue, setSelectValue] = useState("all");

  const [lineChartData, setLineChartData] = useState(occurrences);

  // console.log(occurrences);

  useEffect(() => {
    const handleDataFetch = () => {
      console.log(date);
    };

    if (selectValue !== "all") {
      handleDataFetch();
    }

    return () => {};
  }, [date]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <Text fz="xl" fw={700} className="p-6">
              Membership Growth
            </Text>
            <Flex className="p-6">
              <LineChart
                width={900}
                height={600}
                data={lineChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis dataKey="count" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
              <Flex direction="column">
                <Select
                  className="mb-8"
                  label="Reports"
                  value={selectValue}
                  onChange={(value) => setSelectValue(value)}
                  data={[
                    { value: "all", label: "All" },
                    { value: "monthly", label: "Monthly" },
                    { value: "daily", label: "Daily" },
                    { value: "specific date", label: "Specific Date" },
                  ]}
                />
                {selectValue == "monthly" && (
                  <YearPicker value={date} onChange={setDate} />
                )}
                {selectValue == "daily" && (
                  <MonthPicker value={date} onChange={setDate} />
                )}
                {selectValue == "specific date" && (
                  <DatePicker value={date} onChange={setDate} />
                )}
              </Flex>
            </Flex>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
