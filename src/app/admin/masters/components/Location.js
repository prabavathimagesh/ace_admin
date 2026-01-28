import CrudLayout from './CrudLayout';

export default function Location() {
  const data = [
    { country: 'India', state: 'Tamil Nadu', city: 'Chennai' }
  ];

  return (
    <CrudLayout
      title="Locations"
      columns={['country', 'state', 'city']}
      data={data}
    />
  );
}
