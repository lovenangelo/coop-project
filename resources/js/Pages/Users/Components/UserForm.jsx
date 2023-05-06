import {
  TextInput,
  Group,
  Button,
  Text,
  Grid,
  Divider,
  PasswordInput,
  Select,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const UserForm = ({
  readOnly,
  userInformation,
  closeForm,
  isFiltering,
  isRegisteringUser,
}) => {
  const [editable, setEditable] = useState(!readOnly);
  const [modalMessage, setModalMessage] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: userInformation ? userInformation.name : "",
      email: userInformation ? userInformation.email : "",
      role: userInformation ? userInformation.role : "",
      created_at: userInformation ? new Date(userInformation.created_at) : "",
      password: "",
      password_confirmation: "",
    },
    validate: {
      name: (value) => (value ? null : "Invalid name"),
      role: (value) => (value ? null : "Invalid role"),
      email: (value) => (value ? null : "Invalid email"),
      created_at: (value) =>
        isRegisteringUser ? null : value ? null : "Please enter a password",
      password: (value) => (value ? null : "Please enter a password"),
      password_confirmation: (value) =>
        value ? null : "Please confirm your password",
      password_confirmation: (value) =>
        form.values.password === value ? null : "Passwords do not match",
    },
  });

  const [initialFormValues, setInitialFormValues] = useState(form.values);
  const getUpdatedFields = () => {
    let updated = {};
    for (let field in initialFormValues) {
      const dates = field == "created_at";
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

  const onRegister = (values) => {
    const { created_at, ...regValues } = values;
    console.log(regValues);
    router.post("/register", regValues, {
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
    router.patch(`/users/${userInformation.id}`, values, {
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
    router.delete(`/users/${userInformation.id}`, {
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
    router.get("/users/filter", getUpdatedFields(), {
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
          onRegister(values);
        })}
      >
        <Grid grow>
          <Grid.Col span={8}>
            <TextInput
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label="Name"
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <TextInput
              readOnly={readOnly && !editable}
              required={!isFiltering}
              label="Email"
              {...form.getInputProps("email")}
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <Select
              label="Role"
              data={[
                { value: "admin", label: "Administrator" },
                { value: "regular", label: "Regular" },
              ]}
              {...form.getInputProps("role")}
            />
          </Grid.Col>
          {!isRegisteringUser && (
            <Grid.Col span={8}>
              <DateInput
                className="w-100"
                readOnly={readOnly && !editable}
                required={!isFiltering}
                label={"Creation date"}
                maw={400}
                mx="auto"
                {...form.getInputProps("created_at")}
              />
            </Grid.Col>
          )}
          {isRegisteringUser && (
            <Grid.Col span={8}>
              <PasswordInput
                className="w-100"
                readOnly={readOnly && !editable}
                required={!isFiltering}
                label={"Password"}
                maw={400}
                mx="auto"
                {...form.getInputProps("password")}
              />
            </Grid.Col>
          )}
          {isRegisteringUser && (
            <Grid.Col span={8}>
              <PasswordInput
                className="w-100"
                readOnly={readOnly && !editable}
                required={!isFiltering}
                label={"Confirm Password"}
                maw={400}
                mx="auto"
                {...form.getInputProps("password_confirmation")}
              />
            </Grid.Col>
          )}
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
                Register
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

export default UserForm;
