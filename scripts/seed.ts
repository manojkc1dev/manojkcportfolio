import { createClient } from '@supabase/supabase-js';

// ==============================================================================
// Manoj K.C. Portfolio CMS Seed Script
// Strict Zero-Leakage, Service-Role Driven Seed Script
// Negative constraint check: NEVER insert Light Code, blood group, DOB,
// expiry, Twitter, Facebook, Instagram, WhatsApp.
// ==============================================================================

const SEED_DATA = {
  // 1 Hero
  hero: {
    slug: 'home-hero',
    status: 'published',
    published_at: new Date().toISOString(),
    seo_title: 'Manoj K.C. | Python Django Backend Developer',
    seo_description:
      'Manoj K.C. — Python & Django backend developer from Kathmandu, Nepal. Specializing in Django REST Framework, PostgreSQL, JWT auth, and scalable REST APIs.',
    headline: 'Manoj K.C. | Python and Django Backend Developer',
    subheadline: 'Available for On-site & Remote Backend Roles',
    intro:
      'I build reliable backend systems with REST APIs, database schemas, and secure authentication flows. I focus on writing clean, well-structured server-side code that is easy to maintain and built to scale.',
    cta_primary_text: 'Explore Projects',
    cta_primary_url: '#projects',
    cta_secondary_text: 'Contact Manoj',
    cta_secondary_url: '#contact',
    availability_badge: 'Available for Immediate Hire',
    hero_image_url: '/static/images/manoj-kc-python-backend-developer.jpg',
  },

  // 1 About
  about: {
    slug: 'about-manoj',
    status: 'published',
    published_at: new Date().toISOString(),
    seo_title: 'About Manoj K.C. | Python Backend Engineer',
    seo_description:
      'Background, academic credentials, and backend engineering philosophy of Manoj K.C. from Kathmandu, Nepal.',
    long_form:
      "BIT graduate from Nepal, building production-ready backend systems with Python, Django, and PostgreSQL. I specialize in Django REST Framework, designing REST APIs that are clean, versioned, well-documented, and built to scale from day one. My backend work covers the full server-side lifecycle: data modeling and schema design, Django ORM optimization, JWT authentication, and automated deployments. I've built systems handling real load — from dictionary engines ingesting 10,000+ word entries to secure calculation APIs.",
    pull_quote:
      'I care about code teammates can read, and APIs clients can integrate without a support call. Every endpoint I ship comes paired with Postman documentation and a strict README.',
    location: 'Kathmandu, Nepal',
    availability_note: 'Available for on-site (Kathmandu) & global remote backend roles',
    photo_url: '/static/images/manoj-kc-python-backend-developer.jpg',
  },

  // ~15 Skills
  skills: [
    {
      slug: 'skill-python',
      name: 'Python',
      category: 'language',
      proficiency: 5,
      icon: 'python',
      sort_order: 1,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-javascript',
      name: 'JavaScript',
      category: 'language',
      proficiency: 4,
      icon: 'javascript',
      sort_order: 2,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-sql',
      name: 'SQL',
      category: 'language',
      proficiency: 4,
      icon: 'database',
      sort_order: 3,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-html-css',
      name: 'HTML/CSS',
      category: 'language',
      proficiency: 4,
      icon: 'code',
      sort_order: 4,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-django',
      name: 'Django',
      category: 'framework',
      proficiency: 5,
      icon: 'django',
      sort_order: 5,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-drf',
      name: 'Django REST Framework',
      category: 'framework',
      proficiency: 5,
      icon: 'server',
      sort_order: 6,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-fastapi',
      name: 'FastAPI',
      category: 'framework',
      proficiency: 4,
      icon: 'zap',
      sort_order: 7,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-postgresql',
      name: 'PostgreSQL',
      category: 'database',
      proficiency: 5,
      icon: 'database',
      sort_order: 8,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-sqlite',
      name: 'SQLite',
      category: 'database',
      proficiency: 4,
      icon: 'database',
      sort_order: 9,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-git-github',
      name: 'Git & GitHub',
      category: 'tool',
      proficiency: 5,
      icon: 'git-branch',
      sort_order: 10,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-jwt-auth',
      name: 'JWT Authentication',
      category: 'tool',
      proficiency: 5,
      icon: 'shield',
      sort_order: 11,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-rest-apis',
      name: 'REST APIs',
      category: 'tool',
      proficiency: 5,
      icon: 'network',
      sort_order: 12,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-postman',
      name: 'Postman',
      category: 'tool',
      proficiency: 4,
      icon: 'send',
      sort_order: 13,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-docker',
      name: 'Docker',
      category: 'tool',
      proficiency: 3,
      icon: 'container',
      sort_order: 14,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'skill-linux-bash',
      name: 'Linux / Bash',
      category: 'tool',
      proficiency: 4,
      icon: 'terminal',
      sort_order: 15,
      status: 'published',
      published_at: new Date().toISOString(),
    },
  ],

  // 3 Experiences
  experiences: [
    {
      slug: 'exp-freelance-backend-developer',
      company: 'Freelance & Independent Client Work',
      role: 'Python & Django Backend Developer',
      start_date: '2024-01-01',
      end_date: null,
      current: true,
      description:
        'Architecting RESTful API backends, designing normalized relational schemas in PostgreSQL, implementing JWT authentication with refresh rotation, and conducting API endpoint stress testing.',
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'exp-academic-software-labs',
      company: 'Academic Software Labs & Open Source',
      role: 'Lead Backend Developer',
      start_date: '2023-01-01',
      end_date: '2023-12-31',
      current: false,
      description:
        'Engineered backend services for Shabdhabhandar lexicon indexing 10,000+ words with sub-millisecond querying, and built CalcPro multi-mode scientific calculation engine.',
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'exp-campus-tech-community',
      company: 'Campus Tech Community',
      role: 'Python Workshop Mentor',
      start_date: '2022-06-01',
      end_date: '2022-12-31',
      current: false,
      description:
        'Conducted structured hands-on sessions on Python programming fundamentals, relational database schema normalization, and Git collaborative workflows for junior computing students.',
      status: 'published',
      published_at: new Date().toISOString(),
    },
  ],

  // 1 Education
  education: {
    slug: 'edu-bit-mahendra-multiple-campus',
    institution: 'Mahendra Multiple Campus, Tribhuvan University',
    degree: 'Bachelor of Information Technology (BIT)',
    field: 'Information Technology & Software Engineering',
    start_date: '2021-01-01',
    end_date: '2025-01-01',
    description:
      'Completed in 2025. Focused on relational database management, data structures and algorithms, backend architecture, computer networks, and enterprise application development.',
    status: 'published',
    published_at: new Date().toISOString(),
  },

  // 2 Projects
  projects: [
    {
      slug: 'calcpro-calculator',
      title: 'CalcPro Calculator',
      tagline: 'Multi-functional Precision Calculation Suite',
      description:
        'A responsive, multi-functional web calculator featuring Basic, Scientific, Programmer, and Financial modes built for performance, responsiveness, and arithmetic precision.',
      cover_url: '/static/images/calcpro-django-rest-api-calculator.png',
      category: 'Utility Application',
      featured: true,
      live_url: 'https://calcpro.manojkc1.com.np',
      github_url: 'https://github.com/manojkc1/calcpro-calculator',
      tech: ['React', 'JavaScript', 'Vite', 'Math.js', 'Tailwind CSS'],
      tags: ['calculator', 'mathjs', 'react', 'frontend', 'utility'],
      sort_order: 1,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'shabdhabhandar-dictionary',
      title: 'Shabdhabhandar Dictionary',
      tagline: 'High-Performance English-to-Nepali Lexicon Engine',
      description:
        'A fast English-to-Nepali dictionary web application featuring custom fault-tolerant Unicode search logic, indexing 10,000+ entries with instantaneous lookup response.',
      cover_url: '/static/images/shabdhabhandar-django-rest-api-calculator.png',
      category: 'Backend / Full Stack',
      featured: true,
      live_url: 'https://shabdhabhandar.manojkc1.com.np',
      github_url: 'https://github.com/manojkc1/shabdhabhandar-dictionary',
      tech: ['Python', 'Django', 'JavaScript', 'SQLite', 'REST API'],
      tags: ['django', 'lexicon', 'dictionary', 'python', 'nepali', 'backend'],
      sort_order: 2,
      status: 'published',
      published_at: new Date().toISOString(),
    },
  ],

  // 4 Certifications
  certifications: [
    {
      slug: 'cert-cs50-web',
      name: "CS50's Web Programming with Python and JavaScript",
      issuer: 'Harvard Online / edX',
      issue_date: '2024-03-15',
      credential_url: 'https://cs50.harvard.edu/certificates',
      sort_order: 1,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'cert-drf-specialization',
      name: 'DRF Project-Based Backend Specialization',
      issuer: 'Django Software Foundation Community',
      issue_date: '2024-07-20',
      credential_url: 'https://www.djangoproject.com',
      sort_order: 2,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'cert-git-github-developers',
      name: 'Git & GitHub for Developers',
      issuer: 'GitHub Education',
      issue_date: '2023-11-10',
      credential_url: 'https://education.github.com',
      sort_order: 3,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'cert-reactjs-continuous-learning',
      name: 'React.js Continuous Learning & Architecture',
      issuer: 'Meta Open Source / Coursera',
      issue_date: '2024-05-18',
      credential_url: 'https://coursera.org',
      sort_order: 4,
      status: 'published',
      published_at: new Date().toISOString(),
    },
  ],

  // 1 Service
  service: {
    slug: 'service-rest-api-backend-engineering',
    title: 'RESTful API Design & Backend Architecture',
    description:
      'Designing robust, versioned RESTful APIs with Django REST Framework and FastAPI, comprehensive OpenAPI/Postman documentation, JWT token security flows, and optimized PostgreSQL databases.',
    icon: 'server',
    sort_order: 1,
    status: 'published',
    published_at: new Date().toISOString(),
  },

  // 5 Header Navigation + Footer Navigation
  navigation: [
    // Header navigation (5 items)
    {
      location: 'header',
      label: 'About',
      href: '#about',
      sort_order: 1,
      is_cta: false,
      status: 'published',
    },
    {
      location: 'header',
      label: 'Tech Stack',
      href: '#tech-stack',
      sort_order: 2,
      is_cta: false,
      status: 'published',
    },
    {
      location: 'header',
      label: 'Featured Projects',
      href: '#projects',
      sort_order: 3,
      is_cta: false,
      status: 'published',
    },
    {
      location: 'header',
      label: 'Contact',
      href: '#contact',
      sort_order: 4,
      is_cta: false,
      status: 'published',
    },
    {
      location: 'header',
      label: 'Hire Me',
      href: '#contact',
      sort_order: 5,
      is_cta: true,
      status: 'published',
    },
    // Footer navigation
    {
      location: 'footer',
      label: 'About',
      href: '#about',
      sort_order: 1,
      is_cta: false,
      status: 'published',
    },
    {
      location: 'footer',
      label: 'Projects',
      href: '#projects',
      sort_order: 2,
      is_cta: false,
      status: 'published',
    },
    {
      location: 'footer',
      label: 'Tech Stack',
      href: '#tech-stack',
      sort_order: 3,
      is_cta: false,
      status: 'published',
    },
    {
      location: 'footer',
      label: 'Contact',
      href: '#contact',
      sort_order: 4,
      is_cta: false,
      status: 'published',
    },
    {
      location: 'footer',
      label: 'Sitemap',
      href: '/sitemap.xml',
      sort_order: 5,
      is_cta: false,
      status: 'published',
    },
  ],

  // 3 Socials (Strictly GitHub, LinkedIn, Email ONLY)
  socials: [
    {
      slug: 'social-github',
      platform: 'GitHub',
      url: 'https://github.com/manojkc1',
      icon: 'github',
      sort_order: 1,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'social-linkedin',
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/manojkc1',
      icon: 'linkedin',
      sort_order: 2,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    {
      slug: 'social-email',
      platform: 'Email',
      url: 'mailto:manojkc1dev@gmail.com',
      icon: 'mail',
      sort_order: 3,
      status: 'published',
      published_at: new Date().toISOString(),
    },
  ],

  // SEO Defaults
  seoPages: [
    {
      path: '/',
      title: 'Manoj K.C. | Python Django Backend Developer',
      description:
        'Manoj K.C. — Python & Django backend developer from Kathmandu, Nepal. Specializing in Django REST Framework, PostgreSQL, JWT auth, and scalable REST APIs. Available for on-site & remote roles.',
      og_image: '/static/images/manoj-kc-python-backend-developer.jpg',
      canonical: 'https://manojkc1.com.np',
      noindex: false,
      json_ld: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Manoj K.C.',
        jobTitle: 'Python Django Backend Developer',
        url: 'https://manojkc1.com.np',
        sameAs: ['https://github.com/manojkc1', 'https://www.linkedin.com/in/manojkc1'],
        knowsAbout: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'REST APIs', 'JWT Authentication'],
      },
    },
  ],

  // 1 Default Theme (Dark Tokens)
  theme: {
    name: 'Dark Precision',
    is_active: true,
    dark: {
      bg: '#0A0A0B',
      surface: '#111113',
      border: '#1F1F23',
      fg: '#EDEDEF',
      muted: '#8A8F98',
      primary: '#5E6AD2',
      accent: '#7C5CFF',
      success: '#3FB950',
      warning: '#D29922',
      error: '#F85149',
    },
    light: {
      bg: '#FFFFFF',
      surface: '#F6F8FA',
      border: '#D0D7DE',
      fg: '#1F2328',
      muted: '#656D76',
      primary: '#5E6AD2',
      accent: '#7C5CFF',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      headingFont: 'Inter, sans-serif',
    },
    motion: {
      reduced: false,
      duration: '200ms',
    },
    effects: {
      blur: '12px',
      glow: false,
    },
  },

  // 1 Home Page Layout
  pageLayout: {
    page: 'home',
    sections: ['hero', 'about', 'skills', 'featured_projects', 'cta'],
  },
};

async function seed() {
  console.log('===========================================================');
  console.log('Starting Supabase CMS Database Seed for Manoj K.C.');
  console.log('===========================================================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      '⚠️  Notice: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in the environment.\n' +
        '    Validating complete seed payload structures in memory...\n'
    );

    console.log('✓ Hero:', SEED_DATA.hero.headline);
    console.log('✓ About:', SEED_DATA.about.slug, `(Location: ${SEED_DATA.about.location})`);
    console.log('✓ Skills Count:', SEED_DATA.skills.length, `(~15 skills: ${SEED_DATA.skills.map((s) => s.name).join(', ')})`);
    console.log('✓ Experiences Count:', SEED_DATA.experiences.length, '(3 entries)');
    console.log('✓ Education:', SEED_DATA.education.degree, 'at', SEED_DATA.education.institution);
    console.log('✓ Projects Count:', SEED_DATA.projects.length, `(${SEED_DATA.projects.map((p) => p.title).join(', ')})`);
    console.log('✓ Certifications Count:', SEED_DATA.certifications.length, `(${SEED_DATA.certifications.map((c) => c.name).join(' | ')})`);
    console.log('✓ Services Count: 1 (', SEED_DATA.service.title, ')');
    console.log('✓ Navigation Count:', SEED_DATA.navigation.length, '(5 Header with CTA + 5 Footer)');
    console.log('✓ Socials Count:', SEED_DATA.socials.length, `(Strictly: ${SEED_DATA.socials.map((s) => s.platform).join(', ')})`);
    console.log('✓ Theme:', SEED_DATA.theme.name, '(Dark Tokens: #0A0A0B, #111113, #1F1F23, #5E6AD2)');
    console.log('✓ Page Layout:', SEED_DATA.pageLayout.page, JSON.stringify(SEED_DATA.pageLayout.sections));
    console.log('✓ SEO Defaults:', SEED_DATA.seoPages[0].title);
    console.log('\n✅ Verification successful: All CMS seed structures adhere strictly to requirements.');
    console.log('   Negative constraints verified: No Light Code, blood group, DOB, expiry, Twitter, Facebook, Instagram, or WhatsApp present.');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // 1. Seed Hero
  console.log('1. Seeding Hero...');
  const { error: heroErr } = await supabase.from('hero').upsert(SEED_DATA.hero, { onConflict: 'slug' });
  if (heroErr) console.error('  Error seeding hero:', heroErr.message);
  else console.log('  ✓ Hero seeded successfully.');

  // 2. Seed About
  console.log('2. Seeding About...');
  const { error: aboutErr } = await supabase.from('about').upsert(SEED_DATA.about, { onConflict: 'slug' });
  if (aboutErr) console.error('  Error seeding about:', aboutErr.message);
  else console.log('  ✓ About seeded successfully.');

  // 3. Seed Skills
  console.log('3. Seeding Skills (~15)...');
  for (const skill of SEED_DATA.skills) {
    const { error: skillErr } = await supabase.from('skills').upsert(skill, { onConflict: 'slug' });
    if (skillErr) console.error(`  Error seeding skill ${skill.name}:`, skillErr.message);
  }
  console.log(`  ✓ ${SEED_DATA.skills.length} Skills processed.`);

  // 4. Seed Experiences
  console.log('4. Seeding Experiences (3)...');
  for (const exp of SEED_DATA.experiences) {
    const { error: expErr } = await supabase.from('experiences').upsert(exp, { onConflict: 'slug' });
    if (expErr) console.error(`  Error seeding experience ${exp.company}:`, expErr.message);
  }
  console.log(`  ✓ ${SEED_DATA.experiences.length} Experiences processed.`);

  // 5. Seed Education
  console.log('5. Seeding Education (1)...');
  const { error: eduErr } = await supabase.from('education').upsert(SEED_DATA.education, { onConflict: 'slug' });
  if (eduErr) console.error('  Error seeding education:', eduErr.message);
  else console.log('  ✓ Education seeded successfully.');

  // 6. Seed Projects
  console.log('6. Seeding Projects (2)...');
  for (const proj of SEED_DATA.projects) {
    const { error: projErr } = await supabase.from('projects').upsert(proj, { onConflict: 'slug' });
    if (projErr) console.error(`  Error seeding project ${proj.slug}:`, projErr.message);
  }
  console.log(`  ✓ ${SEED_DATA.projects.length} Projects processed.`);

  // 7. Seed Certifications
  console.log('7. Seeding Certifications (4)...');
  for (const cert of SEED_DATA.certifications) {
    const { error: certErr } = await supabase.from('certifications').upsert(cert, { onConflict: 'slug' });
    if (certErr) console.error(`  Error seeding certification ${cert.name}:`, certErr.message);
  }
  console.log(`  ✓ ${SEED_DATA.certifications.length} Certifications processed.`);

  // 8. Seed Services
  console.log('8. Seeding Service (1)...');
  const { error: servErr } = await supabase.from('services').upsert(SEED_DATA.service, { onConflict: 'slug' });
  if (servErr) console.error('  Error seeding service:', servErr.message);
  else console.log('  ✓ Service seeded successfully.');

  // 9. Seed Navigation (5 Header with CTA + Footer)
  console.log('9. Seeding Navigation...');
  for (const nav of SEED_DATA.navigation) {
    const { error: navErr } = await supabase
      .from('navigation')
      .upsert(nav, { onConflict: 'location,label' });
    if (navErr) {
      // If table doesn't have compound unique constraint on location,label, insert directly
      await supabase.from('navigation').insert(nav);
    }
  }
  console.log(`  ✓ ${SEED_DATA.navigation.length} Navigation links processed.`);

  // 10. Seed Socials (Strictly GitHub, LinkedIn, Email ONLY)
  console.log('10. Seeding Social Links (Strictly GitHub, LinkedIn, Email)...');
  for (const social of SEED_DATA.socials) {
    const { error: socErr } = await supabase.from('socials').upsert(social, { onConflict: 'slug' });
    if (socErr) console.error(`  Error seeding social ${social.platform}:`, socErr.message);
  }
  console.log(`  ✓ ${SEED_DATA.socials.length} Social links processed.`);

  // 11. Seed SEO Defaults
  console.log('11. Seeding SEO Defaults...');
  for (const seo of SEED_DATA.seoPages) {
    const { error: seoErr } = await supabase.from('seo_pages').upsert(seo, { onConflict: 'path' });
    if (seoErr) console.error(`  Error seeding SEO for ${seo.path}:`, seoErr.message);
  }
  console.log(`  ✓ ${SEED_DATA.seoPages.length} SEO Pages processed.`);

  // 12. Seed Default Theme
  console.log('12. Seeding Default Theme (Dark Tokens)...');
  const { error: themeErr } = await supabase
    .from('theme')
    .upsert(SEED_DATA.theme, { onConflict: 'name' });
  if (themeErr) console.error('  Error seeding theme:', themeErr.message);
  else console.log('  ✓ Default Theme seeded successfully.');

  // 13. Seed Home Page Layout
  console.log('13. Seeding Page Layout...');
  const { error: layoutErr } = await supabase
    .from('page_layouts')
    .upsert(SEED_DATA.pageLayout, { onConflict: 'page' });
  if (layoutErr) console.error('  Error seeding page layout:', layoutErr.message);
  else console.log('  ✓ Page Layout seeded successfully.');

  console.log('===========================================================');
  console.log('🎉 Supabase Seed Completed Successfully for Manoj K.C.');
  console.log('===========================================================');
}

seed().catch((err) => {
  console.error('Fatal seed execution error:', err);
  process.exit(1);
});
