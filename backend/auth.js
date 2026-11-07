/* Optional cloud layer. Public URL/anonymous key only; NEVER put an OpenAI or service-role key here. */
(function () {
  'use strict';
  const SESSION_KEY = 'atlas-cloud-session-v1';
  let cfg = null, session = null, refreshing = null;
  function configured() { return !!(cfg && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY); }
  function persist(next) {
    session = next;
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new CustomEvent('atlas-auth-change', {detail: {signedIn: !!next, email: next?.user?.email || null}}));
  }
  async function request(path, options = {}, token) {
    if (!configured()) throw new Error('Cloud features need Supabase setup. Continue studying locally or follow DEPLOYMENT.md.');
    const response = await fetch(cfg.SUPABASE_URL + path, {
      ...options, headers: {'apikey': cfg.SUPABASE_ANON_KEY, 'Content-Type': 'application/json',
        ...(token ? {'Authorization': 'Bearer ' + token} : {}), ...(options.headers || {})}
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.msg || data.error_description || data.message || data.error || 'Cloud request failed (' + response.status + ').');
    return data;
  }
  function normalize(data) {
    if (!data.access_token || !data.refresh_token || !data.user?.id) throw new Error('Incomplete authentication response.');
    return {...data, expires_at: data.expires_at || Math.floor(Date.now() / 1000) + data.expires_in};
  }
  async function validSession() {
    if (!session) return null;
    if (session.expires_at > Date.now() / 1000 + 60) return session;
    if (!refreshing) refreshing = request('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST', body: JSON.stringify({refresh_token: session.refresh_token})
    }).then(data => {persist(normalize(data)); return session;}).catch(error => {
      persist(null); throw new Error('Your session expired. Sign in again.');
    }).finally(() => {refreshing = null;});
    return refreshing;
  }
  async function requireSession() { const s = await validSession(); if (!s) throw new Error('Sign in to sync progress or use the AI tutor.'); return s; }
  window.AtlasCloud = {
    async init(config) {
      cfg = {...config, SUPABASE_URL: String(config?.SUPABASE_URL || '').replace(/\/$/, '')};
      if (configured() && !/^https:\/\/[a-z0-9.-]+(?:\:[0-9]+)?$/i.test(cfg.SUPABASE_URL)) throw new Error('Supabase URL must be an HTTPS origin.');
      try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { session = null; }
      if (session && (!session.access_token || !session.refresh_token || !session.user?.id)) persist(null);
      if (!configured()) session = null;
      return await validSession();
    },
    isConfigured: configured,
    async signIn(email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
      await request('/auth/v1/otp', {method:'POST', body:JSON.stringify({email, create_user:true})});
      return {message:'Check your email for the one-time sign-in code.'};
    },
    async verifyOtp(email, token) {
      const data = await request('/auth/v1/verify', {method:'POST', body:JSON.stringify({email, token: String(token).trim(), type:'email'})});
      persist(normalize(data)); return session;
    },
    async signOut() {
      const s = await validSession().catch(() => null);
      try { if (s) await request('/auth/v1/logout', {method:'POST'}, s.access_token); }
      finally { persist(null); }
    },
    getSession: validSession,
    async loadProgress() {
      const s = await requireSession();
      const rows = await request('/rest/v1/study_progress?select=payload,updated_at&user_id=eq.' + encodeURIComponent(s.user.id), {}, s.access_token);
      return rows[0] || null;
    },
    async saveProgress(data) {
      const s = await requireSession();
      if (JSON.stringify(data).length > 200000) throw new Error('Study data is too large to sync.');
      const rows = await request('/rest/v1/study_progress?on_conflict=user_id', {
        method:'POST', headers:{Prefer:'resolution=merge-duplicates,return=representation'},
        body:JSON.stringify({user_id:s.user.id, payload:data, updated_at:new Date().toISOString()})
      }, s.access_token);
      return rows[0] || null;
    },
    async ask(messages, context = '') {
      const s = await requireSession();
      const data = await request('/functions/v1/chemistry-tutor', {
        method:'POST', body:JSON.stringify({messages: messages.slice(-8).map(m => ({role:m.role, content:String(m.content || '').slice(0,4000)})), context:String(context || '').slice(0,14000)})
      }, s.access_token);
      return data.answer;
    }
  };
})();
