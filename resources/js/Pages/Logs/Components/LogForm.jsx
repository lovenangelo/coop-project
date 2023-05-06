import { TextInput, Group, Button, Grid, Divider, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { router } from "@inertiajs/react";
import { useState } from "react";

const LogForm = ({ closeForm, isFiltering }) => {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      activity: "",
      created_at: "",
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

  const onFiltering = () => {
    router.get("/logs/filter", getUpdatedFields(), {
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
            <TextInput label="Name" {...form.getInputProps("name")} />
          </Grid.Col>
          <Grid.Col span={8}>
            <TextInput label="Email" {...form.getInputProps("email")} />
          </Grid.Col>
          <Grid.Col span={8}>
            <Select
              label="Activity"
              data={[
                { value: "log in", label: "Log in" },
                { value: "log out", label: "Log out" },
              ]}
              {...form.getInputProps("activity")}
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <DateInput
              className="w-100"
              label={"Creation date"}
              maw={400}
              mx="auto"
              {...form.getInputProps("created_at")}
            />
          </Grid.Col>
        </Grid>
        <Divider className="my-4"></Divider>

        <Group position="center" mt="md">
          <Button
            fullWidth
            className="bg-blue-600 text-white  hover:bg-blue-500"
            variant="default"
            onClick={() => onFiltering()}
          >
            Filter
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default LogForm;
