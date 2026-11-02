export const beforeYouGoTabs = [
  { href: '/students/physicalEnv', label: 'Physical environment' },
  { href: '/students/materials', label: 'What to prepare' },
  { href: '/students/samplingProtocol', label: 'Sampling protocol' },
  { href: '/students/commonSpecies', label: 'Common species' },
] as const;

export const afterYouReturnTabs = [
  { href: '/students/afterUreturn', label: 'Background theory' },
  { href: '/students/samplingEffortTaiTam', label: 'Sample data' },
  { href: '/students/dataAnalysis', label: 'Plot survey data' },
  { href: '/students/wtcanweLearn', label: 'What can we learn' },
] as const;

/** Primary header links for the document-style site chrome. */
export const topNav = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Students' },
  { href: '/students/beforeUgo', label: 'Before you go' },
  { href: '/students/afterUreturn', label: 'After you return' },
  { href: '/students/resources', label: 'Resources' },
] as const;
