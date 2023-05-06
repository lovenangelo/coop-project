import {
  TextInput,
  Group,
  Button,
  NumberInput,
  Select,
  Text,
  Grid,
  Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import phProvinces from "../../../utils/addressApi.js";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const civil_statuses = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
];

const MemberForm = ({
  readOnly,
  memberInformation,
  closeForm,
  isFiltering,
  role,
}) => {
  const [editable, setEditable] = useState(!readOnly);
  const [modalMessage, setModalMessage] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const address = memberInformation
    ? memberInformation.address.split(",").map((place) => place.trim())
    : null;

  const form = useForm({
    initialValues: {
      cid: memberInformation ? memberInformation.cid : "",
      name: memberInformation ? memberInformation.name : "",
      dob: memberInformation ? new Date(memberInformation.dob) : "",
      occupation: memberInformation ? memberInformation.occupation : "",
      age: memberInformation ? memberInformation.age : "",
      gender: memberInformation ? memberInformation.gender : "",
      civil_status: memberInformation ? memberInformation.civil_status : "",
      barangay: memberInformation ? address[0] : "",
      city: memberInformation ? address[1] : "",
      province: memberInformation ? address[2] : "",
      contact: memberInformation ? parseInt(memberInformation.contact) : "",
      tin: memberInformation ? parseInt(memberInformation.tin) : "",
      registration_date: memberInformation
        ? new Date(memberInformation.registration_date)
        : "",
    },
    validate: {
      cid: (value) => (value ? null : "Invalid CID"),
      name: (value) => (value ? null : "Invalid age"),
      age: (value) => (value ? null : "Invalid age"),
      occupation: (value) => (value ? null : "Invalid occupation"),
      dob: (value) => (value ? null : "Invalid date of birth"),
      gender: (value) => (value ? null : "Invalid gender"),
      civil_status: (value) => (value ? null : "Invalid civil status"),
      barangay: (value) => (value ? null : "Invalid barangay"),
      city: (value) => (value ? null : "Invalid city"),
      province: (value) => (value ? null : "Invalid province"),
      contact: (value) => (value ? null : "Invalid contact"),
      tin: (value) => (value ? null : "Invalid TIN"),
      registration_date: (value) =>
        value ? null : "Invalid registration date",
    },
  });

  const [initialFormValues, setInitialFormValues] = useState(form.values);
  const getUpdatedFields = () => {
    let updated = {};
    for (let field in initialFormValues) {
      const dates = field == "dob" || field == "registration_date";
      // checking for date fields
      if (
        dates &&
        initialFormValues[field].toString() !== form.values[field].toString()
      ) {
        updated[field] = form.values[field];
      }
      // Checking for non date fields
      if (!dates && initialFormValues[field] !== form.values[field]) {
        updated[field] = form.values[field];
      }
    }
    return updated;
  };

  const onSave = (values) => {
    router.post("/members", values, {
      onError: (error) => {
        console.log(error);
        form.setErrors(error);
      },
      onSuccess: (res) => {
        console.log(res);
        notifications.show({
          title: "Success!",
          message: "New member added ✔️",
        });
        close();
        closeForm();
      },
    });
  };

  const onUpdate = () => {
    const values = getUpdatedFields();
    console.log(values);
    router.patch(`/members/${memberInformation.id}`, values, {
      onError: (error) => {
        console.log(error);
        form.setErrors(error);
      },
      onSuccess: (res) => {
        console.log(res);
        notifications.show({
          title: "Success!",
          message: "Updated ✔️",
        });
        close();
        closeForm();
      },
    });
  };

  const onDelete = () => {
    router.delete(`/members/${memberInformation.id}`, {
      onError: (error) => {
        notifications.show({
          color: "red",
          title: "Failed",
          message: error,
        });
      },
      onSuccess: (res) => {
        console.log(res);
        notifications.show({
          title: "Success!",
          message: "Member deleted ✔️",
        });
        close();
        closeForm();
      },
    });
  };

  const onFiltering = () => {
    console.log(getUpdatedFields());
    router.get("/members/filter", getUpdatedFields(), {
      onError: (error) => {
        form.setErrors(error);
      },
      onSuccess: (res) => {
        console.log(res);
        close();
        closeForm();
      },
    });
  };

  return (
    <div className={isFiltering ? "w-80 p-8" : ""}>
      <form
        onSubmit={form.onSubmit((values) => {
          onSave(values);
        })}
      >
        <Grid grow>
          <Grid.Col span={4}>
            <TextInput
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label="CID"
              {...form.getInputProps("cid")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label="Name"
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <DateInput
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label={isFiltering ? "Birthday" : "Date of Birth"}
              maw={400}
              mx="auto"
              {...form.getInputProps("dob")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label="Age"
              hideControls
              {...form.getInputProps("age")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label="Gender"
              data={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
              {...form.getInputProps("gender")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label="Civil Status"
              data={civil_statuses}
              {...form.getInputProps("civil_status")}
            />
          </Grid.Col>
        </Grid>
        <Grid grow>
          <Grid.Col span={4}>
            <TextInput
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label="Occupation"
              {...form.getInputProps("occupation")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label="Contact Number"
              hideControls
              {...form.getInputProps("contact")}
            />
          </Grid.Col>
        </Grid>
        <Text mt={12}>Address</Text>
        <Grid grow>
          <Grid.Col span={4}>
            <Select
              readOnly={readOnly && !editable}
              disabled={false}
              searchable
              nothingFound="No options"
              required={!isFiltering}
              label="Province"
              data={phProvinces.getProvinces()}
              {...form.getInputProps("province")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              readOnly={readOnly && !editable}
              disabled={form.values.province.length == 0}
              required={!isFiltering}
              searchable
              nothingFound="No options"
              label="City"
              data={
                form.values.province.length == 0
                  ? []
                  : phProvinces.getCitiesFromProvince(form.values.province)
              }
              {...form.getInputProps("city")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              readOnly={readOnly && !editable}
              disabled={form.values.city.length == 0}
              required={!isFiltering}
              searchable
              nothingFound="No options"
              label="Barangay"
              data={
                form.values.city.length == 0
                  ? []
                  : phProvinces.getBarangaysFromCity(
                      form.values.province,
                      form.values.city
                    )
              }
              {...form.getInputProps("barangay")}
            />
          </Grid.Col>
        </Grid>
        <Grid grow>
          <Grid.Col span={4}>
            <TextInput
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label="TIN"
              {...form.getInputProps("tin")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <DateInput
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label="Registration Date"
              maw={400}
              mx="auto"
              {...form.getInputProps("registration_date")}
            />
          </Grid.Col>
        </Grid>
        <Divider className="my-4"></Divider>
        <Modal
          centered
          size="sm"
          opened={opened}
          onClose={close}
          title="Confirmation"
          withOverlay={false}
          withinPortal={false}
        >
          <Text className="mb-4">{modalMessage}</Text>
          <Button
            onClick={() => {
              if (modalAction === "update") {
                onUpdate();
              }
              if (modalAction === "delete") {
                onDelete();
              }
            }}
            className="mr-4 bg-blue-600 text-white  hover:bg-blue-500"
          >
            Yes
          </Button>
          <Button
            onClick={close}
            className="bg-red-600 text-white hover:bg-red-500"
          >
            No
          </Button>
        </Modal>
        {!readOnly && (
          <Group position="center" mt="md">
            {isFiltering ? (
              <Button
                fullWidth
                className="bg-blue-600 text-white  hover:bg-blue-500"
                variant="default"
                onClick={() => onFiltering()}
              >
                Filter
              </Button>
            ) : (
              <Button
                fullWidth
                className="bg-blue-600 text-white  hover:bg-blue-500"
                variant="default"
                type="submit"
              >
                Submit
              </Button>
            )}
          </Group>
        )}
        {readOnly && (
          <Grid grow>
            <Grid.Col span={4}>
              {!editable && (
                <Button
                  className="bg-blue-600 text-white  hover:bg-blue-500"
                  fullWidth
                  onClick={() => {
                    setEditable(true);
                  }}
                >
                  Edit
                </Button>
              )}
              {editable && (
                <Button
                  disabled={
                    JSON.stringify(initialFormValues) ==
                    JSON.stringify(form.values)
                  }
                  className="bg-blue-600 text-white  hover:bg-blue-500"
                  fullWidth
                  onClick={() => {
                    setModalMessage(
                      "Are you sure to update member information?"
                    );
                    setModalAction("update");
                    open();
                  }}
                >
                  Update
                </Button>
              )}
            </Grid.Col>
            {!editable && (
              <Grid.Col span={4}>
                <Button
                  disabled={role !== "admin"}
                  className="bg-red-600 text-white hover:bg-red-500"
                  fullWidth
                  onClick={() => {
                    setModalMessage("Are you sure to delete this member?");
                    setModalAction("delete");
                    open();
                  }}
                >
                  Delete
                </Button>
              </Grid.Col>
            )}
          </Grid>
        )}
      </form>
    </div>
  );
};

export default MemberForm;
