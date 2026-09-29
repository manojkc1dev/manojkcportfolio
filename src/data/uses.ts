export interface UseItem {
  name: string;
  why: string;
  link?: string;
  tag?: string;
}

export interface UseCategory {
  title: string;
  description: string;
  items: UseItem[];
}

export const usesData: UseCategory[] = [
  {
    title: 'Hardware',
    description: 'Physical equipment and development machines driving everyday engineering.',
    items: [
      {
        name: 'Linux Development Workstation',
        why: 'Native Linux kernel environment for running Docker containers, PostgreSQL, and Celery without virtualization overhead.',
        tag: 'Ubuntu / Pop!_OS',
      },
      {
        name: 'Keychron K2 Mechanical Keyboard',
        why: 'Compact 75% tactile switches providing precise keystroke feedback for marathon coding sessions.',
        tag: 'Gateron Brown',
      },
      {
        name: 'Dell 27" 4K IPS Monitor',
        why: 'Crisp font rendering and screen real estate for simultaneous terminal, editor, and database profiling windows.',
        tag: 'UltraSharp',
      },
      {
        name: 'Logitech MX Master 3S',
        why: 'Ergonomic hand posture, custom thumb gestures, and frictionless hyper-scroll for navigating long log files.',
        tag: 'Ergonomics',
      },
    ],
  },
  {
    title: 'Editor & Terminal',
    description: 'Tools where code is written, queried, debugged, and profiled.',
    items: [
      {
        name: 'VS Code & Neovim',
        why: 'VS Code with Ruff, Pylance, and Django extensions for daily engineering; Neovim for rapid server-side config edits.',
        link: 'https://code.visualstudio.com/',
        tag: 'Primary IDE',
      },
      {
        name: 'Alacritty + Tmux',
        why: 'GPU-accelerated terminal multiplexer managing persistent sessions for Django runserver, Celery workers, and logs.',
        link: 'https://alacritty.org/',
        tag: 'Terminal',
      },
      {
        name: 'Starship Prompt + Zsh',
        why: 'Sub-millisecond prompt displaying active Python virtual environments, Git branches, and command execution times.',
        link: 'https://starship.rs/',
        tag: 'Shell',
      },
      {
        name: 'JetBrains Mono',
        why: 'Legible typeface with code ligatures that clearly distinguish operator symbols, brackets, and colons.',
        link: 'https://www.jetbrains.com/lp/mono/',
        tag: 'Font',
      },
    ],
  },
  {
    title: 'Backend Tools',
    description: 'The Python & Django ecosystem powering production API services.',
    items: [
      {
        name: 'Python 3.12 & uv',
        why: 'Lightning-fast package installation and virtual environment management replacing legacy pip workflows.',
        link: 'https://astral.sh/uv',
        tag: 'Runtime',
      },
      {
        name: 'Django 5.x & Django REST Framework',
        why: 'Battle-tested framework offering declarative serializers, ORM migrations, built-in security, and DefaultRouter.',
        link: 'https://www.djangoproject.com/',
        tag: 'Web Framework',
      },
      {
        name: 'PostgreSQL 16 & DBeaver',
        why: 'Robust relational database supporting composite B-Tree indexes, JSONB fields, and EXPLAIN ANALYZE execution inspection.',
        link: 'https://www.postgresql.org/',
        tag: 'Database',
      },
      {
        name: 'Redis 7 & Celery',
        why: 'Sub-millisecond key-value caching and distributed asynchronous queues for payment webhooks and SMS dispatches.',
        link: 'https://redis.io/',
        tag: 'Queue / Cache',
      },
      {
        name: 'Postman & HTTPie',
        why: 'Interactive REST API contract testing, environment variable management, and pre-request HMAC scripts.',
        link: 'https://www.postman.com/',
        tag: 'API Testing',
      },
    ],
  },
  {
    title: 'Frontend',
    description: 'Technologies used for building responsive, accessible web interfaces.',
    items: [
      {
        name: 'React 19 & TypeScript',
        why: 'Component-driven user interfaces with strict compile-time types preventing runtime UI regressions.',
        link: 'https://react.dev/',
        tag: 'Frontend',
      },
      {
        name: 'Tailwind CSS',
        why: 'Modern utility-first CSS framework delivering consistent design systems, dark mode, and zero bloated styles.',
        link: 'https://tailwindcss.com/',
        tag: 'Styling',
      },
      {
        name: 'Vite',
        why: 'Next-generation ES-module bundler with near-instant hot module replacement and optimized production builds.',
        link: 'https://vitejs.dev/',
        tag: 'Bundler',
      },
    ],
  },
  {
    title: 'Productivity',
    description: 'Software that organizes tasks, documents architecture, and boosts focus.',
    items: [
      {
        name: 'Notion',
        why: 'Project sprints, technical specifications, and client onboarding documentation tracking.',
        link: 'https://www.notion.so/',
        tag: 'Docs & Tasks',
      },
      {
        name: 'Obsidian',
        why: 'Local markdown knowledge base for storing software architecture notes, cheat sheets, and algorithm patterns.',
        link: 'https://obsidian.md/',
        tag: 'PKM',
      },
      {
        name: 'Raycast',
        why: 'Rapid system navigation, floating notes, clipboard history, and instant conversions.',
        link: 'https://www.raycast.com/',
        tag: 'Launcher',
      },
    ],
  },
  {
    title: 'Deployment',
    description: 'Cloud hosting, containerization, and automated CI/CD infrastructure.',
    items: [
      {
        name: 'Docker & Docker Compose',
        why: 'Isolated containerization ensuring parity between local development and production environments.',
        link: 'https://www.docker.com/',
        tag: 'DevOps',
      },
      {
        name: 'Render & Vercel',
        why: 'Render hosts Django WSGI services with Gunicorn + PostgreSQL; Vercel hosts high-speed static frontend assets.',
        link: 'https://render.com/',
        tag: 'Cloud Hosting',
      },
      {
        name: 'GitHub Actions',
        why: 'Automated CI/CD pipelines running pytest, flake8/ruff, and TypeScript builds on every pull request.',
        link: 'https://github.com/features/actions',
        tag: 'CI/CD',
      },
      {
        name: 'Cloudflare',
        why: 'Edge DNS routing, DDoS protection, and automatic SSL termination.',
        link: 'https://www.cloudflare.com/',
        tag: 'Edge CDN',
      },
    ],
  },
  {
    title: 'Learning',
    description: 'Resources and references for continuous engineering mastery.',
    items: [
      {
        name: 'Official Django Documentation',
        why: 'The definitive architectural guide for ORM query optimization, security best practices, and release notes.',
        link: 'https://docs.djangoproject.com/',
        tag: 'Reference',
      },
      {
        name: 'System Design Primer (Donne Martin)',
        why: 'Comprehensive blueprint covering high-availability distributed systems, caching tiers, and CAP theorem.',
        link: 'https://github.com/donnemartin/system-design-primer',
        tag: 'Architecture',
      },
      {
        name: 'ArjanCodes & Architecture Patterns',
        why: 'Pragmatic software design patterns, dependency injection, and clean code principles in modern Python.',
        tag: 'Software Design',
      },
    ],
  },
];
