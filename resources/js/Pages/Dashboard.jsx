import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Flex, Select, Text } from "@mantine/core";
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
} from "recharts";
import { router } from "@inertiajs/react";

export default function Dashboard({ auth, occurrences, selected, full }) {
  const [date, setDate] = useState(new Date(full.date));
  const [selectValue, setSelectValue] = useState(selected);
  console.log(occurrences);
  const handleDataFetch = (date) => {
    console.log(date);
    const values = {
      type: selectValue,
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      full: date,
    };
    console.log(values);
    router.get("/members-added-reports", values, {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (res) => {
        // console.log(res);
      },
    });
  };

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
                data={occurrences}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={
                    selected == "yearly"
                      ? "year"
                      : selected == "monthly"
                      ? "month"
                      : selected == "daily"
                      ? "day"
                      : selected == "specific-date"
                      ? "date"
                      : ""
                  }
                />
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
                  onChange={(value) => {
                    if (value == "yearly") {
                      router.get("/dashboard");
                    }
                    setSelectValue(value);
                    setDate(null);
                  }}
                  data={[
                    { value: "yearly", label: "Yearly" },
                    { value: "monthly", label: "Monthly" },
                    { value: "daily", label: "Daily" },
                    { value: "specific-date", label: "Specific Date" },
                  ]}
                />
                {selectValue == "monthly" && (
                  <YearPicker
                    value={date}
                    onChange={(value) => {
                      console.log(value);
                      setDate(value);
                      handleDataFetch(value);
                    }}
                  />
                )}
                {selectValue == "daily" && (
                  <MonthPicker
                    value={date}
                    onChange={(value) => setDate(value)}
                  />
                )}
                {selectValue == "specific-date" && (
                  <DatePicker
                    value={date}
                    onChange={(value) => {
                      setDate(value);
                      handleDataFetch(value);
                    }}
                  />
                )}
              </Flex>
            </Flex>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
