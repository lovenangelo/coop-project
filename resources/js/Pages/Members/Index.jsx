import { Table, Button, Center, Tooltip, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import MemberForm from "./Components/MemberForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Pagination from "../../Components/Pagination";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";

import {
  IconPlus,
  IconFilter,
  IconRefresh,
  IconTableExport,
  IconDownload,
} from "@tabler/icons-react";
import { router } from "@inertiajs/react";
import * as XLSX from "xlsx";

function Index({ auth, members }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [readOnly, setReadOnly] = useState(false);
  const [memberInformation, setMemberInformation] = useState(null);
  const [membersList, setMembersList] = useState(members);
  console.log(membersList);
  useEffect(() => {
    setMembersList(members);
    return () => {};
  }, [members]);

  const theads = (
    <thead>
      <tr>
        <th>CID</th>
        <th>NAME</th>
        <th>BIRTH DATE</th>
        <th>OCCUPATION</th>
        <th>AGE</th>
        <th>GENDER</th>
        <th>CIVIL STATUS</th>
        <th>ADDRESS</th>
        <th>CONTACT</th>
        <th>TIN</th>
        <th>REGISTRATION DATE</th>
      </tr>
    </thead>
  );

  const showMemberInformation = (rowData) => {
    setReadOnly(true);
    setMemberInformation(rowData);
    open();
  };

  const handleExportAll = () => {
    // flatten object like this {id: 1, title:'', category: ''};
    // create workbook and worksheet
    const rows = membersList.data.map((member) => ({
      cid: member.cid,
      name: member.name,
      dateOfBirth: member.dob,
      occupation: member.occupation,
      age: member.age,
      gender: member.gender,
      civilStatus: member.civil_status,
      address: member.address,
      contact: member.contact,
      tin: member.tin,
      registrationDate: member.registration_date,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    XLSX.utils.sheet_add_aoa(worksheet, [
      [
        "CID",
        "Name",
        "Date of Birth",
        "Occupation",
        "Age",
        "Gender",
        "Civil Status",
        "Address",
        "Contact",
        "TIN",
        "Registration Date",
      ],
    ]);

    XLSX.writeFile(workbook, "coop-all-members.xlsx", { compression: true });
  };

  let rows = [];

  if (membersList.data.length !== 0) {
    rows = membersList.data.map((row) => (
      <tr
        className="cursor-pointer"
        key={row.id}
        onClick={() => showMemberInformation(row)}
      >
        <td>{row.cid}</td>
        <td>{row.name}</td>
        <td>{row.dob}</td>
        <td>{row.occupation}</td>
        <td>{row.age}</td>
        <td>{row.gender}</td>
        <td>{row.civil_status}</td>
        <td>{row.address}</td>
        <td>{row.contact}</td>
        <td>{row.tin}</td>
        <td>{row.registration_date}</td>
      </tr>
    ));
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Members
          </h2>
          <div className="flex">
            <div className="mr-4">
              <Tooltip label="Reset" position="bottom">
                <Button
                  onClick={() => {
                    router.get("/members", {
                      onError: (error) => {
                        console.log(error);
                      },
                      onSuccess: (res) => {
                        setMembersList(res.props.data);
                      },
                    });
                  }}
                  variant="default"
                >
                  <IconRefresh />
                </Button>
              </Tooltip>
            </div>
            <div className="mr-4">
              <Menu>
                <Menu.Target>
                  <Tooltip label="Export" position="bottom">
                    <Button variant="default">
                      <IconTableExport />
                    </Button>
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Export</Menu.Label>
                  <Menu.Item
                    onClick={() => {
                      if (membersList.data.length > 0) {
                        handleExportAll();
                      } else {
                        notifications.show({
                          title: "Download failed",
                          message: "No data",
                          color: "red",
                        });
                      }
                    }}
                    icon={<IconDownload size={14} />}
                  >
                    Download All Data
                  </Menu.Item>
                  <Menu.Item icon={<IconDownload size={14} />}>
                    Download Current Table Data
                  </Menu.Item>
                  <Menu.Item icon={<IconDownload size={14} />}>
                    Download Filter Results
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
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
                  <MemberForm
                    closeForm={close}
                    readOnly={false}
                    memberInformation={null}
                    isFiltering={true}
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
                    setMemberInformation(null);
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
        size="lg"
        opened={opened}
        onClose={close}
        title={!readOnly ? "ADD NEW MEMBER" : "MEMBER"}
      >
        <MemberForm
          closeForm={close}
          readOnly={readOnly}
          memberInformation={memberInformation}
          isFiltering={false}
          role={auth.user.role}
        />
      </Modal>

      <Head title="Members" />

      <div className="mt-4 max-w-8xl mx-auto sm:px-6 lg:px-8 text-gray-900">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg py-4 px-4">
          {rows.length == 0 && <Center>No data</Center>}
          {rows.length !== 0 && (
            <>
              <Table striped highlightOnHover withBorder>
                {theads}
                <tbody>{rows}</tbody>
              </Table>
              <Pagination data={membersList} />
            </>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Index;
