import CrudLayout from './CrudLayout';

export default function PrivacyPolicy() {
  const data = [
    { section: 'Data', title: 'Usage', subTitle: 'We collect info' }
  ];

  return (
    <CrudLayout
      title="Privacy Policy"
      columns={['section', 'title', 'subTitle']}
      data={data}
    />
  );
}
