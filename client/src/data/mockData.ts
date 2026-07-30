import type { Project, Publication, TeamMember, GalleryItem } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Smart Campus AI Assistant & Digital Student Hub',
    shortSummary: 'An automated AI-driven information ecosystem designed to streamline academic guidance, campus navigation, and real-time student support.',
    fullDescription: `
# Executive Overview

The **Smart Campus AI Assistant** is an innovative institutional initiative pioneered by the Supreme Secondary Learner Government (SSLG) in partnership with the Tech & Innovation Laboratory. The system integrates advanced large language modeling and semantic retrieval to serve over 3,000+ students and faculty members.

## Key Architecture & Features

- **Automated Academic Guidance**: Instant query resolution for curriculum syllabi, examination schedules, and scholarship policies.
- **Real-Time Notification Dispatch**: Micro-service based alert system for urgent campus announcements and weather advisories.
- **Privacy-Preserving Architecture**: Zero logging of private student credentials with end-to-end encrypted session tokens.

### Performance & Metrics

| Metric | Target Benchmark | Measured Performance |
| :--- | :--- | :--- |
| **Response Latency** | < 400ms | **210ms** |
| **Student Satisfaction** | 85% | **94.8%** |
| **Daily Active Users** | 1,000 | **1,850** |

> *"Technology must serve the human experience. By decentralizing access to campus knowledge, we empower every learner to focus on discovery and academic growth."*

### Implementation Code Sample

\`\`\`typescript
interface StudentQuery {
  id: string;
  category: 'academic' | 'administrative' | 'welfare';
  payload: string;
}

export async function processQuery(query: StudentQuery): Promise<string> {
  // Semantic search indexing across student handbook
  const context = await fetchCampusKnowledge(query.category);
  return generateInsight(query.payload, context);
}
\`\`\`
    `,
    category: 'AI & Learning',
    status: 'Featured',
    authors: ['Dr. Alexis Vance', 'Mark Rivers, M.Sc.', 'SSLG Tech Unit'],
    organization: 'Gubat NHS SSLG & Innovation Hub',
    datePublished: '2026-07-28',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
    ],
    resources: [
      { id: 'res-1', name: 'Smart Campus Technical Blueprint.pdf', url: '#', size: '4.2 MB', format: 'pdf' },
      { id: 'res-2', name: 'Student Privacy & Governance Framework.pdf', url: '#', size: '1.8 MB', format: 'pdf' },
      { id: 'res-3', name: 'System API Schemas & Documentation.zip', url: '#', size: '12.5 MB', format: 'zip' }
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Elena Rostova (Grade 12 STEM Representative)',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        date: '2026-07-29',
        text: 'This system has significantly reduced query waiting times for student council inquiries. Excellent implementation!',
        likes: 14
      },
      {
        id: 'c-2',
        author: 'Prof. Jonathan Blake',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        date: '2026-07-30',
        text: 'Crucial advancement for data-driven campus governance. Kudos to the research and student development teams.',
        likes: 8
      }
    ],
    likes: 142,
    reads: 1240,
    featured: true
  },
  {
    id: 'proj-2',
    title: 'Solar-Powered Eco-Study Pods & IoT Climate Monitors',
    shortSummary: 'Sustainable outdoor study infrastructures equipped with off-grid solar power microgrids and micro-climate monitoring sensors.',
    fullDescription: `
# Eco-Study Pod Initiative

Addressing the need for collaborative outdoor spaces, this project deployed modular study pods powered by off-grid solar panels. Each pod integrates high-efficiency photovoltaic cells, battery storage, and real-time micro-climate environmental sensors.

## Highlights & Innovations

1. **Clean Energy Grid**: 1.2kW solar canopy providing zero-carbon charging stations for 60+ devices daily.
2. **Environmental Telemetry**: Temperature, humidity, air quality index (AQI), and noise level tracking.
3. **Ergonomic & Weather-Resistant Design**: Built using recycled composite timber and heat-reflective materials.

> *"Combining environmental sustainability with practical student infrastructure creates an inspiring learning environment."*
    `,
    category: 'Sustainable Energy',
    status: 'Active',
    authors: ['Engr. Carlos Mendoza', 'SSLG Environmental Committee'],
    organization: 'Clean Tech & Green Campus Initiative',
    datePublished: '2026-07-20',
    coverImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80'
    ],
    resources: [
      { id: 'res-4', name: 'Photovoltaic Array Performance Report.pdf', url: '#', size: '2.9 MB', format: 'pdf' }
    ],
    comments: [
      {
        id: 'c-3',
        author: 'Samantha Cruz',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        date: '2026-07-22',
        text: 'The solar pods are our favorite study spot during break hours. Very comfortable!',
        likes: 22
      }
    ],
    likes: 98,
    reads: 890
  },
  {
    id: 'proj-3',
    title: 'Anonymous Student Voice & Feedback Intelligence Platform',
    shortSummary: 'A secure multi-channel platform enabling learners to express feedback, rate campus services, and submit actionable policy recommendations.',
    fullDescription: `
# Empowering Student Advocacy

The **Anonymous Student Voice Platform** provides a modern, responsive, and trustworthy feedback bridge between the student body and school administrators.

## Core Capabilities

- **Categorized Multi-Step Feedback**: Covers Academics, Facilities, Events, Leadership, and Student Welfare.
- **Data Analytics Dashboard**: Real-time aggregation of sentiment trends and satisfaction ratings for officers.
- **Transparent Response Tracking**: Public updates on student recommendations adopted by school board policies.
    `,
    category: 'Student Welfare',
    status: 'Featured',
    authors: ['SSLG Executive Cabinet', 'Student Rights Advocate Committee'],
    organization: 'Gubat NHS SSLG',
    datePublished: '2026-07-15',
    coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80'
    ],
    resources: [
      { id: 'res-5', name: 'Student Feedback Charter 2026.pdf', url: '#', size: '1.4 MB', format: 'pdf' }
    ],
    comments: [],
    likes: 215,
    reads: 1650,
    featured: true
  },
  {
    id: 'proj-4',
    title: 'Interactive Robotics & Automated STEM Learning Lab',
    shortSummary: 'Hands-on experiential learning kits and open-source robotics modules designed for peer-to-peer STEM mentoring.',
    fullDescription: `
# Robotics & STEM Innovation

Fostering technological literacy through practical robotics, microcontrollers, and embedded hardware development. This project introduced 15 custom robotics kits for high school student researchers.
    `,
    category: 'Innovation',
    status: 'Active',
    authors: ['David Chen', 'STEM Mentorship Network'],
    organization: 'Robotics & Hardware Division',
    datePublished: '2026-07-02',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    likes: 84,
    reads: 720
  }
];

export const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: 'pub-1',
    title: 'Data-Driven Governance in Secondary Education: A Case Study on SSLG Student Feedback Loops',
    journal: 'Journal of Educational Innovation & Technology',
    year: 2026,
    doi: '10.1016/j.jedu.2026.04.012',
    abstract: 'This paper examines the integration of anonymous real-time sentiment analytics into secondary school student councils. Results show a 68% increase in student civic participation and accelerated policy response resolution times.',
    authors: ['Alexis Vance', 'Mark Rivers', 'Maria Santos'],
    pdfUrl: '#',
    citation: 'Vance, A., Rivers, M., & Santos, M. (2026). Data-Driven Governance in Secondary Education. J. Educ. Innov. Tech., 14(2), 112-128.',
    category: 'Educational Governance'
  },
  {
    id: 'pub-2',
    title: 'Microgrid Solar Systems for Campus Outdoor Learning Environments in Tropical Regions',
    journal: 'Renewable & Sustainable Energy Reviews',
    year: 2025,
    doi: '10.1016/j.rser.2025.10.045',
    abstract: 'An empirical evaluation of modular photovoltaic charging stations installed across high school campuses. We analyze power generation efficiency, battery lifecycle, and thermal dissipation metrics under high humidity conditions.',
    authors: ['Carlos Mendoza', 'Alexis Vance'],
    pdfUrl: '#',
    citation: 'Mendoza, C., & Vance, A. (2025). Microgrid Solar Systems for Campus Environments. Renew. Sust. Energy Rev., 89, 401-415.',
    category: 'Sustainable Infrastructure'
  },
  {
    id: 'pub-3',
    title: 'Peer Mentorship Frameworks in High School Robotics and Embedded Computing',
    journal: 'IEEE Transactions on Education',
    year: 2025,
    doi: '10.1109/TE.2025.3289011',
    abstract: 'Investigating student-led technical workshops on embedded C++ and microcontrollers. Demonstrates significant improvement in problem-solving retention among junior high learners.',
    authors: ['David Chen', 'Elena Rostova'],
    pdfUrl: '#',
    citation: 'Chen, D., & Rostova, E. (2025). Peer Mentorship Frameworks in High School Robotics. IEEE Trans. Educ., 68(3), 210-218.',
    category: 'STEM Pedagogy'
  }
];

export const INITIAL_TEAM: TeamMember[] = [];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'SSLG Leadership & Innovation Summit 2026',
    category: 'Events',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    caption: 'Student council leaders gathered for the annual strategic planning and technology roadmap conference.',
    date: '2026-07-10'
  },
  {
    id: 'gal-2',
    title: 'Solar Study Pod Prototype Testing',
    category: 'Research',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
    caption: 'Engineers calibrating photovoltaic cells and telemetry sensors at the outdoor campus quad.',
    date: '2026-06-24'
  },
  {
    id: 'gal-3',
    title: 'Robotics Workshop Peer Mentoring',
    category: 'Innovation Showcase',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    caption: 'Senior STEM mentors demonstrating microcontroller soldering and logic programming.',
    date: '2026-06-15'
  },
  {
    id: 'gal-4',
    title: 'Gubat NHS Modern Campus Library & Digital Hub',
    category: 'Campus',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
    caption: 'The newly updated quiet research zone equipped with high-speed fiber connectivity.',
    date: '2026-05-30'
  },
  {
    id: 'gal-5',
    title: 'Student Voice Forum Panel Discussion',
    category: 'Events',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
    caption: 'Open floor Q&A session between SSLG officers and high school representatives.',
    date: '2026-05-18'
  },
  {
    id: 'gal-6',
    title: 'AI System Hackathon & Sprint',
    category: 'Innovation Showcase',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    caption: 'Collaborative programming session developing automated campus query classifiers.',
    date: '2026-04-12'
  }
];
