import CrudLayout from "./CrudLayout";
export default () => (
  <CrudLayout
    title="Event Category"
    columns={["categoryName"]}
    data={[{ categoryName: "Education" }]}
  />
);
