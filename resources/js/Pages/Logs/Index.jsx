import { Table, Button, Center, Tooltip, Menu } from "@mantine/core";
import LogForm from "./Components/LogForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Pagination from "../../Components/Pagination";
import { useState, useEffect } from "react";
import { IconFilter, IconRefresh } from "@tabler/icons-react";
import { router } from "@inertiajs/react";

function Index({ auth, logs }) {
  const [logList, setLogList] = useState(logs);

  useEffect(() => {
    setLogList(logs);
    return () => {};
  }, [logs]);

  const theads = (
    <thead>
      <tr>
        <th>NAME</th>
        <th>EMAIL</th>
        <th>ACTIVITY</th>
        <th>DATE/TIME</th>
      </tr>
    </thead>
  );

  let rows = [];

  if (logList.data.length !== 0) {
    rows = logList.data.map((row) => {
      return (
        <tr
          className="cursor-pointer"
          key={row.id}
          onClick={() => showlogInformation(row)}
        >
          <td>{row.name}</td>
          <td>{row.email}</td>
          <td>{row.activity}</td>
          <td>{new Date(row.created_at).toLocaleString()}</td>
        </tr>
      );
    });
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Authentication Logs
          </h2>
          <div className="flex">
            <div className="mr-4">
              <Tooltip label="Reset" position="bottom">
                <Button
                  onClick={() => {
                    router.get("/logs", {
                      onError: (error) => {
                        console.log(error);
                      },
                      onSuccess: (res) => {
                        setLogList(res.props.data);
                      },
                    });
                  }}
                  variant="default"
                >
                  <IconRefresh />
                </Button>
              </Tooltip>
            </div>
            <div className="mr-16">
              <Menu>
                <Menu.Target>
                  <Tooltip label="Filter" position="bottom">
                    <Button variant="default">
                      <IconFilter />
                    </Button>
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Filter Logs</Menu.Label>
                  <LogForm
                    closeForm={close}
                    readOnly={false}
                    isFiltering={true}
                    isRegisteringlog={false}
                  />
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        </div>
      }
      className="mx-32 pt-2"
    >
      <Head title="Logs" />

      <div className="mt-4 max-w-8xl mx-auto sm:px-6 lg:px-8 text-gray-900">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg py-4 px-4">
          {rows.length == 0 && <Center>No data</Center>}
          {rows.length !== 0 && (
            <>
              <Table striped highlightOnHover withBorder>
                {theads}
                <tbody>{rows}</tbody>
              </Table>
              <Pagination data={logList} />
            </>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Index;
