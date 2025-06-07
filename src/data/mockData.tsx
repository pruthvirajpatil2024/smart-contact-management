import { Contact, KpiCard, ChartData } from '../types';
import { Users, BarChart3, Zap, CalendarDays } from 'lucide-react';

// Generate random avatars
const getRandomAvatar = (firstName: string, lastName: string) => {
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&color=fff`;
};

export const mockContacts: Contact[] = [
  {
    id: '1',
    avatar: getRandomAvatar('John', 'Doe'),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc.',
    jobTitle: 'Software Engineer',
    tags: ['client', 'tech'],
    notes: 'Met at the tech conference in San Francisco.',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-22')
  },
  {
    id: '2',
    avatar: getRandomAvatar('Jane', 'Smith'),
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Tech Solutions',
    jobTitle: 'Product Manager',
    tags: ['vendor', 'management'],
    notes: 'Prefers email over phone calls.',
    address: {
      street: '456 Market St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    },
    createdAt: new Date('2023-02-18'),
    updatedAt: new Date('2023-07-14')
  },
  {
    id: '3',
    avatar: getRandomAvatar('Robert', 'Johnson'),
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    phone: '+1 (555) 567-8901',
    company: 'Johnson & Co',
    jobTitle: 'CEO',
    tags: ['client', 'executive'],
    notes: 'Important client, handle with priority.',
    address: {
      street: '789 Oak Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    createdAt: new Date('2023-03-21'),
    updatedAt: new Date('2023-08-05')
  },
  {
    id: '4',
    avatar: getRandomAvatar('Emily', 'Brown'),
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'emily.brown@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Creative Designs',
    jobTitle: 'Creative Director',
    tags: ['partner', 'creative'],
    notes: 'Collaborating on the new marketing campaign.',
    address: {
      street: '321 Pine St',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    },
    createdAt: new Date('2023-04-12'),
    updatedAt: new Date('2023-09-18')
  },
  {
    id: '5',
    avatar: getRandomAvatar('Michael', 'Wilson'),
    firstName: 'Michael',
    lastName: 'Wilson',
    email: 'michael.wilson@example.com',
    phone: '+1 (555) 345-6789',
    company: 'Global Enterprises',
    jobTitle: 'Sales Manager',
    tags: ['lead', 'sales'],
    notes: 'Interested in our premium subscription.',
    address: {
      street: '654 Elm St',
      city: 'Dallas',
      state: 'TX',
      zip: '75201',
      country: 'USA'
    },
    createdAt: new Date('2023-05-25'),
    updatedAt: new Date('2023-10-08')
  },
  {
    id: '6',
    avatar: getRandomAvatar('Sarah', 'Davis'),
    firstName: 'Sarah',
    lastName: 'Davis',
    email: 'sarah.davis@example.com',
    phone: '+1 (555) 456-7890',
    company: 'InnoTech',
    jobTitle: 'CTO',
    tags: ['client', 'tech', 'executive'],
    notes: 'Technical decision maker for the enterprise deal.',
    address: {
      street: '987 Cedar Ave',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'USA'
    },
    createdAt: new Date('2023-06-30'),
    updatedAt: new Date('2023-11-15')
  },
  {
    id: '7',
    avatar: getRandomAvatar('David', 'Martinez'),
    firstName: 'David',
    lastName: 'Martinez',
    email: 'david.martinez@example.com',
    phone: '+1 (555) 567-8901',
    company: 'Martinez Consulting',
    jobTitle: 'Consultant',
    tags: ['consultant', 'finance'],
    notes: 'Provides financial consulting services.',
    address: {
      street: '741 Maple Dr',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'USA'
    },
    createdAt: new Date('2023-07-14'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: '8',
    avatar: getRandomAvatar('Jennifer', 'Taylor'),
    firstName: 'Jennifer',
    lastName: 'Taylor',
    email: 'jennifer.taylor@example.com',
    phone: '+1 (555) 678-9012',
    company: 'Taylor PR',
    jobTitle: 'PR Specialist',
    tags: ['vendor', 'marketing'],
    notes: 'Handles our press releases and media relations.',
    address: {
      street: '852 Birch St',
      city: 'Boston',
      state: 'MA',
      zip: '02108',
      country: 'USA'
    },
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-01-10')
  }
];

export const kpiCardsData: KpiCard[] = [
  {
    title: 'Total Contacts',
    value: mockContacts.length,
    icon: <Users className="w-5 h-5" />,
    change: {
      value: 12.5,
      type: 'increase'
    },
    color: 'primary'
  },
  {
    title: 'Active Clients',
    value: 5,
    icon: <BarChart3 className="w-5 h-5" />,
    change: {
      value: 8.3,
      type: 'increase'
    },
    color: 'success'
  },
  {
    title: 'Recently Updated',
    value: 3,
    icon: <Zap className="w-5 h-5" />,
    change: {
      value: 0,
      type: 'neutral'
    },
    color: 'accent'
  },
  {
    title: 'Last Sync',
    value: '2 days ago',
    icon: <CalendarDays className="w-5 h-5" />,
    color: 'warning'
  }
];

export const contactsOverTimeData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Contacts',
      data: [5, 8, 12, 15, 18, 22, 25, 30, 28, 32, 35, 40],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      borderWidth: 2
    }
  ]
};

export const contactsByTagData: ChartData = {
  labels: ['Client', 'Lead', 'Vendor', 'Partner', 'Consultant', 'Executive'],
  datasets: [
    {
      label: 'Contacts by Tag',
      data: [15, 8, 5, 3, 7, 6],
      backgroundColor: [
        'rgba(79, 70, 229, 0.7)',  // Primary
        'rgba(59, 130, 246, 0.7)', // Accent
        'rgba(16, 185, 129, 0.7)', // Success
        'rgba(245, 158, 11, 0.7)', // Warning
        'rgba(239, 68, 68, 0.7)',  // Error
        'rgba(107, 114, 128, 0.7)' // Gray
      ],
      borderWidth: 1
    }
  ]
};