export const siteConfig = {
    name: 'Manoj K.C.',
    shortName: 'Manoj K.C.',

    role: 'Backend Software Engineer',

    headline:
        'Backend Software Engineer specializing in Python, Django, Django REST Framework, PostgreSQL, scalable REST APIs, and system design.',

    shortHeadline:
        'Backend Software Engineer | Python, Django & DRF | PostgreSQL',

    badge: 'DJANGO REST API BACKEND DEVELOPER',

    availability: 'Open to Remote Work',

    description:
        'Manoj K.C. is a Backend Software Engineer specializing in Python, Django, Django REST Framework, PostgreSQL, scalable REST APIs, authentication, RBAC, and system design.',

    url: 'https://manojkc1.com.np',

    contact: {
        email: 'manojkc1dev@gmail.com',
        phone: '+977-9809807760',
    },

    social: {
        github: 'https://github.com/manojkc1dev',
        linkedin: 'https://linkedin.com/in/manojkc1dev/',
    },

    seo: {
        title:
            'Manoj K.C. | Backend Software Engineer | Python, Django & DRF',
        description:
            'Portfolio of Manoj K.C., a Backend Software Engineer specializing in Python, Django, Django REST Framework, PostgreSQL, scalable REST APIs, and system design.',
        keywords: [
            'Manoj K.C.',
            'Backend Software Engineer',
            'Python Developer',
            'Django Developer',
            'Django REST Framework',
            'DRF Developer',
            'PostgreSQL',
            'REST API Developer',
            'Backend Developer Nepal',
            'Software Engineer Nepal',
        ],
    },
} as const;

export type SiteConfig = typeof siteConfig;