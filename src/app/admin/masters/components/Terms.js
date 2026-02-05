import CrudLayout from './CrudLayout';

export default function Terms() {
  const data = [
    { section: 'General', title: 'Rules', subTitle: 'Follow rules' }
  ];

  return (
    <CrudLayout
      title="Terms & Conditions"
      columns={['section', 'title', 'subTitle']}
      data={data}
    />
  );
}
