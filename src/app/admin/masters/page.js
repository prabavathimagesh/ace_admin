'use client';
import { useState } from 'react';
import Tabs from './components/Tabs';

import EventType from './components/EventType';
import Location from './components/Location';
import FAQ from './components/FAQ';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import CourseImage from './components/CourseImage';
import EventHost from './components/EventHost';
import Department from './components/Department';
import OrgCategory from './components/OrgCategory';
import EventCategory from './components/EventCategory';
import EventMode from './components/EventMode';
import Perks from './components/Perks';
import Certification from './components/Certification';
import Accommodation from './components/Accommodation';

export default function MastersPage() {
  const [activeTab, setActiveTab] = useState('eventType');

  return (
    <div>
      <h3>Masters</h3>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'eventType' && <EventType />}
        {activeTab === 'location' && <Location />}
        {activeTab === 'faq' && <FAQ />}
        {activeTab === 'privacy' && <PrivacyPolicy />}
        {activeTab === 'terms' && <Terms />}
        {activeTab === 'courseImage' && <CourseImage />}
        {activeTab === 'eventHost' && <EventHost />}
        {activeTab === 'department' && <Department />}
        {activeTab === 'orgCategory' && <OrgCategory />}
        {activeTab === 'eventCategory' && <EventCategory />}
        {activeTab === 'eventMode' && <EventMode />}
        {activeTab === 'perks' && <Perks />}
        {activeTab === 'certification' && <Certification />}
        {activeTab === 'accommodation' && <Accommodation />}
      </div>
    </div>
  );
}
