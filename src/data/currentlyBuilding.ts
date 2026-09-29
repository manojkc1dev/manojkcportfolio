export interface CurrentItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'planned' | 'researching';
  progress?: number;
  relatedProjectId?: string;
  since: string;
}

export const currentlyBuilding: CurrentItem[] = [
  {
    id: 'ats-resume-builder',
    title: 'ATS Resume Builder & Visual Studio',
    description:
      'Pixel-accurate A4/Letter resume previewer with automated multi-format export engines (PDF, DOCX, TXT) and fine-grained section toggle visibility.',
    status: 'active',
    progress: 70,
    since: 'Feb 2026',
  },
  {
    id: 'portfolio-drf-backend',
    title: 'Porting Portfolio Backend to Django REST',
    description:
      'Decoupling static endpoints into a production-grade Django 5 + PostgreSQL backend with automated OpenAPI schema generation and JWT admin telemetry.',
    status: 'active',
    progress: 40,
    relatedProjectId: 'agritech',
    since: 'Jan 2026',
  },
  {
    id: 'celery-redis-workers',
    title: 'Learning Celery + Redis Distributed Task Queues',
    description:
      'Deep dive into asynchronous webhook reconciliation, exponential retry policies, distributed locks, and worker monitoring via Flower.',
    status: 'active',
    since: 'Mar 2026',
  },
  {
    id: 'rag-pgvector-langchain',
    title: 'RAG with pgvector + LangChain in Django',
    description:
      'Researching semantic search pipelines over technical documentation using PostgreSQL pgvector extension and LangChain embeddings.',
    status: 'researching',
    since: 'Mar 2026',
  },
];
