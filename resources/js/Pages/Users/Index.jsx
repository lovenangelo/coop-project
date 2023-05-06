import { Table, Button, Center, Tooltip, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import UserForm from "./Components/UserForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Pagination from "../../Components/Pagination";
import { useState, useEffect } from "react";
import { IconPlus, IconFilter, IconRefresh } from "@tabler/icons-react";
import { router } from "@inertiajs/react";

function Index({ auth, users }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [readOnly, setReadOnly] = useState(false);
  const [userInformation, setUserInformation] = useState(null);
  const [userList, setUserList] = useState(users);

  useEffect(() => {
    setUserList(users);
    return () => {};
  }, [users]);

  const theads = (
    <thead>
      <tr>
        <th>NAME</th>
        <th>EMAIL</th>
        <th>ROLE</th>
        <th>CREATED AT</th>
      </tr>
    </thead>
  );

  const showuserInformation = (rowData) => {
    setReadOnly(true);
    setUserInformation(rowData);
    open();
  };

  let rows = [];

  if (userList.data.length !== 0) {
    rows = userList.data.map((row) => {
      return (
        <tr
          className="cursor-pointer"
          key={row.id}
          onClick={() => showuserInformation(row)}
        >
          <td>{row.name}</td>
          <td>{row.email}</td>
          <td>{row.role}</td>
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
            Users
          </h2>
          <div className="flex">
            <div className="mr-4">
              <Tooltip label="Reset" position="bottom">
                <Button
                  onClick={() => {
                    router.get("/users", {
                      onError: (error) => {
                        console.log(error);
                      },
                      onSuccess: (res) => {
                        setUserList(res.props.data);
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
                  <Menu.Label>Filter Members</Menu.Label>
                  <UserForm
                    closeForm={close}
                    readOnly={false}
                    userInformation={null}
                    isFiltering={true}
                    isRegisteringUser={false}
                  />
                </Menu.Dropdown>
              </Menu>
            </div>
            <div>
              <Tooltip label="Add" position="bottom">
                <Button
                  onClick={() => {
                    open();
                    setReadOnly(false);
                    setUserInformation(null);
                  }}
                  variant="default"
                >
                  <IconPlus />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      }
      className="mx-32 pt-2"
    >
      <Modal
        size="sm"
        opened={opened}
        onClose={close}
        title={!readOnly ? "ADD NEW USER" : "USER"}
      >
        <UserForm
          closeForm={close}
          readOnly={readOnly}
          userInformation={userInformation}
          isFiltering={false}
          isRegisteringUser={!readOnly}
        />
      </Modal>

      <Head title="Users" />

      <div className="mt-4 max-w-8xl mx-auto sm:px-6 lg:px-8 text-gray-900">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg py-4 px-4">
          {rows.length == 0 && <Center>No data</Center>}
          {rows.length !== 0 && (
            <>
              <Table striped highlightOnHover withBorder>
                {theads}
                <tbody>{rows}</tbody>
              </Table>
              <Pagination data={userList} />
            </>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Index;
