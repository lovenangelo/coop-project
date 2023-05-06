import { router } from "@inertiajs/react";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import { Center } from "@mantine/core";

const Pagination = ({ data, all }) => {
  console.log(data);
  return (
    <Center className="mt-4">
      <div className="flex items-center">
        {data.links.map((link, index) => (
          <button
            key={index}
            onClick={() => {
              if (link.url) {
                router.get(link.url);
              }
            }}
            className={`border rounded mr-1 px-3 py-1
                     ${link.active ? "bg-gray-200" : "bg-white"}`}
          >
            {link.label === "Next &raquo;" && <IconChevronRight />}
            {link.label === "&laquo; Previous" && <IconChevronLeft />}
            {link.label !== "Next &raquo;" &&
              link.label !== "&laquo; Previous" &&
              link.label}
          </button>
        ))}
      </div>
    </Center>
  );
};

export default Pagination;
