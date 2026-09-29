'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { TranslationKey } from '../../constants/translations';
import styles from './dashboard.module.css';

type TaskState = 'queued' | 'claimed' | 'running' | 'completed' | 'failed' | 'cancelled';
type Task = {
  id: string;
  projectId: string;
  state: TaskState;
  command: string;
  createdAt: number;
  updatedAt: number;
  attempt: number;
  result?: { summary?: string };
  failure?: { code: string; message: string };
};
type ApiError = { error?: string };

const statusLabels: Record<TaskState, TranslationKey> = {
  queued: 'agentHub.queued',
  claimed: 'agentHub.claimed',
  running: 'agentHub.running',
  completed: 'agentHub.completed',
  failed: 'agentHub.failed',
  cancelled: 'agentHub.cancelled',
};

async function readResponse<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

export default function AgentHubDashboard() {
  const { lang, t } = useLanguage();
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const [pageError, setPageError] = useState('');
  const [notice, setNotice] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [agentStatus, setAgentStatus] = useState<string>('unknown');
  const [taskLoading, setTaskLoading] = useState(false);
  const [submitPending, setSubmitPending] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [command, setCommand] = useState('');
  const taskRequestKey = useRef<{ body: string; key: string } | null>(null);

  const locale = lang === 'tr' ? 'tr-TR' : lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'de-DE';
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }), [locale]);

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => { document.documentElement.lang = previousLanguage; };
  }, [lang]);

  const loadDashboard = useCallback(async () => {
    setTaskLoading(true);
    setPageError('');
    try {
      const [tasksResponse, statusResponse] = await Promise.all([
        fetch('/api/agent-hub/tasks?limit=100', { cache: 'no-store' }),
        fetch('/api/agent-hub/status', { cache: 'no-store' }),
      ]);
      if (tasksResponse.status === 401 || statusResponse.status === 401) {
        setAuthenticated(false);
        setPageError(t('agentHub.sessionExpired'));
        return;
      }
      if (!tasksResponse.ok || !statusResponse.ok) throw new Error('unavailable');
      const taskData = await readResponse<{ tasks: Task[]; projects: string[] }>(tasksResponse);
      const statusData = await readResponse<{ agent: string }>(statusResponse);
      setTasks(taskData.tasks);
      setProjects(taskData.projects);
      setProjectId((current) => current || taskData.projects[0] || '');
      setAgentStatus(statusData.agent || 'unknown');
    } catch {
      setPageError(t('agentHub.loadFailed'));
    } finally {
      setTaskLoading(false);
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void fetch('/api/agent-hub/session', { cache: 'no-store' })
      .then((response) => {
        if (active && response.ok) {
          setAuthenticated(true);
          void loadDashboard();
        } else if (active && response.status !== 401) {
          setPageError(t('agentHub.unavailable'));
        }
      })
      .catch(() => {
        if (active) setPageError(t('agentHub.unavailable'));
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });
    return () => { active = false; };
  }, [loadDashboard, t]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginPending(true);
    setPageError('');
    try {
      const response = await fetch('/api/agent-hub/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await readResponse<ApiError>(response);
      setPassword('');
      if (!response.ok) {
        setPageError(data.error === 'rate_limited' ? t('agentHub.rateLimited') : data.error === 'unavailable' || data.error === 'dashboard_unavailable' ? t('agentHub.unavailable') : t('agentHub.invalidLogin'));
        return;
      }
      setAuthenticated(true);
      await loadDashboard();
    } catch {
      setPassword('');
      setPageError(t('agentHub.unavailable'));
    } finally {
      setLoginPending(false);
    }
  }

  async function logOut() {
    setPageError('');
    try {
      const response = await fetch('/api/agent-hub/session', { method: 'DELETE' });
      if (!response.ok) {
        setPageError(t('agentHub.unavailable'));
        return;
      }
      setAuthenticated(false);
      setTasks([]);
      setProjects([]);
      setPassword('');
      setNotice('');
    } catch {
      setPageError(t('agentHub.unavailable'));
    }
  }

  async function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitPending(true);
    setPageError('');
    setNotice('');
    try {
      const body = JSON.stringify({ projectId, command });
      if (!taskRequestKey.current || taskRequestKey.current.body !== body) {
        taskRequestKey.current = { body, key: crypto.randomUUID() };
      }
      const response = await fetch('/api/agent-hub/tasks', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'idempotency-key': taskRequestKey.current.key },
        body,
      });
      const data = await readResponse<{ error?: string }>(response);
      if (!response.ok) throw new Error(data.error ?? 'request_failed');
      taskRequestKey.current = null;
      setCommand('');
      setNotice(t('agentHub.taskCreated'));
      await loadDashboard();
    } catch {
      setPageError(t('agentHub.requestFailed'));
    } finally {
      setSubmitPending(false);
    }
  }

  const stateText = (value: string) => {
    if (value === 'online') return t('agentHub.online');
    if (value === 'stale' || value === 'unregistered') return t('agentHub.offline');
    return t('agentHub.unknown');
  };

  if (checkingSession) {
    return <main className={styles.page}><div className={styles.loading} aria-live="polite">{t('agentHub.loading')}</div></main>;
  }

  if (!authenticated) {
    return (
      <main className={styles.page}>
        <section className={styles.loginCard} aria-labelledby="agent-hub-login-title">
          <div className={styles.brandMark} aria-hidden="true">AH</div>
          <p className={styles.eyebrow}>{t('agentHub.title')}</p>
          <h1 id="agent-hub-login-title">{t('agentHub.loginTitle')}</h1>
          <p className={styles.description}>{t('agentHub.loginDescription')}</p>
          <form onSubmit={signIn} className={styles.form}>
            <label htmlFor="agent-hub-password">{t('agentHub.password')}</label>
            <input
              id="agent-hub-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              maxLength={1024}
              disabled={loginPending}
            />
            {pageError && <p className={styles.error} role="alert">{pageError}</p>}
            <button className={styles.primaryButton} type="submit" disabled={loginPending || !password}>
              {loginPending ? t('agentHub.signingIn') : t('agentHub.signIn')}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.heading}>
            <p className={styles.eyebrow}>{t('agentHub.title')}</p>
            <h1>{t('agentHub.dashboard')}</h1>
          </div>
          <button className={styles.secondaryButton} type="button" onClick={() => void logOut()}>{t('agentHub.logout')}</button>
        </header>

        {pageError && <p className={styles.errorBanner} role="alert">{pageError}</p>}
        {notice && <p className={styles.successBanner} role="status">{notice}</p>}

        <section className={styles.statusGrid} aria-label={t('agentHub.workerStatus')}>
          <article className={styles.statusCard}>
            <div className={styles.statusIcon} aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 19V8.5L12 4l8 4.5V19h-5v-6h-6v6H4Z" /></svg></div>
            <div><p>{t('agentHub.workerStatus')}</p><strong>{t('agentHub.online')}</strong></div>
            <span className={`${styles.statusDot} ${styles.good}`} aria-hidden="true" />
          </article>
          <article className={styles.statusCard}>
            <div className={styles.statusIcon} aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><rect x="5" y="3.5" width="14" height="17" rx="2" /><path d="M9 17h6" /></svg></div>
            <div><p>{t('agentHub.agentStatus')}</p><strong>{stateText(agentStatus)}</strong></div>
            <span className={`${styles.statusDot} ${agentStatus === 'online' ? styles.good : styles.neutral}`} aria-hidden="true" />
          </article>
        </section>

        <section className={styles.panel} aria-labelledby="agent-hub-submit-title">
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{t('agentHub.newTask')}</p><h2 id="agent-hub-submit-title">{t('agentHub.submit')}</h2></div></div>
          <form onSubmit={submitTask} className={styles.form}>
            <label htmlFor="agent-hub-project">{t('agentHub.project')}</label>
            <select id="agent-hub-project" value={projectId} onChange={(event) => setProjectId(event.target.value)} required disabled={!projects.length || submitPending}>
              {projects.map((project) => <option value={project} key={project}>{project}</option>)}
            </select>
            <label htmlFor="agent-hub-command">{t('agentHub.command')}</label>
            <p className={styles.hint}>{t('agentHub.commandHint')}</p>
            <textarea id="agent-hub-command" value={command} onChange={(event) => setCommand(event.target.value)} placeholder={t('agentHub.commandPlaceholder')} maxLength={8000} rows={4} required disabled={submitPending} />
            <div className={styles.formActions}>
              <button className={styles.primaryButton} type="submit" disabled={!projects.length || !command.trim() || submitPending}>
                {submitPending ? t('agentHub.submitting') : t('agentHub.submit')}
              </button>
            </div>
          </form>
        </section>

        <section className={styles.panel} aria-labelledby="agent-hub-tasks-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>{t('agentHub.dashboard')}</p><h2 id="agent-hub-tasks-title">{t('agentHub.tasks')}</h2></div>
            <button className={styles.secondaryButton} type="button" onClick={() => void loadDashboard()} disabled={taskLoading}>
              {taskLoading ? t('agentHub.loading') : t('agentHub.refresh')}
            </button>
          </div>
          {taskLoading && !tasks.length ? <p className={styles.hint} aria-live="polite">{t('agentHub.loading')}</p> : null}
          {!taskLoading && !tasks.length ? <p className={styles.empty}>{t('agentHub.noTasks')}</p> : null}
          <ul className={styles.taskList}>
            {tasks.map((task) => (
              <li className={styles.task} key={task.id}>
                <div className={styles.taskTopline}>
                  <span className={`${styles.stateBadge} ${styles[`state_${task.state}`]}`}>{t(statusLabels[task.state])}</span>
                  <span className={styles.projectBadge}>{task.projectId}</span>
                  <time dateTime={new Date(task.createdAt).toISOString()}>{dateFormatter.format(task.createdAt)}</time>
                </div>
                <details className={styles.taskDetails}>
                  <summary>{t('agentHub.taskDetails')}</summary>
                  <p className={styles.commandText}>{task.command}</p>
                  <p className={styles.taskMeta}>{t('agentHub.attempt')}: {task.attempt} · {task.id}</p>
                  {task.result?.summary && <p className={styles.resultText}>{task.result.summary}</p>}
                  {task.failure && <p className={styles.error}>{task.failure.message || task.failure.code}</p>}
                </details>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
