export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    ['eventType', 'Event Type'],
    ['location', 'Location'],
    ['faq', 'FAQ'],
    ['privacy', 'Privacy Policy'],
    ['terms', 'Terms'],
    ['courseImage', 'Course Image'],
    ['eventHost', 'Event Host'],
    ['department', 'Department'],
    ['orgCategory', 'Org Category'],
    ['eventCategory', 'Event Category'],
    ['eventMode', 'Event Mode'],
    ['perks', 'Perks'],
    ['certification', 'Certification'],
    ['accommodation', 'Accommodation']
  ];

  return (
    <ul className="nav nav-tabs">
      {tabs.map(([key, label]) => (
        <li className="nav-item" key={key}>
          <button
            className={`nav-link ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}
