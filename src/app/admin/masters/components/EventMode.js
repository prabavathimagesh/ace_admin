import CrudLayout from "./CrudLayout";
export default () => (
  <CrudLayout
    title="Event Mode"
    columns={["eventModeName"]}
    data={[{ eventModeName: "Online" }]}
  />
);
