import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Flex, Select } from "@mantine/core";
import { DatePicker, MonthPicker, YearPicker } from "@mantine/dates";
import { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
} from "recharts";
export default function Dashboard({ auth, data }) {
  const [date, setDate] = useState(new Date());
  const [selectValue, setSelectValue] = useState("yearly");
  // const data = [
  //   {
  //     name: "November",
  //     uv: 4000,
  //     pv: 2400,
  //     amt: 2400,
  //   },
  // ];

  console.log(data);

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
            <Flex className="p-6">
              <LineChart
                width={900}
                height={600}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <Label value="Pages of my website" offset={0} position="top" />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
              <Flex direction="column">
                <Select
                  className="mb-8"
                  label="Reports"
                  value={selectValue}
                  onChange={(value) => setSelectValue(value)}
                  data={[
                    { value: "yearly", label: "Yearly" },
                    { value: "monthly", label: "Monthly" },
                    { value: "day", label: "Day" },
                  ]}
                />
                {selectValue == "yearly" && (
                  <YearPicker value={date} onChange={setDate} />
                )}
                {selectValue == "monthly" && (
                  <MonthPicker value={date} onChange={setDate} />
                )}
                {selectValue == "day" && (
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
