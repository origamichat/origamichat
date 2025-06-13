# Security Policy

**Origami Chat** is an open-source project committed to building secure, privacy-conscious, and developer-friendly infrastructure from the ground up.

While we are not yet SOC 2 certified, we are actively developing with security best practices and compliance readiness in mind.

---

## 🛡️ Project Status

- This project is **fully open source** and under active development.
- Transparency and community involvement are core to how we operate.
- We are building toward **SOC 2-readiness**, but have not completed any formal audits yet.

---

## 🔒 Current Best Practices

### 1. Infrastructure & Hosting

- All data is stored and processed using trusted cloud providers, including **Railway** (runtime) and **Neon.tech** (PostgreSQL database), **Upstash** (Redis + Queuing / workflows).
- Data is encrypted at rest and in transit.
- Infrastructure access is protected with 2FA and scoped per individual—no shared credentials.

### 2. Secrets Management

- Secrets are never hardcoded or stored in version control.
- All credentials and tokens are managed securely via environment variables and provider dashboards.

### 3. Data Privacy & Access Control

- User and session data are scoped per organization using strict row-level access patterns.
- No production data is used in development or testing environments.
- Internal access is minimized and monitored.

### 4. Dependencies

- We use a modern package manager (`pnpm`) with pinned versions.
- Dependencies are routinely audited using GitHub security alerts and patched as needed.

---

## 🔍 Responsible Disclosure

If you discover a vulnerability or security issue, please report it **privately**:

📧 **anthony@origami.chat**

Please do **not** open public GitHub issues for sensitive disclosures. We will respond within 48 hours and prioritize remediation based on severity.

---

## ✅ Security Roadmap

We plan to implement the following:

- [ ] Automated dependency audits and patch pipelines
- [ ] Admin-level audit logs
- [ ] Secure self-hosting documentation
- [ ] Encryption of uploaded user content
- [ ] SOC 2 / ISO 27001 preparation (based on customer needs)

---

## 🤝 Community + Security

Security is a shared responsibility—especially in open source.
If you're integrating **Origami Chat** and spot something unclear, over-permissive, or potentially exploitable, please open a responsible issue or reach out directly.

We’re building this for developers. Help us keep it rock-solid.

— Anthony, founder of Origami Chat
