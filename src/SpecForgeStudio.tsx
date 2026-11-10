import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Layers,
  ShieldCheck,
  Terminal,
  Copy,
  Check,
  Download,
  Cpu,
  Code2,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  HelpCircle,
  Wand2,
  Sliders,
  BookOpen,
  Monitor,
  Smartphone,
  Globe,
  RefreshCw,
  ChevronRight,
  Eye,
  Zap,
  Lock,
  ListChecks,
  MessageSquare,
  FolderGit2,
  Settings,
  ArrowRight,
  Cloud,
  Save,
  FolderOpen,
  Share2,
  Info,
  Compass,
  Lightbulb,
  Smartphone as PhoneIcon,
  FolderUp,
  KeyRound,
  Upload,
  HardDrive
, Folder, Bookmark } from 'lucide-react';
import type { DesktopAppInfo, GeminiSettingsInfo, SavedBlueprint } from './types/desktop';

const LOCAL_DRAFT_STORAGE_KEY = 'specforge-studio:draft-v1';
const LOCAL_BLUEPRINTS_STORAGE_KEY = 'specforge-studio:blueprints-v1';
const LOCAL_PRESETS_STORAGE_KEY = 'specforge_saved_presets_v1';

// ============================================================================
// DUMMY-PROOF HELPER CHIPS & FILE PLACEMENT INSTRUCTIONS
// ============================================================================
const QUICK_FILL_CHIPS = {
  rolePersona: [
    'Senior Next.js 15 & React 19 Full-Stack Architect',
    'Senior Mobile Systems & Cross-Platform Engineer',
    'Senior Desktop Systems & Rust Security Architect',
    'Senior Python FastAPI & Distributed Systems Engineer'
  ],
  pinnedStack: [
    'Next.js 15 App Router, React 19, TypeScript 5.x, Tailwind CSS, TanStack Query v5, Zod, Vitest',
    'React Native 0.78 (TurboModules), TypeScript, Swift 6.0, Kotlin 2.0, SQLite, Jest + RNTL',
    'Tauri v2, Rust 1.87+, React 19, TypeScript, Vite, @tauri-apps/api/core, Vitest',
    'Electron, Node.js Main, contextBridge Preload, React 19 Sandboxed Renderer, Playwright'
  ],
  verificationCommands: [
    'pnpm typecheck && pnpm lint && pnpm test',
    'npm run typecheck && npm run lint && npm test',
    'cargo check --manifest-path src-tauri/Cargo.toml && cargo test && pnpm test',
    'pytest -v && ruff check . && mypy .'
  ],
  restrictedFiles: [
    'Do NOT manually edit src/generated/, prisma/generated/, openapi/generated/, or lockfiles.',
    'Do NOT edit ios/build/, android/app/build/, or Codegen artifacts by hand.',
    'Do NOT edit src-tauri/target/, Cargo.lock, or bypass tauri dev/build scripts.'
  ]
};

const FILE_USAGE_GUIDE = {
  'TASK_PROMPT.md': {
    whatIsIt: 'Your main 5-Section Task Prompt with high-priority instructions at the top and bottom.',
    whereItGoes: 'Copy and paste this directly into the chat box of Google Antigravity, GitHub Copilot Chat, or a Google Jules task / GitHub Issue.',
    BeginnerTip: 'Start a fresh chat session for each task so the AI never suffers from "context rot"!'
  },
  'AGENTS.md': {
    whatIsIt: 'A permanent "README for AI Robots" that tells every coding agent your tech stack, folder structure, test commands, and rules automatically.',
    whereItGoes: 'Save this file as AGENTS.md in the very top (root) folder of your code project.',
    BeginnerTip: 'Once this file is in your project folder, you never have to re-explain your tech stack or test commands in chat again!'
  },
  '.specify/memory/constitution.md': {
    whatIsIt: 'Your non-negotiable project laws (like "Always write tests first" and "Never skip security checks").',
    whereItGoes: 'Save inside .specify/memory/constitution.md (or run /speckit.constitution in GitHub Spec Kit).',
    BeginnerTip: 'The AI checks this file before planning so it rejects bad shortcuts early.'
  },
  'specs/001-feature/spec.md': {
    whatIsIt: 'Plain-English description of WHAT the app should do using "WHEN [trigger], THE SYSTEM SHALL [action]" sentences.',
    whereItGoes: 'Save in specs/001-feature/spec.md (or generate via /speckit.specify).',
    BeginnerTip: 'Notice how there is zero code talk here—keeping tech choices out of this file stops the AI from guessing wrong early on.'
  },
  'specs/001-feature/tasks.md': {
    whatIsIt: 'A step-by-step checklist breaking your app into small, testable vertical slices instead of one giant overwhelming prompt.',
    whereItGoes: 'Save in specs/001-feature/tasks.md. Feed one task at a time to a fresh AI subagent.',
    BeginnerTip: 'Tasks marked [HITL] should be done with you watching in the IDE; tasks marked [AFK] can be handed off to background cloud agents.'
  },
  '.github/copilot-instructions.md': {
    whatIsIt: 'Automatic repository instructions specifically for GitHub Copilot.',
    whereItGoes: 'Save inside the .github/ folder of your project as .github/copilot-instructions.md.',
    BeginnerTip: 'GitHub Copilot reads this automatically on every chat message and Pull Request.'
  },
  'jules-setup.sh': {
    whatIsIt: 'A startup script that pre-installs your packages inside Google Jules’s cloud computer.',
    whereItGoes: 'In the Google Jules web dashboard, go to Codebases → Configuration → Initial Setup, paste this script, and click "Run and Snapshot".',
    BeginnerTip: 'Snapshotting makes Jules start up 5x faster on every future task!'
  },
  'bootstrap-agy.sh': {
    whatIsIt: 'A 1-click installer script for Google Antigravity (agy) that creates AGENTS.md, .agents/rules/, .agents/skills/, and specs/ automatically.',
    whereItGoes: 'Copy this script and paste it directly into the terminal inside Google Antigravity (or save as bootstrap-agy.sh and run: bash bootstrap-agy.sh).',
    BeginnerTip: 'Instead of creating 8 folders and files by hand, running this script sets up your entire Antigravity workspace in 1 second!'
  }
};

// ============================================================================
// PRESET TEMPLATES (Web, Mobile, Desktop) BASED ON THE DOCUMENT
// ============================================================================
const PRESETS = {
  web_nextjs: {
    label: 'Web App: Next.js 15 & React 19 SaaS Feature',
    platform: 'web',
    agent: 'antigravity',
    executionMode: 'HITL',
    plainIdea:
      'Build a team invoice approval workflow where workspace managers can filter pending invoices, preview line items, and approve or reject invoices with optimistic UI feedback and role-based audit logging.',
    userPersona: 'Workspace Finance Managers & Team Admins in a multi-tenant B2B SaaS app',
    // 5-Section Task Prompt Fields
    rolePersona: 'Senior Next.js 15 & React 19 Full-Stack Architect',
    roleFocus: 'App Router Server Components, TanStack Query v5 cache boundaries, and Zod Server Actions',
    objective: 'Implement the role-based invoice approval vertical slice with optimistic status transitions',
    observableOutcome: 'workspace managers can filter, approve, or reject invoices with zero full-page reloads and strict server-side ownership checks',
    targetFilesModify: '@src/app/(dashboard)/invoices/page.tsx, @src/features/invoices/components/InvoiceList.tsx, @src/features/invoices/components/InvoiceControls.tsx, @src/features/invoices/invoice-actions.ts',
    targetFilesRef: '@src/types/invoice.ts, @src/services/billing-service.ts, @src/lib/auth.ts',
    pinnedStack: 'Next.js 15 App Router, React 19, TypeScript 5.x (strict), Tailwind CSS, TanStack Query v5, Zustand (UI state only), Zod, Vitest, React Testing Library + MSW',
    unapprovedLibs: 'Do NOT introduce Redux, Axios, moment.js, or legacy Next.js Pages Router patterns (getServerSideProps).',
    visualContext: 'See attached mockup for InvoiceCard layout and inline rejection reason popover.',
    stateAndDataRules:
      "Keep route handlers and page.tsx synchronous composition shells; never fetch data inside page.tsx. Use params.then() or Promise.all([params, searchParams]).then() instead of top-level await params. Default feature components to async Server Components receiving plain props (id, statusFilter) and export a matching *Skeleton at the bottom of the same file. Restrict 'use client' strictly to leaf interactive subcomponents (InvoiceControls.tsx) using useOptimistic and useTransition.",
    runtimeAndSecurityLimits:
      'Validate all inputs with Zod at the Server Action boundary (@src/features/invoices/invoice-actions.ts), verify workspace manager role and tenant ownership on the server before mutating, and never trust client-supplied user IDs or role flags.',
    restrictedFiles: 'Do NOT manually edit src/generated/, prisma/generated/, openapi/generated/, or pnpm-lock.yaml.',
    taskSteps: [
      'Define the Zod input/output schemas (ApproveInvoiceSchema, RejectInvoiceSchema) and discriminated union return types in @src/features/invoices/invoice-schema.ts.',
      'Implement the server service logic in @src/services/billing-service.ts and wire validated Server Actions in @src/features/invoices/invoice-actions.ts with cache tag invalidation.',
      'Build @src/features/invoices/components/InvoiceList.tsx as an async Server Component with exported InvoiceListSkeleton, and wire synchronous <Suspense fallback={<InvoiceListSkeleton />}> in @src/app/(dashboard)/invoices/page.tsx.',
      "Implement the 'use client' leaf component @src/features/invoices/components/InvoiceControls.tsx using useOptimistic and useTransition for instant approve/reject feedback.",
      'Write behavior-first RTL + MSW integration tests verifying skeleton loading, accessible role queries (getByRole), and optimistic rollback on server failure.'
    ],
    uiStates: {
      loading: 'Render <InvoiceListSkeleton /> with matching card height inside page.tsx <Suspense> boundary.',
      empty: 'Render accessible empty state with "Clear Filters" action when no invoices match the URL status query.',
      error: 'Render ErrorBoundary fallback card with a retry callback and correlation ID.',
      offline: 'Disable mutation buttons with tooltip indicating offline network status.',
      disabled: 'Disable Approve/Reject controls when user role is Viewer or invoice is already locked.',
      success: 'Optimistically update badge to Approved/Rejected and persist audit log timestamp.'
    },
    exampleInput: '{"invoice_id": "inv_8841", "workspace_id": "ws_102", "decision": "REJECTED", "reason": "Missing PO number"}',
    exampleOutput: '{"status": "ok", "data": {"id": "inv_8841", "state": "REJECTED", "updated_at": "2026-11-09T22:15:00Z"}}',
    planFirstGate: true,
    verificationCommands: 'pnpm typecheck && pnpm lint && pnpm test --filter invoices',
    deliverableFormat: 'Generate an Implementation Plan artifact first and wait for approval. Upon completion, summarize modified files, RTL + MSW test results, and any remaining edge-case assumptions.',
    // AGENTS.md 10-Section Fields
    agentsProduct: 'Multi-tenant B2B financial workflow and spend management SaaS application used by finance managers and department leads.',
    agentsStack: 'TypeScript 5.7, Next.js 15 (App Router), React 19, Tailwind CSS v4, PostgreSQL 16, Prisma ORM, TanStack Query v5, Zustand, Zod, Vitest, React Testing Library, Mock Service Worker (MSW), Playwright.',
    agentsRepoStructure:
      'src/app/ -> Synchronous route shells, layouts, and <Suspense> boundaries\nsrc/features/<domain>/ -> Domain Server Components, leaf Client Components, and Server Actions\nsrc/services/ -> Pure business logic and data orchestration\nsrc/lib/ -> Shared infrastructure, auth session helpers, and DB client\nsrc/types/ -> Shared TypeScript interfaces and domain DTOs',
    agentsCommands:
      'Install: pnpm install\nDev Server: pnpm dev\nTypecheck: pnpm typecheck\nLint: pnpm lint\nUnit/Integration Tests: pnpm test\nSingle File Test: pnpm vitest run <path/to/file.test.tsx>\nE2E Tests: pnpm test:e2e\nProduction Build: pnpm build',
    agentsArchitecture:
      "- Keep route files (app/**/page.tsx) synchronous composition shells; never run inline DB/API queries in page.tsx.\n- Feature components default to async Server Components; place 'use client' strictly on interactive leaf components.\n- Page owns <Suspense>, Feature file exports matching *Skeleton at the bottom of the file.\n- Keep server data in Server Components or TanStack Query v5 cache; never copy server data into global Zustand stores or useEffect state.",
    agentsConventions:
      '- Prefer named exports for all components and services.\n- Use composition (children and React.ReactNode slots) instead of boolean layout props (e.g., avoid hasHeader, showFooter).\n- Use stable entity IDs (item.id) for React list keys; never use array index keys.\n- Calculate derived state inline during render; never compute derived state inside useEffect.',
    agentsTesting:
      '- Enforce Red-Green-Refactor TDD for every vertical slice.\n- Query DOM elements strictly via React Testing Library accessibility hierarchy: getByRole -> getByLabelText -> getByText.\n- Mock network boundaries with MSW; never mock internal custom hooks or use UI snapshot tests.',
    agentsSecurity:
      '- Enforce server-side workspace and resource ownership checks inside every Server Action and API route.\n- Treat client inputs (roles, prices, tenant IDs, user IDs) as untrusted; validate all external inputs with Zod at system boundaries.\n- Never log raw JWTs, API keys, or PII in server or client logs.',
    agentsDatabase:
      '- Prohibit destructive database migrations (DROP TABLE, DROP COLUMN) without explicit human approval.\n- Require a non-blocking backfill migration plan whenever adding required columns to populated tables.\n- Never edit already-applied migration files under prisma/migrations/.',
    agentsGenerated:
      'Never manually edit files in:\n- src/generated/\n- prisma/generated/\n- openapi/generated/\n- pnpm-lock.yaml\nRegenerate types via: pnpm db:generate && pnpm openapi:codegen',
    // SDD Fields
    constitutionRules:
      '1. TDD is non-negotiable: write failing behavior-first tests before application code.\n2. All database persistence must go through src/services/.\n3. Zero main-thread or SSR blocking on static route shells.\n4. Every external input must be validated with a Zod schema.',
    earsSpecs: [
      {
        when: 'a non-admin workspace member attempts to approve or reject an invoice',
        shall: 'deny the mutation at the Server Action boundary, log an unauthorized audit event, and return a typed FORBIDDEN error union'
      },
      {
        when: 'a workspace manager clicks Reject without providing a rejection note of at least 10 characters',
        shall: 'prevent submission and display an accessible inline validation message linked via aria-describedby'
      },
      {
        when: 'an invoice approval request succeeds or fails over the network',
        shall: 'immediately transition the UI via useOptimistic and automatically roll back to PENDING with a retry toast if the server returns an error'
      }
    ],
    verticalSlices: [
      {
        id: 'T001',
        mode: 'HITL',
        parallel: false,
        title: 'Invoice Approval Schema, Service & Ownership Guard',
        layers: 'Zod schema + billingService.updateInvoiceDecision() + Server Action auth guard + unit test'
      },
      {
        id: 'T002',
        mode: 'AFK',
        parallel: true,
        title: 'Async Server InvoiceList + Skeleton & Synchronous Page Shell',
        layers: 'page.tsx <Suspense> shell + async InvoiceList.tsx + InvoiceListSkeleton + MSW fixture'
      },
      {
        id: 'T003',
        mode: 'AFK',
        parallel: true,
        title: 'Optimistic Leaf InvoiceControls & RTL Integration Suite',
        layers: "'use client' InvoiceControls.tsx (useOptimistic/useTransition) + RTL getByRole & rollback test"
      }
    ]
  },

  mobile_rn: {
    label: 'Mobile App: React Native 0.78 TurboModule & Offline Sync',
    platform: 'mobile',
    agent: 'copilot',
    executionMode: 'HITL',
    plainIdea:
      'Build an offline-first field inspection checklist screen with hardware-backed biometric sign-off (iOS Secure Enclave / Android Keystore) and background SQLite synchronization over unstable cellular networks.',
    userPersona: 'Field Safety Inspectors working on iOS and Android devices in low-connectivity industrial sites',
    rolePersona: 'Senior Mobile Systems & Cross-Platform Engineer',
    roleFocus: 'React Native 0.78 New Architecture TurboModules, Swift 6.0, Kotlin 2.0 Coroutines, and offline-first SQLite',
    objective: 'Implement the Biometric Inspection Sign-Off TurboModule and offline-first Checklist screen',
    observableOutcome: 'inspectors can complete checklists offline at 60/120 fps and cryptographically sign reports via Secure Enclave / Keystore without blocking the main UI thread',
    targetFilesModify: '@src/specs/NativeBiometricSigner.ts, @ios/BiometricSigner/BiometricSignerImpl.swift, @android/app/src/main/java/com/app/biometrics/BiometricSignerModule.kt, @src/features/inspections/InspectionSignOffScreen.tsx',
    targetFilesRef: '@src/db/sqlite-sync.ts, @src/types/inspection.ts',
    pinnedStack: 'React Native 0.78 (New Architecture / Codegen TurboModules), TypeScript 5.x, iOS 18 Swift 6.0, Android API 35 Kotlin 2.0 (Coroutines / Dispatchers.IO), op-sqlite, Jest + React Native Testing Library (RNTL)',
    unapprovedLibs: 'Do NOT use legacy React Native Bridge modules, synchronous AsyncStorage for cryptographic keys, or unmaintained third-party biometric wrappers.',
    visualContext: 'Support both phone and tablet viewports in Light/Dark mode with Dynamic Type scaling up to 200%.',
    stateAndDataRules:
      'Persist all checklist progress locally in SQLite first with an outbox sync queue for 3G/offline transitions. Represent screen state as an explicit discriminated union covering loading, empty, offline (cached fallback), error (with retry), disabled, and success.',
    runtimeAndSecurityLimits:
      'ZERO main-thread blocking: execute all native bridge calls, biometric key generation, and SQLite I/O on background dispatch queues (Swift structured concurrency / Kotlin Dispatchers.IO). Store signing keys inside iOS Secure Enclave and Android Hardware-Backed Keystore (BiometricPrompt). Enforce WCAG 2.2 AA compliance, VoiceOver/TalkBack semantic traits, and 44x44pt / 48x48dp minimum touch targets.',
    restrictedFiles: 'Do NOT manually edit ios/build/, android/app/build/, or Codegen output directories.',
    taskSteps: [
      'Define the Codegen-compatible TypeScript TurboModule spec in @src/specs/NativeBiometricSigner.ts with structured error codes.',
      'Implement the iOS Swift 6.0 and Android Kotlin 2.0 native modules using background dispatch queues and hardware keystores, handling user cancellation and passcode fallback.',
      'Build @src/features/inspections/InspectionSignOffScreen.tsx handling loading, empty, offline, error, disabled, and success states with full VoiceOver/TalkBack labels and Dynamic Type support.',
      'Write Jest + RNTL component and mock TurboModule tests covering offline queuing, biometric cancellation, and successful cryptographic signature.'
    ],
    uiStates: {
      loading: 'Render skeleton shimmer without layout shift while querying local SQLite cache.',
      empty: 'Display accessible empty state with "Download Assigned Inspections" button.',
      error: 'Display non-modal banner with structured biometric/sync error code and "Retry Sign-Off" button.',
      offline: 'Show "Offline Mode — Queued for Sync" badge and commit signed payload to local SQLite outbox.',
      disabled: 'Disable "Sign & Submit" until all mandatory safety items are checked.',
      success: 'Display verified cryptographic signature hash and trigger background sync worker.'
    },
    exampleInput: '{"inspectionId": "insp_409", "payloadHash": "sha256:9f86d081884c7d659a2feaa0c55ad015"}',
    exampleOutput: '{"status": "SIGNED", "signatureBase64": "MEYCIQ...", "keyAlias": "enclave_insp_key_v1", "queuedOffline": true}',
    planFirstGate: true,
    verificationCommands: 'pnpm typecheck && pnpm lint && pnpm test -- InspectionSignOff',
    deliverableFormat: 'Output in order: (1) TypeScript TurboModule spec, (2) Native Swift & Kotlin implementations with thread-safety notes, (3) Accessible RN screen component, (4) RNTL test suite.',
    agentsProduct: 'Offline-first industrial field inspection mobile application for iOS and Android with hardware-backed cryptographic sign-off.',
    agentsStack: 'React Native 0.78 (TurboModules + Fabric), TypeScript 5.x, Swift 6.0 (iOS 17+), Kotlin 2.0 (Android Min SDK 26 / Target SDK 35), op-sqlite, Jest, React Native Testing Library.',
    agentsRepoStructure:
      'src/specs/ -> Codegen TurboModule & Fabric TypeScript specifications\nsrc/features/ -> Mobile screens, state machines, and UI widgets\nsrc/db/ -> Offline-first SQLite schema and background sync outbox\nios/ -> Native Swift 6.0 TurboModule implementations\nandroid/ -> Native Kotlin 2.0 TurboModule implementations',
    agentsCommands:
      'Install: pnpm install && npx pod-install\nTypecheck: pnpm typecheck\nLint: pnpm lint\nUnit/Widget Tests: pnpm test\nSingle Test: pnpm jest <path/to/test.tsx>\niOS Build Check: pnpm ios --mode Debug\nAndroid Build Check: pnpm android --mode debug',
    agentsArchitecture:
      '- All native bridge modules must use React Native New Architecture TurboModules with strict Codegen specs.\n- ZERO main-thread blocking: run all native hardware, crypto, and DB work on background queues (Swift Task.detached / Kotlin Dispatchers.IO).\n- Every screen must explicitly implement loading, empty, offline, error, disabled, and success states.',
    agentsConventions:
      '- Enforce WCAG 2.2 AA accessibility: every interactive element requires accessibilityRole, accessibilityLabel, and accessibilityState.\n- Support Dynamic Type text scaling without container clipping and respect edge-to-edge SafeAreaView insets.',
    agentsTesting:
      '- Mock native TurboModules at the spec boundary in Jest setup.\n- Assert behavior, accessibility roles/states, and offline state recovery using React Native Testing Library.',
    agentsSecurity:
      '- Store cryptographic keys and tokens exclusively in iOS Secure Enclave / Keychain and Android Hardware-Backed Keystore.\n- Handle biometric enrollment changes, lockout, and user cancellation gracefully.',
    agentsDatabase:
      '- All local SQLite schema migrations must be forward-compatible and preserve unsynced offline outbox rows.',
    agentsGenerated:
      'Never manually edit Codegen artifacts under ios/build/generated/ or android/app/build/generated/.',
    constitutionRules:
      '1. Zero main-thread frame drops (maintain 60/120 fps).\n2. Offline-first persistence: user actions must succeed locally when cellular connectivity drops.\n3. Hardware-backed keystore required for all auth and signing tokens.\n4. WCAG 2.2 Level AA and VoiceOver/TalkBack semantics mandatory on every widget.',
    earsSpecs: [
      {
        when: 'the device has no cellular or Wi-Fi connectivity during inspection sign-off',
        shall: 'sign the inspection payload using the local hardware keystore, store the signed record in the SQLite outbox, and display an Offline Queued confirmation state'
      },
      {
        when: 'the user cancels the native BiometricPrompt or FaceID sheet',
        shall: 'propagate a typed USER_CANCELLED code across the TurboModule bridge without crashing or clearing form state'
      }
    ],
    verticalSlices: [
      {
        id: 'T001',
        mode: 'HITL',
        parallel: false,
        title: 'TurboModule Codegen Spec & Background Swift/Kotlin Signer',
        layers: 'NativeBiometricSigner.ts + Swift 6.0 Secure Enclave + Kotlin 2.0 Keystore + mock bridge unit test'
      },
      {
        id: 'T002',
        mode: 'AFK',
        parallel: true,
        title: 'Offline SQLite Outbox & Accessible Sign-Off Screen',
        layers: 'SQLite outbox queue + 6-state InspectionSignOffScreen.tsx + VoiceOver/TalkBack labels + RNTL test'
      }
    ]
  },

  desktop_tauri: {
    label: 'Desktop App: Tauri v2 (Rust + Capabilities + IPC)',
    platform: 'desktop',
    agent: 'jules',
    executionMode: 'AFK',
    plainIdea:
      'Build a local-first encrypted log analyzer feature for our desktop app that lets engineers select a local log directory, parse and filter multi-gigabyte log files in Rust without freezing the UI, and export sanitized reports.',
    userPersona: 'Systems & Security Engineers running the desktop app on macOS, Windows, and Linux',
    rolePersona: 'Senior Desktop Systems & Rust Security Architect',
    roleFocus: 'Tauri v2 Rust backend (#[tauri::command]), least-privilege capabilities, and React 19 TypeScript frontend',
    objective: 'Implement the path-validated local log analyzer vertical slice across Rust backend, Tauri v2 IPC, and sandboxed UI',
    observableOutcome: 'users can scan local log files within scoped directories using background Rust threads with zero path traversal risk',
    targetFilesModify: '@src-tauri/src/lib.rs, @src-tauri/src/commands/log_analyzer.rs, @src-tauri/capabilities/default.json, @src/features/logs/LogAnalyzerPanel.tsx, @src/__mocks__/tauri-core.ts',
    targetFilesRef: '@src-tauri/tauri.conf.json, @vitest.config.ts',
    pinnedStack: 'Tauri v2, Rust 1.87+, TypeScript 5.x, React 19, Vite, @tauri-apps/api/core, Vitest',
    unapprovedLibs: 'NEVER import from deprecated Tauri v1 @tauri-apps/api/tauri. Do NOT enable allow-all shell or filesystem scopes.',
    visualContext: 'Desktop split-pane view with virtualized log table and progress bar during Rust file scan.',
    stateAndDataRules:
      'Manage shared Rust state via tauri::State<\'_, Mutex<AppState>> and return Result<LogSummaryDto, String> from every fallible #[tauri::command] for clean Promise rejection handling in TypeScript.',
    runtimeAndSecurityLimits:
      'Canonicalize and validate all incoming file paths in Rust to strictly prevent path traversal (../) outside the user-approved workspace directory. Declare explicit, least-privilege permissions inside src-tauri/capabilities/default.json. Preserve tauri.conf.json beforeDevCommand/beforeBuildCommand.',
    restrictedFiles: 'Do NOT manually edit src-tauri/target/, Cargo.lock, or change top-level npm run dev / build scripts to bypass tauri CLI.',
    taskSteps: [
      'Implement the Rust command parse_log_directory in @src-tauri/src/commands/log_analyzer.rs with #[tauri::command], path canonicalization against traversal, and Result<LogSummaryDto, String> return type.',
      'Register parse_log_directory inside tauri::generate_handler![...] in @src-tauri/src/lib.rs (keeping #[cfg_attr(mobile, tauri::mobile_entry_point)] intact).',
      'Grant least-privilege command and scoped directory permissions inside @src-tauri/capabilities/default.json.',
      'Build @src/features/logs/LogAnalyzerPanel.tsx invoking the command via import { invoke } from "@tauri-apps/api/core", and add a matching IPC mock in @src/__mocks__/ for Vitest.'
    ],
    uiStates: {
      loading: 'Display streaming scan progress bar with cancel button while Rust worker processes files.',
      empty: 'Show prompt to select an authorized log folder when no directory is loaded.',
      error: 'Render structured Rust Result::Err message (e.g., PathOutsideAllowedScope) with retry option.',
      offline: 'Operate 100% offline using local filesystem resources.',
      disabled: 'Disable Export button while scan is active or when 0 log entries match filter.',
      success: 'Render virtualized log table with severity counts and sanitized export confirmation.'
    },
    exampleInput: '{"directoryPath": "/Users/alice/workspace/logs", "severityFilter": "ERROR"}',
    exampleOutput: '{"totalLines": 142050, "matchedEntries": 28, "sanitizedPreview": ["[REDACTED_IP] Connection timeout"]}',
    planFirstGate: true,
    verificationCommands: 'cargo check --manifest-path src-tauri/Cargo.toml && cargo test --manifest-path src-tauri/Cargo.toml && pnpm typecheck && pnpm test',
    deliverableFormat: 'Generate an Implementation Plan first. Deliver Rust command module, lib.rs handler registration, capabilities/default.json diff, frontend component, and Cargo + Vitest test outputs.',
    agentsProduct: 'Cross-platform local-first security and log analysis desktop application built with Tauri v2 and Rust.',
    agentsStack: 'Tauri v2, Rust 1.87, React 19, TypeScript 5.x, Vite, Tailwind CSS, Cargo Test, Vitest.',
    agentsRepoStructure:
      'src-tauri/src/lib.rs -> Tauri v2 entry point and tauri::generate_handler![] registry\nsrc-tauri/src/commands/ -> Domain #[tauri::command] Rust modules\nsrc-tauri/capabilities/ -> Least-privilege Tauri v2 capability JSON files\nsrc/features/ -> Sandboxed React 19 UI components\nsrc/__mocks__/ -> Vitest mocks for @tauri-apps/api/core and Tauri plugins',
    agentsCommands:
      'Install: pnpm install\nDesktop Dev: pnpm tauri dev\nRust Check: cargo check --manifest-path src-tauri/Cargo.toml\nRust Tests: cargo test --manifest-path src-tauri/Cargo.toml\nFrontend Typecheck: pnpm typecheck\nFrontend Tests: pnpm test\nDesktop Build: pnpm tauri build',
    agentsArchitecture:
      '- Always import invoke from @tauri-apps/api/core (never v1 @tauri-apps/api/tauri).\n- Place shared Rust backend setup in src-tauri/src/lib.rs and register every command in tauri::generate_handler![].\n- Return Result<T, String> from fallible commands and wrap shared mutable state in tauri::State<\'_, Mutex<AppState>>.',
    agentsConventions:
      '- Never modify package.json dev/build scripts to call Vite directly; tauri dev/build orchestrates Vite.\n- Every new Tauri plugin or command invoked in UI must have a matching mock in src/__mocks__/ aliased in vitest.config.ts.',
    agentsTesting:
      '- Write Rust unit tests in each command module testing both valid inputs and path-traversal rejection.\n- Write Vitest + RTL tests for frontend views using mocked IPC responses.',
    agentsSecurity:
      '- Canonicalize and validate all file paths in Rust against path traversal (../../../etc/passwd) before reading or writing.\n- Enforce least-privilege permissions in src-tauri/capabilities/default.json; never grant allow-all shell or fs scopes.\n- Audit both pnpm-lock.yaml and Cargo.lock.',
    agentsDatabase:
      '- Local embedded SQLite files must reside inside app_data_dir() with strict file permissions.',
    agentsGenerated:
      'Never manually edit src-tauri/target/, dist/, or lockfiles.',
    constitutionRules:
      '1. Strict Tauri v2 API compliance (@tauri-apps/api/core + capabilities/default.json).\n2. Mandatory Rust path canonicalization to prevent directory traversal.\n3. Every #[tauri::command] must return Result<T, E> and be registered in generate_handler![].\n4. Dual test verification: both cargo test and pnpm test must pass.',
    earsSpecs: [
      {
        when: 'the frontend passes a directory path containing "../" or resolving outside the allowed workspace scope',
        shall: 'reject the call in Rust after path canonicalization and return Err("PathOutsideAllowedScope") without opening any file descriptor'
      },
      {
        when: 'a new #[tauri::command] is added to the Rust backend',
        shall: 'register the command in tauri::generate_handler![] in src-tauri/src/lib.rs and grant explicit permission in src-tauri/capabilities/default.json'
      }
    ],
    verticalSlices: [
      {
        id: 'T001',
        mode: 'HITL',
        parallel: false,
        title: 'Rust #[tauri::command] Log Parser with Path Canonicalization & Capabilities',
        layers: 'log_analyzer.rs + lib.rs generate_handler![] + capabilities/default.json + cargo test suite'
      },
      {
        id: 'T002',
        mode: 'AFK',
        parallel: true,
        title: 'Frontend LogAnalyzerPanel (@tauri-apps/api/core) & Vitest IPC Mocks',
        layers: 'LogAnalyzerPanel.tsx + src/__mocks__/tauri-core.ts + Vitest component test'
      }
    ]
  }
};

// ============================================================================
// HELPER: EXPONENTIAL BACKOFF GEMINI API CALLER (Desktop IPC + Web Fallback)
// ============================================================================
async function callGeminiStructured(
  systemPrompt: string,
  userQuery: string,
  responseSchema: Record<string, unknown>
): Promise<any> {
  if (typeof window !== 'undefined' && window.desktopAPI) {
    return window.desktopAPI.generateGeminiStructured({
      systemPrompt,
      userQuery,
      responseSchema
    });
  }

  throw new Error(
    'AI Auto-Architect requires the desktop app or a configured Gemini API key.'
  );
}

type ViewMode = 'simple' | 'intermediate' | 'pro';

const SIMPLE_ESSENTIAL_FILES: Array<{ key: string; label: string }> = [
  { key: 'TASK_PROMPT.md', label: '📋 1. Copy-Paste AI Prompt' },
  { key: 'AGENTS.md', label: '🤖 2. Project Rules (AGENTS.md)' },
  { key: 'bootstrap-agy.sh', label: '⚡ 3. 1-Click Auto-Setup' }
];

const INTERMEDIATE_CORE_FILES: Array<{ key: string; label: string; subtitle: string }> = [
  { key: 'TASK_PROMPT.md', label: 'TASK_PROMPT.md', subtitle: 'Your main AI task prompt' },
  { key: 'AGENTS.md', label: 'AGENTS.md', subtitle: 'Permanent project rules' },
  { key: 'specs/001-feature/spec.md', label: 'spec.md', subtitle: 'Feature requirements (EARS)' },
  { key: 'specs/001-feature/tasks.md', label: 'tasks.md', subtitle: 'Step-by-step feature slices' },
  {
    key: '.specify/memory/constitution.md',
    label: 'constitution.md',
    subtitle: 'Core non-negotiable laws'
  },
  { key: 'bootstrap-agy.sh', label: 'bootstrap-agy.sh', subtitle: '1-click Antigravity setup' }
];

interface IntermediateRulePreset {
  id: string;
  label: string;
  helper: string;
  targetField: 'stateAndDataRules' | 'runtimeAndSecurityLimits';
  technicalRule: string;
}

const INTERMEDIATE_RULE_PRESETS: IntermediateRulePreset[] = [
  {
    id: 'server_client_split',
    label: 'Keep data fetching separate from visual design (Server/Client split)',
    helper: 'Keeps data queries out of interactive UI leaves so state stays predictable and fast.',
    targetField: 'stateAndDataRules',
    technicalRule:
      "- Separate server data fetching from client UI rendering: keep queries/mutations in server or service boundaries and restrict 'use client' strictly to leaf interactive components."
  },
  {
    id: 'require_passing_tests',
    label: 'Require automated tests to pass before finishing tasks',
    helper: 'Prevents the AI from marking a task done until typecheck and tests succeed.',
    targetField: 'runtimeAndSecurityLimits',
    technicalRule:
      '- Gate every task completion on passing typecheck, lint, and scoped unit/integration tests without skipping or weakening assertions.'
  },
  {
    id: 'path_traversal_protection',
    label: 'Prevent file path hacks or security holes (Path Traversal protection)',
    helper: 'Enforces safe root boundary checks against ../ path escapes and untrusted inputs.',
    targetField: 'runtimeAndSecurityLimits',
    technicalRule:
      '- Enforce strict path canonicalization and root-boundary validation on every filesystem or IPC input to prevent path traversal (../) and injection vulnerabilities.'
  }
];

function deriveTracerBulletLayers(title: string, platform: string): string {
  const boundary =
    platform === 'desktop'
      ? 'Typed IPC Bridge'
      : platform === 'mobile'
        ? 'Native Module Boundary'
        : 'Validated API Boundary';
  const normalized = title.trim().toLowerCase();
  const dataLayer = normalized.includes('auth') ? 'Auth Schema' : 'Data Schema';
  return `${dataLayer} + Domain Service + ${boundary} + UI Slice + Automated Test`;
}

type ExpandableFieldKey = 'plainIdea' | 'objective' | 'observableOutcome';

function buildOfflineExpandedBullets(
  fieldKey: ExpandableFieldKey,
  currentValue: string,
  platform: string,
  userPersona: string
): string {
  const persona = (userPersona || 'target users').trim();
  const platformLabel =
    platform === 'desktop' ? 'desktop app' : platform === 'mobile' ? 'mobile app' : 'web app';
  if (fieldKey === 'objective') {
    return `(Includes input validation, loading/error states, and automated tests for our ${platformLabel}.)`;
  }
  if (fieldKey === 'observableOutcome') {
    return `(Verified with instant visual feedback, safe error recovery, and accessible controls for ${persona}.)`;
  }
  const topicHint = currentValue ? 'for this workflow' : `for the ${platformLabel}`;
  return [
    `- Provide clear loading, empty, and error feedback states ${topicHint}`,
    `- Validate all user inputs and keep actions responsive for ${persona}`,
    `- Include automated verification checks so core flows stay reliable`
  ].join('\n');
}

function ExpandedTextHighlight({
  fieldKey,
  text,
  onClear
}: {
  fieldKey: ExpandableFieldKey;
  text: string;
  onClear: () => void;
}) {
  return (
    <div
      data-testid={`expanded-highlight-${fieldKey}`}
      className="mt-2 bg-amber-500/15 border-l-2 border-amber-400 px-2.5 py-2 rounded text-xs text-amber-100 space-y-1.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-amber-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Newly Expanded Options (Added to Input Above)</span>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClear}
            className="px-2 py-0.5 rounded bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/50 text-[11px] font-semibold text-amber-100 transition"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-2 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 transition"
          >
            Clear Highlight
          </button>
        </div>
      </div>
      <div className="bg-amber-500/15 border-l-2 border-amber-400 px-1 rounded whitespace-pre-wrap text-[11px] text-amber-50">
        {text}
      </div>
    </div>
  );
}

/** Collapsible, tooltip-friendly plain-language explanation card for Intermediate Mode. */
function JargonTranslationCard({
  term,
  explanation
}: {
  term: string;
  explanation: string;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div
      title={explanation}
      className="rounded-xl bg-indigo-950/35 border border-indigo-500/30 px-3 py-2 text-xs text-indigo-100"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Plain-English Guide: {term}</span>
        </span>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-[11px] text-indigo-300 hover:underline shrink-0"
        >
          {expanded ? 'Hide' : 'Explain'}
        </button>
      </div>
      {expanded && (
        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{explanation}</p>
      )}
    </div>
  );
}

export default function SpecForgeStudio() {
  // Active workspace tab ('ideation' first in Simple Mode)
  const [activeTab, setActiveTab] = useState('ideation');
  // 3-way view selector: Simple (No-Code Wizard), Intermediate (Pro-Light), Pro (All 14 Files)
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const isSimpleMode = viewMode === 'simple';
  const isIntermediateMode = viewMode === 'intermediate';
  const isProMode = viewMode === 'pro';
  const dummyProofMode = isSimpleMode;
  const showPlainHelpers = !isProMode;
  // Optional toggle inside Simple/Intermediate dock to peek at all 14 files
  const [showAllSimpleFiles, setShowAllSimpleFiles] = useState(false);
  // Auto-Expand Options loading & visual highlight state
  const [expandingField, setExpandingField] = useState<ExpandableFieldKey | null>(null);
  const [expandedHighlights, setExpandedHighlights] = useState<
    Partial<Record<ExpandableFieldKey, string>>
  >({});
  // Mobile view switcher ('editor' | 'preview') for small screens
  const [mobilePane, setMobilePane] = useState('editor');
  // Active preview file in the right-hand artifact dock
  const [selectedArtifact, setSelectedArtifact] = useState('TASK_PROMPT.md');
  // Copy toast feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  // Status banner message
  const [statusMessage, setStatusMessage] = useState<{ type: string; text: string } | null>(null);

  // Timeout refs to clean up on unmount or re-trigger
  const statusTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  /** Sets statusMessage and clears only if it is still the active message when the timer expires. */
  const setStatusMessageWithTimeout = (msg: { type: string; text: string } | null, duration: number = 4000) => {
    setStatusMessage(msg);
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    if (msg !== null) {
      statusTimeoutRef.current = setTimeout(
        () => setStatusMessage((current) => (current === msg ? null : current)),
        duration
      );
    }
  };

  // Desktop & Local Blueprint Storage State
  const [desktopInfo, setDesktopInfo] = useState<DesktopAppInfo | null>(null);
  const [cloudModalOpen, setCloudModalOpen] = useState(false);
  const [presetsModalOpen, setPresetsModalOpen] = useState(false);
  const [savedPresets, setSavedPresets] = useState<any[]>([]);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [geminiSettings, setGeminiSettings] = useState<GeminiSettingsInfo>({
    hasKey: false,
    source: 'none'
  });
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isExportingFolder, setIsExportingFolder] = useState(false);

  const [projectTitle, setProjectTitle] = useState(() => {
    try {
      const savedDraft = localStorage.getItem(LOCAL_DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed?.projectTitle) return parsed.projectTitle;
      }
    } catch {
      // ignore malformed draft
    }
    return 'My Invoice Approval App';
  });
  const [blueprintTag, setBlueprintTag] = useState('');
  const [mySavedProjects, setMySavedProjects] = useState<SavedBlueprint[]>([]);
  const [sharedCloudProjects, setSharedCloudProjects] = useState<SavedBlueprint[]>([]);
  const [isSavingCloud, setIsSavingCloud] = useState(false);

  // Core Form State initialized from saved draft or Web Next.js 15 preset
  const [form, setForm] = useState<any>(() => {
    const defaultForm = {
      ...PRESETS.web_nextjs,
      // Platform-specific extra config fields
      pointerStyle: '@path', // '@path' (Antigravity / Copilot CLI) or '#file' (VS Code)
      desktopFramework: 'tauri_v2', // 'tauri_v2' or 'electron'
      // Antigravity Rule Config
      agyRuleName: 'architecture-boundaries',
      agyTrigger: 'always_on', // 'always_on' | 'model_decision' | 'glob' | 'manual'
      agyGlobs: '*.tsx, src/features/**/*.ts',
      agyRuleDescription:
        'Enforces strict UI/Server boundary separation, state placement, and security validation rules.',
      // Antigravity Skill Config
      agySkillName: 'verify-vertical-slice',
      agySkillDescription:
        'Executes the project typecheck, linter, and scoped unit/integration test suite for a completed vertical slice. Use when verifying code changes before marking a task complete.',
      // Copilot Path-Specific Instruction Config
      copilotInstructionName: 'domain-boundaries',
      copilotApplyTo: 'src/features/**/*.tsx,src/app/**/*.tsx',
      copilotExcludeAgent: 'none', // 'none' | 'code-review' | 'cloud-agent'
      // Copilot Custom Agent Config
      copilotAgentName: 'implementation-planner',
      copilotAgentRole: 'planner', // 'planner' (read/search only) | 'implementer' (full tools)
      // Monorepo Nested AGENTS.md Config
      enableNestedAgents: true,
      nestedSubprojectPath: 'apps/mobile',
      nestedCommandOverrides:
        'Test Package Only: pnpm --filter @app/mobile test\nTypecheck Package: pnpm --filter @app/mobile typecheck',
      nestedLocalConstraints:
        'Enforce 60/120 fps frame budget; run all TurboModule calls on background queues.'
    };

    try {
      const savedDraft = localStorage.getItem(LOCAL_DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed?.form) {
          return {
            ...defaultForm,
            ...parsed.form,
            uiStates: {
              ...defaultForm.uiStates,
              ...(parsed.form.uiStates || {})
            }
          };
        }
      }
    } catch {
      // ignore malformed draft
    }

    return defaultForm;
  });

  // AI Loading & Socratic /grill-me Interview State
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isGrilling, setIsGrilling] = useState(false);
  const [grillQuestions, setGrillQuestions] = useState<
    Array<{ id: string; focusArea: string; question: string; options: string[] }>
  >([]);
  const [grillAnswers, setGrillAnswers] = useState<Record<string, string>>({});

  // Auto-save active draft locally so work survives app restarts
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_DRAFT_STORAGE_KEY,
        JSON.stringify({ projectTitle, form })
      );
    } catch (err) {
      console.warn('Draft auto-save skipped:', err);
    }
  }, [projectTitle, form]);

  // ============================================================================
  // DESKTOP INITIALIZATION & LOCAL BLUEPRINT STORAGE
  // ============================================================================

  const handleSavePreset = () => {
    if (!presetNameInput.trim()) return;
    const newPreset = {
      id: Date.now().toString(),
      name: presetNameInput.trim(),
      updatedAt: Date.now(),
      platform: form.platform,
      agent: form.agent,
      form: { ...form }
    };
    const next = [newPreset, ...savedPresets];
    setSavedPresets(next);
    localStorage.setItem(LOCAL_PRESETS_STORAGE_KEY, JSON.stringify(next));
    setPresetNameInput('');
    setStatusMessageWithTimeout({
      type: 'success',
      text: `Saved preset "${newPreset.name}"!`
    });
  };

  const handleLoadPreset = (preset: any) => {
    setForm({ ...preset.form });
    setPresetsModalOpen(false);
    setStatusMessageWithTimeout({
      type: 'success',
      text: `Loaded preset "${preset.name}"!`
    });
  };

  const handleDeletePreset = (id: string) => {
    const next = savedPresets.filter(p => p.id !== id);
    setSavedPresets(next);
    localStorage.setItem(LOCAL_PRESETS_STORAGE_KEY, JSON.stringify(next));
  };

  const handleResetToDefaultPreset = () => {
    setForm({
      ...PRESETS.web_nextjs,
      pointerStyle: '@path',
      desktopFramework: 'tauri_v2',
      agyRuleName: 'architecture-boundaries',
      agyTrigger: 'always_on',
      agyGlobs: '*.tsx, src/features/**/*.ts',
      agyRuleDescription: 'Enforces strict UI/Server boundary separation, state placement, and security validation rules.',
      agySkillName: 'verify-vertical-slice',
      agySkillDescription: 'Executes the project typecheck, linter, and scoped unit/integration test suite for a completed vertical slice. Use when verifying code changes before marking a task complete.',
      copilotInstructionName: 'domain-boundaries',
      copilotApplyTo: 'src/features/**/*.tsx,src/app/**/*.tsx',
      copilotExcludeAgent: 'none',
      copilotAgentName: 'implementation-planner',
      copilotAgentRole: 'planner',
      enableNestedAgents: true,
      nestedSubprojectPath: 'apps/mobile',
      nestedCommandOverrides: 'Test Package Only: pnpm --filter @app/mobile test\nTypecheck Package: pnpm --filter @app/mobile typecheck',
      nestedLocalConstraints: 'Enforce 60/120 fps frame budget; run all TurboModule calls on background queues.'
    });
    setPresetsModalOpen(false);
    setStatusMessageWithTimeout({
      type: 'success',
      text: 'Reset to Web Next.js default preset!'
    });
  };

  const refreshBlueprints = async () => {
    if (window.desktopAPI) {
      const list = await window.desktopAPI.listBlueprints();
      setMySavedProjects(list);
      setSharedCloudProjects(list.filter((b) => Boolean(b.tag)));
      return;
    }

    try {
      const raw = localStorage.getItem(LOCAL_BLUEPRINTS_STORAGE_KEY);
      const list: SavedBlueprint[] = raw ? JSON.parse(raw) : [];
      list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      setMySavedProjects(list);
      setSharedCloudProjects(list.filter((b) => Boolean(b.tag)));
    } catch {
      setMySavedProjects([]);
      setSharedCloudProjects([]);
    }
  };

  useEffect(() => {
    void refreshBlueprints();
    try {
      const raw = localStorage.getItem(LOCAL_PRESETS_STORAGE_KEY);
      if (raw) setSavedPresets(JSON.parse(raw));
    } catch {}

    if (window.desktopAPI) {
      window.desktopAPI.getAppInfo().then(setDesktopInfo).catch(console.error);
      window.desktopAPI.getGeminiSettings().then(setGeminiSettings).catch(console.error);
    }
  }, []);

  const handleSaveGeminiKey = async (clearKey = false) => {
    if (!window.desktopAPI) return;
    setIsSavingSettings(true);
    try {
      const next = await window.desktopAPI.setGeminiApiKey(clearKey ? '' : geminiKeyInput);
      setGeminiSettings(next);
      setGeminiKeyInput('');
      setSettingsModalOpen(false);
      setStatusMessage({
        type: 'success',
        text: clearKey
          ? 'Cleared stored Gemini API key.'
          : 'Saved Gemini API key securely on this Ubuntu desktop! AI Auto-Architect and /grill-me are ready.'
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Could not save API key: ${err?.message || err}`
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Save current project locally on Ubuntu desktop (with optional Tag for filtering/sharing)
  const handleSaveToCloud = async (withTag = false) => {
    setIsSavingCloud(true);
    try {
      const cleanId =
        projectTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'blueprint';

      const payload = {
        id: cleanId,
        title: projectTitle || 'Untitled Blueprint',
        tag: withTag ? blueprintTag.trim().toLowerCase() : '',
        formState: JSON.stringify(form)
      };

      if (window.desktopAPI) {
        await window.desktopAPI.saveBlueprint(payload);
      } else {
        const raw = localStorage.getItem(LOCAL_BLUEPRINTS_STORAGE_KEY);
        const list: SavedBlueprint[] = raw ? JSON.parse(raw) : [];
        const record: SavedBlueprint = {
          ...payload,
          updatedAt: Date.now()
        };
        const next = [record, ...list.filter((item) => item.id !== record.id)];
        localStorage.setItem(LOCAL_BLUEPRINTS_STORAGE_KEY, JSON.stringify(next));
      }

      await refreshBlueprints();
      setStatusMessage({
        type: 'success',
        text: withTag
          ? `Saved "${projectTitle}" locally with tag "#${blueprintTag || 'untagged'}". You can also export it as a .specforge.json file!`
          : `Saved "${projectTitle}" to your Ubuntu desktop workspace!`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Failed to save blueprint: ${err?.message || err}`
      });
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleLoadFromCloud = (item: SavedBlueprint) => {
    try {
      const parsed = JSON.parse(item.formState);
      setForm((prev) => ({ ...prev, ...parsed }));
      setProjectTitle(item.title || 'Loaded Project');
      if (item.tag) setBlueprintTag(item.tag);
      setCloudModalOpen(false);
      setStatusMessage({
        type: 'success',
        text: `Loaded "${item.title}"! All generated files and sections are updated.`
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Could not parse saved project data.'
      });
    }
  };

  const handleDeleteCloudItem = async (id: string) => {
    try {
      if (window.desktopAPI) {
        await window.desktopAPI.deleteBlueprint(id);
      } else {
        const raw = localStorage.getItem(LOCAL_BLUEPRINTS_STORAGE_KEY);
        const list: SavedBlueprint[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(
          LOCAL_BLUEPRINTS_STORAGE_KEY,
          JSON.stringify(list.filter((item) => item.id !== id))
        );
      }
      await refreshBlueprints();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleExportBlueprintJson = async (item: SavedBlueprint) => {
    try {
      if (window.desktopAPI) {
        const res = await window.desktopAPI.exportBlueprintFile(item);
        if (!res.canceled && res.filePath) {
          setStatusMessageWithTimeout({
            type: 'success',
            text: `Exported blueprint JSON to ${res.filePath}`
          });
        }
        return;
      }
      await handleDownloadFile(`${item.id || 'blueprint'}.specforge.json`, JSON.stringify(item, null, 2));
    } catch (err: any) {
      console.error('Export blueprint error:', err);
      setStatusMessage({
        type: 'error',
        text: `Export failed: ${err?.message || err}`
      });
    }
  };

  const handleImportBlueprintJson = async () => {
    if (!window.desktopAPI) return;
    try {
      const res = await window.desktopAPI.importBlueprintFile();
      if (res.canceled) return;
      if (res.error || !res.blueprint) {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Could not import blueprint JSON.'
        });
        return;
      }
      const saved = await window.desktopAPI.saveBlueprint({
        id: res.blueprint.id,
        title: res.blueprint.title,
        tag: res.blueprint.tag,
        formState: res.blueprint.formState
      });
      await refreshBlueprints();
      handleLoadFromCloud(saved);
    } catch (err: any) {
      console.error('Import blueprint error:', err);
      setStatusMessage({
        type: 'error',
        text: `Import failed: ${err?.message || err}`
      });
    }
  };

  // Helper to update form fields
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateUiState = (stateKey, value) => {
    setForm((prev) => ({
      ...prev,
      uiStates: { ...prev.uiStates, [stateKey]: value }
    }));
  };

  // Load a preset template
  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    setForm((prev) => ({
      ...prev,
      ...preset
    }));
    setStatusMessageWithTimeout({
      type: 'success',
      text: `Loaded "${preset.label}" preset across all prompt, AGENTS.md, and SDD sections.`
    }, 4000);
  };

  // Inject Domain Boundary Invariant Preset into Section 3
  const applyDomainInvariants = (domainType) => {
    if (domainType === 'web') {
      updateField('platform', 'web');
      updateField(
        'stateAndDataRules',
        "1. Keep route files (app/**/page.tsx and layout.tsx) synchronous composition shells; never fetch data in page.tsx. Use params.then() instead of top-level await params.\n2. Feature components default to async Server Components receiving plain props; export a matching *Skeleton at the bottom of the same file. Parent page.tsx wraps features in <Suspense fallback={<FeatureSkeleton />}.\n3. Restrict 'use client' strictly to leaf interactive components using useOptimistic and useTransition.\n4. Keep server data in Server Components or TanStack Query v5 cache; never copy server state into Zustand or useEffect. Use React.ReactNode slots instead of boolean layout props."
      );
      updateField(
        'runtimeAndSecurityLimits',
        "Validate all external inputs with Zod at the 'use server' Action boundary, verify resource ownership on the server before mutating, and test behavior with React Testing Library (getByRole -> getByLabelText -> getByText) + MSW."
      );
    } else if (domainType === 'mobile') {
      updateField('platform', 'mobile');
      updateField(
        'stateAndDataRules',
        '1. Offline-first capability using local SQLite/Room cache with an outbox queue for unstable 3G/cellular transitions.\n2. Explicitly implement a discriminated union / sealed interface for all 6 UI states: loading, empty, offline, error (with retry), disabled, and success.'
      );
      updateField(
        'runtimeAndSecurityLimits',
        '1. ZERO main-thread blocking: run all native bridge calls (Codegen TurboModules / Platform Channels), crypto, and disk I/O on background dispatch queues (Swift structured concurrency / Kotlin Coroutines Dispatchers.IO).\n2. Store sensitive tokens inside iOS Secure Enclave / Keychain and Android Hardware-Backed Keystore (BiometricPrompt).\n3. Enforce WCAG 2.2 AA compliance, VoiceOver/TalkBack semantic traits, minimum touch targets, and Dynamic Type text scaling without clipping.'
      );
    } else if (domainType === 'desktop_tauri') {
      updateField('platform', 'desktop');
      updateField('desktopFramework', 'tauri_v2');
      updateField(
        'stateAndDataRules',
        "1. Import invoke strictly from '@tauri-apps/api/core' (NEVER deprecated v1 '@tauri-apps/api/tauri').\n2. Define Rust commands with #[tauri::command] returning Result<OutputDto, String> and manage shared state via tauri::State<'_, Mutex<AppState>>.\n3. Register every command inside tauri::generate_handler![...] in src-tauri/src/lib.rs."
      );
      updateField(
        'runtimeAndSecurityLimits',
        '1. Canonicalize and validate all incoming file paths in Rust to prevent path traversal (../../../etc/passwd) outside allowed directories.\n2. Declare explicit, least-privilege permissions in src-tauri/capabilities/default.json (never allow-all scopes).\n3. Preserve tauri.conf.json build chain and add matching IPC mocks in src/__mocks__/ for Vitest.'
      );
    } else if (domainType === 'desktop_electron') {
      updateField('platform', 'desktop');
      updateField('desktopFramework', 'electron');
      updateField(
        'stateAndDataRules',
        "1. Enforce 3-Tier Process Isolation: Main Process (ipcMain.handle) <-> Preload Script (contextBridge.exposeInMainWorld) <-> Sandboxed Renderer UI.\n2. Expose only narrow, domain-specific methods on window.desktopAPI calling ipcRenderer.invoke('domain:action', payload); never expose raw ipcRenderer."
      );
      updateField(
        'runtimeAndSecurityLimits',
        "1. Enforce the 3 Absolute Laws of Electron Security on BrowserWindow: contextIsolation: true, nodeIntegration: false, and sandbox: true.\n2. Inject strict Content-Security-Policy headers (default-src 'self'; script-src 'self') and validate all IPC payloads with Zod/schema checks in ipcMain.handle() before invoking OS filesystem or shell APIs."
      );
    }
    setStatusMessageWithTimeout({
      type: 'info',
      text: `Injected production ${domainType.toUpperCase()} architectural boundary invariants into Section 3.`
    }, 3500);
  };

  // ============================================================================
  // AI MAGIC AUTO-ARCHITECT (Transforms plain language into all sections)
  // ============================================================================
  const clearExpandedHighlight = (fieldKey: ExpandableFieldKey) => {
    setExpandedHighlights((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const handleAutoExpandField = async (fieldKey: ExpandableFieldKey) => {
    const currentValue = String(form[fieldKey] || '').trim();
    setExpandingField(fieldKey);

    try {
      let addedText = '';
      const canCallAI = Boolean(window.desktopAPI && geminiSettings.hasKey);

      if (canCallAI) {
        try {
          const systemPrompt =
            'You are a Senior Product & Software Architect. Given a user draft, return 3 concise, plain-language engineering bullets that flesh out edge cases, user feedback states, and validation.';
          const userQuery = `Field: ${fieldKey}\nPlatform: ${form.platform}\nUsers: ${form.userPersona}\nCurrent Text: ${currentValue}`;
          const schema = {
            type: 'OBJECT',
            properties: {
              bullets: {
                type: 'ARRAY',
                items: { type: 'STRING' }
              }
            },
            required: ['bullets']
          };
          const res = await callGeminiStructured(systemPrompt, userQuery, schema);
          if (Array.isArray(res?.bullets) && res.bullets.length > 0) {
            addedText = res.bullets
              .map((b: string) => (b.trim().startsWith('-') ? b.trim() : `- ${b.trim()}`))
              .join('\n');
          }
        } catch {
          // Fall back to deterministic offline expander if Gemini call fails
        }
      }

      if (!addedText) {
        addedText = buildOfflineExpandedBullets(
          fieldKey,
          currentValue,
          form.platform,
          form.userPersona
        );
      }

      const separator = fieldKey === 'plainIdea' ? '\n' : ' ';
      const nextVal = currentValue ? `${currentValue}${separator}${addedText}` : addedText;
      updateField(fieldKey, nextVal);
      setExpandedHighlights((prev) => ({
        ...prev,
        [fieldKey]: addedText
      }));
    } finally {
      setExpandingField(null);
    }
  };

  const applyOfflineSmartTemplates = () => {
    const idea = form.plainIdea.trim();
    const persona = (form.userPersona || 'end users').trim();
    const shortIdea = idea.length > 90 ? `${idea.slice(0, 87)}...` : idea;

    setForm((prev: any) => {
      const existingEars = Array.isArray(prev.earsSpecs) ? [...prev.earsSpecs] : [];
      const firstEars = {
        when: `a user interacts with ${shortIdea}`,
        shall: `complete the workflow reliably for ${persona} with clear status feedback and error recovery`
      };
      const updatedEars =
        existingEars.length > 0 ? [firstEars, ...existingEars.slice(1)] : [firstEars];

      return {
        ...prev,
        objective: `Build and verify: ${idea} (for ${persona}).`,
        observableOutcome: `Users (${persona}) can complete "${shortIdea}" end-to-end with validated inputs, clear loading/empty/error states, and passing automated tests.`,
        agentsProduct: `${idea} — built for ${persona}.`,
        earsSpecs: updatedEars
      };
    });

    setStatusMessage({
      type: 'success',
      text: 'Built your custom AI instructions using Offline Smart Templates! (Add a free Gemini key in AI Key settings anytime for deeper AI generation.)'
    });
  };

  const handleMagicAutoArchitect = async () => {
    if (!form.plainIdea.trim()) {
      setStatusMessage({
        type: 'warning',
        text: 'Please describe your plain-language app or feature idea first!'
      });
      return;
    }

    if (window.desktopAPI && !geminiSettings.hasKey) {
      applyOfflineSmartTemplates();
      return;
    }

    setIsGeneratingAll(true);
    setStatusMessage({
      type: 'info',
      text: 'Synthesizing 5-Section Prompt Contract, 10-Section AGENTS.md, EARS Specs, and Vertical Slices from your plain language idea...'
    });

    const systemPrompt = `You are a Principal Spec-Driven Development (SDD) & Context Engineering Architect specializing in Google Antigravity, GitHub Copilot, and Google Jules workflows.
Given the user's plain-language app/feature idea, target platform (${form.platform}), and target coding agent (${form.agent}), synthesize a complete, deeply technical, production-grade specification across all required fields.
Strictly enforce:
- For Web: Next.js 15 App Router, synchronous page.tsx shells, async Server Components with exported *Skeleton, 'use client' only on leaf components with useOptimistic/useTransition, Zod-validated 'use server' Actions, TanStack Query v5, RTL + MSW tests.
- For Mobile: React Native 0.78 TurboModules / Flutter Platform Channels / Swift 6.0 / Kotlin 2.0, ZERO main-thread blocking (background dispatch queues), offline-first SQLite, iOS Secure Enclave / Android Keystore, WCAG 2.2 AA + VoiceOver/TalkBack, 6 explicit UI states.
- For Desktop: Tauri v2 (@tauri-apps/api/core, #[tauri::command] returning Result<T, String>, Mutex<AppState>, capabilities/default.json, Rust path canonicalization) OR Electron 3 Absolute Security Laws (contextIsolation: true, nodeIntegration: false, sandbox: true, contextBridge).
- EARS Requirements: Phrased strictly as trigger ("when") and system reaction ("shall") with zero tech-stack bias in the EARS statements.
- Vertical Slices: End-to-end tracer bullets cutting across DB/Schema + Service/Backend + UI + Test, classified as HITL or AFK.`;

    const userQuery = `Plain-Language Idea: ${form.plainIdea}
Target Users / Persona: ${form.userPersona}
Target Platform: ${form.platform}
Target Agent Harness: ${form.agent}
Execution Preference: ${form.executionMode}`;

    const schema = {
      type: 'OBJECT',
      properties: {
        rolePersona: { type: 'STRING' },
        roleFocus: { type: 'STRING' },
        objective: { type: 'STRING' },
        observableOutcome: { type: 'STRING' },
        targetFilesModify: { type: 'STRING' },
        targetFilesRef: { type: 'STRING' },
        pinnedStack: { type: 'STRING' },
        unapprovedLibs: { type: 'STRING' },
        stateAndDataRules: { type: 'STRING' },
        runtimeAndSecurityLimits: { type: 'STRING' },
        restrictedFiles: { type: 'STRING' },
        taskSteps: { type: 'ARRAY', items: { type: 'STRING' } },
        uiStates: {
          type: 'OBJECT',
          properties: {
            loading: { type: 'STRING' },
            empty: { type: 'STRING' },
            error: { type: 'STRING' },
            offline: { type: 'STRING' },
            disabled: { type: 'STRING' },
            success: { type: 'STRING' }
          },
          required: ['loading', 'empty', 'error', 'offline', 'disabled', 'success']
        },
        exampleInput: { type: 'STRING' },
        exampleOutput: { type: 'STRING' },
        verificationCommands: { type: 'STRING' },
        agentsProduct: { type: 'STRING' },
        agentsStack: { type: 'STRING' },
        agentsRepoStructure: { type: 'STRING' },
        agentsCommands: { type: 'STRING' },
        agentsArchitecture: { type: 'STRING' },
        agentsConventions: { type: 'STRING' },
        agentsTesting: { type: 'STRING' },
        agentsSecurity: { type: 'STRING' },
        agentsDatabase: { type: 'STRING' },
        agentsGenerated: { type: 'STRING' },
        constitutionRules: { type: 'STRING' },
        earsSpecs: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              when: { type: 'STRING' },
              shall: { type: 'STRING' }
            },
            required: ['when', 'shall']
          }
        },
        verticalSlices: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              id: { type: 'STRING' },
              mode: { type: 'STRING' },
              parallel: { type: 'BOOLEAN' },
              title: { type: 'STRING' },
              layers: { type: 'STRING' }
            },
            required: ['id', 'mode', 'parallel', 'title', 'layers']
          }
        }
      },
      required: [
        'rolePersona',
        'roleFocus',
        'objective',
        'observableOutcome',
        'targetFilesModify',
        'pinnedStack',
        'stateAndDataRules',
        'runtimeAndSecurityLimits',
        'taskSteps',
        'uiStates',
        'exampleInput',
        'exampleOutput',
        'verificationCommands',
        'agentsProduct',
        'agentsStack',
        'agentsArchitecture',
        'earsSpecs',
        'verticalSlices'
      ]
    };

    try {
      const data = await callGeminiStructured(systemPrompt, userQuery, schema);
      setForm((prev) => ({
        ...prev,
        ...data,
        uiStates: { ...prev.uiStates, ...(data.uiStates || {}) }
      }));
      setStatusMessage({
        type: 'success',
        text: 'AI Auto-Architect complete! All 5 Prompt Sections, 10 AGENTS.md Sections, and SDD Artifacts have been populated.'
      });
    } catch {
      applyOfflineSmartTemplates();
    } finally {
      setIsGeneratingAll(false);
    }
  };

  // ============================================================================
  // AI SOCRATIC INTERVIEWER (/grill-me & /speckit.clarify Simulator)
  // ============================================================================
  const handleRunGrillMe = async () => {
    if (!form.plainIdea.trim()) return;
    setIsGrilling(true);
    setStatusMessage({
      type: 'info',
      text: 'Running /grill-me Socratic ambiguity analysis on your plain-language specification...'
    });

    const systemPrompt = `Act as Google Antigravity's /grill-me and GitHub Spec Kit's /speckit.clarify Socratic Design Interviewer.
Analyze the user's plain-language app/feature description and identify 3 high-impact edge cases, permission boundaries, failure recovery states, or data lifecycle ambiguities that are currently underspecified.
For each question, provide 3 concrete multiple-choice options where the first option is your recommended engineering choice marked with "(Recommended)", plus an EARS requirement template that corresponds to resolving this question.`;

    const schema = {
      type: 'OBJECT',
      properties: {
        questions: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              id: { type: 'STRING' },
              focusArea: { type: 'STRING' },
              question: { type: 'STRING' },
              options: { type: 'ARRAY', items: { type: 'STRING' } }
            },
            required: ['id', 'focusArea', 'question', 'options']
          }
        }
      },
      required: ['questions']
    };

    try {
      const res = await callGeminiStructured(
        systemPrompt,
        `Idea: ${form.plainIdea}\nPlatform: ${form.platform}\nUsers: ${form.userPersona}`,
        schema
      );
      const qList = res.questions || [];
      setGrillQuestions(qList);
      const initialAnswers = {};
      qList.forEach((q) => {
        if (q.options && q.options.length > 0) {
          initialAnswers[q.id] = q.options[0];
        }
      });
      setGrillAnswers(initialAnswers);
      setStatusMessage({
        type: 'success',
        text: 'Socratic /grill-me interview ready! Select your edge-case decisions below to fold them into your spec & prompt.'
      });
    } catch (err) {
      // Fallback high-value Socratic questions if offline
      const fallback = [
        {
          id: 'q1',
          focusArea: 'Authorization & Resource Ownership',
          question: 'How should the system behave when an authenticated user attempts to mutate a record belonging to another workspace or role tier?',
          options: [
            '(Recommended) Enforce strict server-side ownership validation at the action/IPC boundary, reject with typed FORBIDDEN error, and record an audit log entry.',
            'Filter unauthorized items in the UI layer only and rely on client-side session claims.',
            'Allow soft- queueing of the request for administrator approval.'
          ]
        },
        {
          id: 'q2',
          focusArea: 'Concurrency & Optimistic Rollback',
          question: 'When a mutation is triggered over an unstable connection or fails validation, what state transition should occur?',
          options: [
            '(Recommended) Apply immediate optimistic UI transition, preserve user form input on error, and expose a deterministic Retry callback.',
            'Block the entire screen with a modal spinner until the server responds.',
            'Silently discard failed mutations and refresh the route.'
          ]
        },
        {
          id: 'q3',
          focusArea: 'Data Lifecycle & Destructive Actions',
          question: 'Should record removal or rejection permanently delete rows or use soft-archival?',
          options: [
            '(Recommended) Use immutable soft-archival (archived_at timestamp + status enum) to preserve backward compatibility and audit trails.',
            'Execute hard SQL DELETE statements immediately.',
            'Move records to a temporary client-side cache.'
          ]
        }
      ];
      setGrillQuestions(fallback);
      setGrillAnswers({
        q1: fallback[0].options[0],
        q2: fallback[1].options[0],
        q3: fallback[2].options[0]
      });
      setStatusMessage({
        type: 'info',
        text: 'Loaded Socratic /grill-me interview questions.'
      });
    } finally {
      setIsGrilling(false);
    }
  };

  const applyGrillAnswersToSpec = () => {
    const newEars = Object.entries(grillAnswers).map(([qId, ans]) => {
      const qObj = grillQuestions.find((q) => q.id === qId);
      const cleanAns = ans.replace(/^\(Recommended\)\s*/i, '');
      return {
        when: `handling ${qObj ? qObj.focusArea.toLowerCase() : 'edge-case state'}`,
        shall: cleanAns
      };
    });

    const summaryLines = Object.entries(grillAnswers)
      .map(([qId, ans]) => {
        const qObj = grillQuestions.find((q) => q.id === qId);
        return `- [${qObj?.focusArea || 'Clarified Decision'}]: ${ans}`;
      })
      .join('\n');

    setForm((prev) => ({
      ...prev,
      earsSpecs: [...prev.earsSpecs, ...newEars],
      runtimeAndSecurityLimits: `${prev.runtimeAndSecurityLimits}\n\nClarified Edge-Case Decisions (/grill-me):\n${summaryLines}`
    }));

    setStatusMessageWithTimeout({
      type: 'success',
      text: 'Folded your /grill-me Socratic answers into Section 3 Constraints and spec.md EARS requirements!'
    }, 4000);
  };

  // ============================================================================
  // GENERATED ARTIFACTS COMPILER (Real-time synthesis of all files)
  // ============================================================================
  const formatPointer = (str) => {
    if (!str) return '';
    if (form.pointerStyle === '#file') {
      return str.replace(/@([^\s,;]+)/g, '#file:$1');
    }
    return str.replace(/#file:([^\s,;]+)/g, '@$1');
  };

  const artifacts = useMemo(() => {
    // 1. 5-Section Task Prompt (Primacy & Recency Contract)
    const agentCommandPrefix =
      form.agent === 'antigravity'
        ? form.planFirstGate
          ? '/plan /grill-me '
          : ''
        : form.agent === 'copilot'
        ? form.planFirstGate
          ? '/plan '
          : ''
        : '// Jules Task Contract\n';

    const stepsFormatted = form.taskSteps
      .map((s, idx) => `${idx + 1}. ${formatPointer(s)}`)
      .join('\n');

    const uiStatesFormatted = Object.entries(form.uiStates)
      .map(([k, v]) => `  - **${k.toUpperCase()}**: ${v}`)
      .join('\n');

    const taskPromptMd = `${agentCommandPrefix}# 1. ROLE & OBJECTIVE (Primacy Anchor)
Act as a ${form.rolePersona} specializing in ${form.roleFocus}.
OBJECTIVE: ${form.objective} so that ${form.observableOutcome}.

# 2. CONTEXT & PINNED STACK
- **Target Files to Modify**: ${formatPointer(form.targetFilesModify)}
- **Reference Interfaces & Services**: ${formatPointer(form.targetFilesRef)}
- **Pinned Stack**: ${form.pinnedStack}
- **Library Guardrail**: ${form.unapprovedLibs}
- **Visual / Issue Context**: ${form.visualContext}

# 3. ARCHITECTURAL INVARIANTS & CONSTRAINTS
- **State & Boundary Rules**:
${form.stateAndDataRules}
- **Runtime, Hardware & Security Limits**:
${form.runtimeAndSecurityLimits}
- **Restricted / Generated Files**: ${form.restrictedFiles}

# 4. SCOPED VERTICAL-SLICE TASK STEPS & STATE EXAMPLES
Execute the following steps in sequential order:
${stepsFormatted}

- **Required Explicit UI & Domain State Transitions**:
${uiStatesFormatted}

- **Concrete Input / Output Contract**:
  - Given Input: \`${form.exampleInput}\`
  - Expected Output: \`${form.exampleOutput}\`

# 5. VERIFICATION LOOP & OUTPUT CONTRACT (Recency Anchor)
${
  form.planFirstGate
    ? '- **Plan First (Human Approval Gate)**: Generate a structured Implementation Plan artifact first and pause for my approval before modifying any source code files.\n'
    : ''
}- **Red-Green-Refactor TDD & Automated Verification**: Write behavior-first unit/integration tests covering happy path, validation failure, and unauthorized access BEFORE or alongside implementation. Run \`${form.verificationCommands}\` until the suite is 100% green.
- **Deliverable Contract**: ${form.deliverableFormat}`;

    // 2. Root AGENTS.md (10-Section Open Standard)
    const agentsMd = `# AGENTS.md — Persistent Repository Context & Agent Contract

## Product
${form.agentsProduct}

## Stack
${form.agentsStack}

## Repository Structure
\`\`\`text
${form.agentsRepoStructure}
\`\`\`

## Commands
\`\`\`bash
${form.agentsCommands}
\`\`\`

## Architecture
${form.agentsArchitecture}

## Coding Conventions
${form.agentsConventions}

## Testing
${form.agentsTesting}

## Security
${form.agentsSecurity}

## Database
${form.agentsDatabase}

## Generated Files
${form.agentsGenerated}
`;

    // 3. Monorepo Nested AGENTS.md (Local Subproject Overrides)
    const nestedAgentsMd = `# AGENTS.md (${form.nestedSubprojectPath})
> Supplementary subproject instructions. Precedence: Nearest AGENTS.md in directory tree wins. Inherits root \`/AGENTS.md\` policies.

## Commands (Local Overrides)
\`\`\`bash
${form.nestedCommandOverrides}
\`\`\`

## Subproject Architecture & Runtime Constraints
${form.nestedLocalConstraints}
`;

    // 4. Google Antigravity Modular Rule (.agents/rules/<name>.md)
    const safeTrigger = ['always_on', 'model_decision', 'glob', 'manual'].includes(form.agyTrigger)
      ? form.agyTrigger
      : 'always_on';
    const quotedGlobs = form.agyGlobs.startsWith('"') ? form.agyGlobs : `"${form.agyGlobs}"`;

    const agyRuleFrontmatter =
      safeTrigger === 'glob'
        ? `---\ntrigger: glob\nglobs: ${quotedGlobs}\ndescription: ${form.agyRuleDescription}\n---`
        : `---\ntrigger: ${safeTrigger}\ndescription: ${form.agyRuleDescription}\n---`;

    const agyRuleMd = `${agyRuleFrontmatter}

# ${form.agyRuleName.toUpperCase()} — Architectural & Security Invariants

## Mandatory Boundary Rules
${form.stateAndDataRules}

## Runtime & Security Enforcement
${form.runtimeAndSecurityLimits}

## Do-Not-Edit Paths
${form.restrictedFiles}
`;

    // 5. Google Antigravity Agent Skill (.agents/skills/<name>/SKILL.md)
    const agySkillMd = `---
name: ${form.agySkillName}
description: "${form.agySkillDescription}"
---

# Skill: ${form.agySkillName}

## Operational Habit & Execution Flow
1. Do NOT read helper script internals into context. Always invoke the black-box verification script with \`--help\` first:
   \`\`\`bash
   ./.agents/skills/${form.agySkillName}/scripts/verify-slice.sh --help
   \`\`\`
2. Execute the Red-Green-Refactor verification loop:
   \`\`\`bash
   ${form.verificationCommands}
   \`\`\`
3. If any check fails, inspect the failing assertion or compiler diagnostic, fix the root cause without weakening tests, and re-run until exit code is 0.
`;

    // 6. GitHub Copilot Repository-Wide Instructions (.github/copilot-instructions.md)
    const copilotRepoMd = `# GitHub Copilot Repository Instructions

## Product & Pinned Tech Stack
${form.agentsProduct}
- **Pinned Stack**: ${form.pinnedStack}
- **Disallowed Libraries**: ${form.unapprovedLibs}

## Core Architecture & State Invariants
${form.agentsArchitecture}

## Verification Commands
Always run and verify before completing a task:
\`\`\`bash
${form.verificationCommands}
\`\`\`

## Security & Generated Files
${form.agentsSecurity}
${form.agentsGenerated}
`;

    // 7. GitHub Copilot Path-Specific Instructions (.github/instructions/<name>.instructions.md)
    const excludeLine =
      form.copilotExcludeAgent !== 'none' ? `\nexcludeAgent: "${form.copilotExcludeAgent}"` : '';
    const copilotPathMd = `---
applyTo: "${form.copilotApplyTo}"${excludeLine}
---

# Path-Scoped Engineering Rules (${form.copilotInstructionName})

## Component & Boundary Contract
${form.stateAndDataRules}

## Required UI State Matrix
${uiStatesFormatted}

## Testing & Verification
${form.agentsTesting}
`;

    // 8. GitHub Copilot Custom Agent Profile (.github/agents/<name>.agent.md)
    const agentTools =
      form.copilotAgentRole === 'planner'
        ? '["read", "search"]'
        : '["read", "search", "edit", "execute", "playwright/*"]';

    const copilotAgentMd = `---
name: ${form.copilotAgentName}
description: "${
      form.copilotAgentRole === 'planner'
        ? 'Researches the codebase, interviews the developer on edge cases, and produces a vertical-slice technical specification without modifying source files.'
        : 'Implements approved vertical slices following Red-Green-Refactor TDD and boundary invariants.'
    }"
tools: ${agentTools}
handoffs:
  - label: Implement Approved Plan
    agent: agent
    prompt: Implement the vertical slices outlined in the approved plan above following Red-Green-Refactor TDD and run ${form.verificationCommands} for each step.
    send: false
---

# Role Persona
Act as a ${form.rolePersona} specializing in ${form.roleFocus}.

## Non-Negotiable Constraints
${form.stateAndDataRules}
${form.runtimeAndSecurityLimits}
`;

    // 9. GitHub Copilot Cloud Agent Setup Workflow (.github/workflows/copilot-setup-steps.yml)
    const copilotSetupYml = `name: "Copilot Setup Steps"
on:
  workflow_dispatch:
  push:
    paths:
      - .github/workflows/copilot-setup-steps.yml

jobs:
  copilot-setup-steps:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js & pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Install dependencies & pre-warm test runners
        run: |
          pnpm install --frozen-lockfile
          ${form.verificationCommands}
`;

    // 10. Google Jules VM Snapshot Setup Script & API Payload (jules-setup.sh)
    const julesSetupSh = `#!/usr/bin/env bash
# Google Jules — Codebases -> Configuration -> Initial Setup (Run and Snapshot)
set -e

# 1. Inspect pre-installed Ubuntu VM tool versions
set +x; . /opt/environment_summary.sh

# 2. Install project dependencies and compile bindings
pnpm install

# 3. Validate build, typecheck, and test suite for VM Snapshot
${form.verificationCommands}

echo "Jules VM Snapshot validated and ready for autonomous tasks!"

# ----------------------------------------------------------------------------
# Programmatic Jules v1alpha API Payload (POST https://jules.googleapis.com/v1alpha/sessions)
# ----------------------------------------------------------------------------
# {
#   "prompt": ${JSON.stringify(form.objective)},
#   "requirePlanApproval": true,
#   "automationMode": "AUTO_CREATE_PR"
# }
`;

    // 11. Spec-Driven Development: .specify/memory/constitution.md
    const constitutionMd = `# Project Constitution (.specify/memory/constitution.md)
> Immutable engineering principles governing every Spec Kit, Antigravity, Copilot, and Jules session.

## Non-Negotiable Engineering Guardrails
${form.constitutionRules}

## Mandatory Verification Gate
Every pull request and subagent vertical slice must pass:
\`\`\`bash
${form.verificationCommands}
\`\`\`

## Restricted Paths
${form.restrictedFiles}
`;

    // 12. Spec-Driven Development: specs/001-feature/spec.md (Zone A: What & Why + EARS)
    const earsFormatted = form.earsSpecs
      .map(
        (item, idx) =>
          `${idx + 1}. **WHEN** ${item.when}, **THE SYSTEM SHALL** ${item.shall}.`
      )
      .join('\n');

    const specMd = `# Feature Specification (specs/001-feature/spec.md)
> **Zone A — Product Intent ("What & Why")**: Deliberately free of implementation stack bias.

## 1. Plain-Language Summary & User Intent
${form.plainIdea}

## 2. Target User Persona
${form.userPersona}

## 3. Observable Acceptance Criteria (EARS Notation)
${earsFormatted}

## 4. Required User Experience States
${uiStatesFormatted}
`;

    // 13. Spec-Driven Development: specs/001-feature/tasks.md (Zone B: Vertical Slices)
    const slicesFormatted = form.verticalSlices
      .map(
        (s) =>
          `- [ ] **${s.id}** ${s.parallel ? '[P] ' : ''}[${s.mode}] **${s.title}**\n  - *End-to-End Tracer Layers*: ${s.layers}\n  - *Verification*: \`${form.verificationCommands}\``
      )
      .join('\n\n');

    const tasksMd = `# Dependency-Ordered Vertical-Slice Tasks (specs/001-feature/tasks.md)
> **Zone B — Technical Execution ("How & Verify")**: Each task cuts a thin end-to-end tracer bullet across schema, service, boundary, UI, and tests.
> Legend: \`[HITL]\` = Interactive Human-in-the-Loop Co-Piloting | \`[AFK]\` = Autonomous Cloud/Subagent | \`[P]\` = Parallelizable (/fleet or /teamwork)

${slicesFormatted}
`;

    // 14. One-Command Google Antigravity (agy) Workspace Bootstrapper Script
    const agyBootstrapSh = `#!/usr/bin/env bash
# ============================================================================
# SpecForge Studio -> Google Antigravity (agy) 1-Click Workspace Importer
# Usage: Paste this into your Antigravity terminal or run: bash bootstrap-agy.sh
# ============================================================================
set -e

echo "🚀 Initializing Google Antigravity (agy) Spec-Driven Workspace..."

mkdir -p .agents/rules
mkdir -p ".agents/skills/${form.agySkillName}/scripts"
mkdir -p .specify/memory
mkdir -p specs/001-feature

cat << 'EOF_AGENTS' > AGENTS.md
${agentsMd}
EOF_AGENTS

cat << 'EOF_RULE' > ".agents/rules/${form.agyRuleName}.md"
${agyRuleMd}
EOF_RULE

cat << 'EOF_SKILL' > ".agents/skills/${form.agySkillName}/SKILL.md"
${agySkillMd}
EOF_SKILL

cat << 'EOF_VERIFY_SH' > ".agents/skills/${form.agySkillName}/scripts/verify-slice.sh"
#!/usr/bin/env bash
if [[ "$1" == "--help" ]]; then
  echo "Usage: ./verify-slice.sh — Runs typecheck, linter, and scoped tests."
  exit 0
fi
${form.verificationCommands}
EOF_VERIFY_SH
chmod +x ".agents/skills/${form.agySkillName}/scripts/verify-slice.sh"

cat << 'EOF_CONSTITUTION' > .specify/memory/constitution.md
${constitutionMd}
EOF_CONSTITUTION

cat << 'EOF_SPEC' > specs/001-feature/spec.md
${specMd}
EOF_SPEC

cat << 'EOF_TASKS' > specs/001-feature/tasks.md
${tasksMd}
EOF_TASKS

cat << 'EOF_PROMPT' > TASK_PROMPT.md
${taskPromptMd}
EOF_PROMPT

echo "✅ Success! Created AGENTS.md, .agents/rules/${form.agyRuleName}.md, .agents/skills/${form.agySkillName}/SKILL.md, specs/, and TASK_PROMPT.md"
echo "👉 Next step in Antigravity chat or agy CLI, run:"
echo "   /plan /grill-me Implement the vertical slice in @TASK_PROMPT.md"
`;

    return {
      'bootstrap-agy.sh': {
        title: 'bootstrap-agy.sh (1-Click Antigravity Setup)',
        badge: '1-Click Setup',
        content: agyBootstrapSh
      },
      'TASK_PROMPT.md': {
        title: 'TASK_PROMPT.md (5-Section AI Prompt)',
        badge: 'Main AI Prompt',
        content: taskPromptMd
      },
      'AGENTS.md': {
        title: 'AGENTS.md (Project Rules for All AI Tools)',
        badge: 'Project Rules',
        content: agentsMd
      },
      [`${form.nestedSubprojectPath}/AGENTS.md`]: {
        title: `${form.nestedSubprojectPath}/AGENTS.md (Sub-Folder Rules)`,
        badge: 'Sub-Folder Rules',
        content: nestedAgentsMd
      },
      [`.agents/rules/${form.agyRuleName}.md`]: {
        title: `.agents/rules/${form.agyRuleName}.md`,
        badge: 'Antigravity Rule',
        content: agyRuleMd
      },
      [`.agents/skills/${form.agySkillName}/SKILL.md`]: {
        title: `.agents/skills/${form.agySkillName}/SKILL.md`,
        badge: 'Antigravity Skill',
        content: agySkillMd
      },
      '.github/copilot-instructions.md': {
        title: '.github/copilot-instructions.md',
        badge: 'Copilot Repo Rules',
        content: copilotRepoMd
      },
      [`.github/instructions/${form.copilotInstructionName}.instructions.md`]: {
        title: `.github/instructions/${form.copilotInstructionName}.instructions.md`,
        badge: 'Copilot File Rule',
        content: copilotPathMd
      },
      [`.github/agents/${form.copilotAgentName}.agent.md`]: {
        title: `.github/agents/${form.copilotAgentName}.agent.md`,
        badge: 'Copilot Custom Agent',
        content: copilotAgentMd
      },
      '.github/workflows/copilot-setup-steps.yml': {
        title: '.github/workflows/copilot-setup-steps.yml',
        badge: 'Copilot Cloud Setup',
        content: copilotSetupYml
      },
      'jules-setup.sh': {
        title: 'jules-setup.sh (Cloud Environment Setup)',
        badge: 'Google Jules',
        content: julesSetupSh
      },
      '.specify/memory/constitution.md': {
        title: '.specify/memory/constitution.md (Core Project Laws)',
        badge: 'Core Laws',
        content: constitutionMd
      },
      'specs/001-feature/spec.md': {
        title: 'specs/001-feature/spec.md (Step-by-Step Goal Checks)',
        badge: 'Goal Checks',
        content: specMd
      },
      'specs/001-feature/tasks.md': {
        title: 'specs/001-feature/tasks.md (Step-by-Step Task Breakdown)',
        badge: 'Task Breakdown',
        content: tasksMd
      }
    };
  }, [form]);

  const isDockFiltered = !isProMode && !showAllSimpleFiles;
  const simpleAllowedKeys = SIMPLE_ESSENTIAL_FILES.map((item) => item.key);
  const intermediateAllowedKeys = INTERMEDIATE_CORE_FILES.map((item) => item.key);
  const allowedDockKeys = isSimpleMode ? simpleAllowedKeys : intermediateAllowedKeys;

  const handleChangeViewMode = (nextMode: ViewMode) => {
    setViewMode(nextMode);
    if (nextMode !== 'pro') {
      setShowAllSimpleFiles(false);
    }
    if (nextMode === 'simple') {
      if (activeTab !== 'ideation' && activeTab !== 'guide') {
        setActiveTab('ideation');
      }
    } else if (nextMode === 'intermediate') {
      if (
        activeTab !== 'ideation' &&
        activeTab !== 'prompt5' &&
        activeTab !== 'agentsmd' &&
        activeTab !== 'sdd'
      ) {
        setActiveTab('ideation');
      }
    }
  };

  // Ensure selectedArtifact key exists when dynamic paths or filtered dock modes change
  const currentArtifactKey =
    artifacts[selectedArtifact] &&
    (!isDockFiltered || allowedDockKeys.includes(selectedArtifact))
      ? selectedArtifact
      : 'TASK_PROMPT.md';
  const currentArtifact = artifacts[currentArtifactKey];
  const currentFileGuide = FILE_USAGE_GUIDE[currentArtifactKey] || {
    whatIsIt: 'Auto-generated agent instruction or configuration file tailored to your project.',
    whereItGoes: `Save this file inside your project repository at path: ${currentArtifactKey}`,
    BeginnerTip: 'Keep this file committed in Git so every AI session follows the exact same rules.'
  };

  // Filtered cross-device shared projects by optional sync code
  const filteredSharedProjects = useMemo(() => {
    const code = blueprintTag.trim().toLowerCase();
    if (!code) return sharedCloudProjects;
    return sharedCloudProjects.filter((p) => (p.tag || '').toLowerCase().includes(code));
  }, [sharedCloudProjects, blueprintTag]);

  // Validation & Guardrail Diagnostics (translated into plain-language health checks)
  const diagnostics = useMemo(() => {
    const agyRuleBytes = new Blob([
      artifacts[`.agents/rules/${form.agyRuleName}.md`]?.content || ''
    ]).size;
    const copilotAgentChars = (
      artifacts[`.github/agents/${form.copilotAgentName}.agent.md`]?.content || ''
    ).length;
    const promptChars = (artifacts['TASK_PROMPT.md']?.content || '').length;
    const estTokens = Math.ceil(promptChars / 4);
    const agyRuleLimit = 24000;
    const copilotAgentLimit = 30000;
    const isRuleSizeSafe = agyRuleBytes < agyRuleLimit;
    const isCopilotSizeSafe = copilotAgentChars < copilotAgentLimit;
    const isPromptLong = estTokens > 4000;

    return {
      agyRuleBytes,
      agyRuleLimit,
      copilotAgentChars,
      copilotAgentLimit,
      estTokens,
      isRuleSizeSafe,
      isCopilotSizeSafe,
      isPromptLong,
      ruleSizeMessage: isRuleSizeSafe
        ? 'Rule file is well under size limits (AI will read it fully)'
        : 'Rule file is getting too large — shorten it so your AI reads every rule',
      copilotSizeMessage: isCopilotSizeSafe
        ? 'Custom agent file is well under size limits (Copilot will read it fully)'
        : 'Custom agent file is getting a bit long — trim extra lines so Copilot reads it all',
      promptLengthMessage: !isPromptLong
        ? 'Prompt size is safe for fast AI responses'
        : 'Your prompt is getting a bit long; consider starting a fresh AI chat',
      memorySafetyMessage:
        estTokens < 120000
          ? 'Instructions fit safely within AI memory limits'
          : 'Your prompt is getting a bit long; consider starting a fresh AI chat',
      hasPrimacyAnchor: Boolean(form.rolePersona && form.objective),
      hasRecencyAnchor: Boolean(form.verificationCommands && form.deliverableFormat)
    };
  }, [artifacts, form]);

  // Native OS clipboard copy (with browser fallback)
  const handleCopy = async (text: string, keyLabel: string) => {
    try {
      if (window.desktopAPI) {
        await window.desktopAPI.copyToClipboard(text);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedKey(keyLabel);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedKey(null), 2200);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  // Save single file via native OS Save Dialog (or browser Blob fallback)
  const handleDownloadFile = async (filename: string, content: string) => {
    try {
      const cleanName = filename.split('/').pop() || 'artifact.md';
      if (window.desktopAPI) {
        const res = await window.desktopAPI.saveFileDialog(cleanName, content);
        if (!res.canceled && res.filePath) {
          setStatusMessageWithTimeout({
            type: 'success',
            text: `Saved ${cleanName} to ${res.filePath}`
          });
        }
        return;
      }

      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = cleanName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      console.error('Download file error:', err);
      setStatusMessage({
        type: 'error',
        text: `Download failed: ${err?.message || err}`
      });
    }
  };

  const handleDownloadAllBundle = async () => {
    try {
      const combined = Object.entries(artifacts)
        .map(
          ([path, obj]) =>
            `================================================================================\nFILE PATH: ${path}\n================================================================================\n\n${obj.content}\n\n`
        )
        .join('\n');
      await handleDownloadFile('specforge-complete-agent-bundle.txt', combined);
    } catch (err: any) {
      console.error('Download all error:', err);
      setStatusMessage({
        type: 'error',
        text: `Download all failed: ${err?.message || err}`
      });
    }
  };

  const handleExportToFolder = async () => {
    if (!window.desktopAPI) {
      await handleDownloadAllBundle();
      return;
    }
    setIsExportingFolder(true);
    try {
      const files = Object.entries(artifacts).map(([relativePath, obj]) => ({
        relativePath,
        content: obj.content
      }));
      const res = await window.desktopAPI.exportWorkspaceDialog({ files });
      if (!res.canceled && res.targetDir) {
        setStatusMessage({
          type: 'success',
          text: `Exported ${res.writtenCount} SpecForge files directly into ${res.targetDir}`
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Folder export failed: ${err?.message || err}`
      });
    } finally {
      setIsExportingFolder(false);
    }
  };

  // List mutators for steps, EARS, and Vertical Slices
  const addStep = () =>
    updateField('taskSteps', [...form.taskSteps, 'Implement next verifiable step and unit test.']);
  const removeStep = (idx) =>
    updateField(
      'taskSteps',
      form.taskSteps.filter((_, i) => i !== idx)
    );
  const editStep = (idx, val) => {
    const copy = [...form.taskSteps];
    copy[idx] = val;
    updateField('taskSteps', copy);
  };

  const addEars = () =>
    updateField('earsSpecs', [
      ...form.earsSpecs,
      { when: 'a user triggers [condition]', shall: 'validate and return [observable outcome]' }
    ]);
  const removeEars = (idx) =>
    updateField(
      'earsSpecs',
      form.earsSpecs.filter((_, i) => i !== idx)
    );
  const editEars = (idx, field, val) => {
    const copy = [...form.earsSpecs];
    copy[idx] = { ...copy[idx], [field]: val };
    updateField('earsSpecs', copy);
  };

  const addSlice = () => {
    const nextNum = String(form.verticalSlices.length + 1).padStart(3, '0');
    updateField('verticalSlices', [
      ...form.verticalSlices,
      {
        id: `T${nextNum}`,
        mode: 'AFK',
        parallel: true,
        title: 'New End-to-End Vertical Slice',
        layers: 'Schema + Service + Boundary + UI + Integration Test'
      }
    ]);
  };
  const removeSlice = (idx) =>
    updateField(
      'verticalSlices',
      form.verticalSlices.filter((_, i) => i !== idx)
    );
  const editSlice = (idx, field, val) => {
    const copy = [...form.verticalSlices];
    copy[idx] = { ...copy[idx], [field]: val };
    updateField('verticalSlices', copy);
  };

  const handleToggleIntermediateRule = (rule: IntermediateRulePreset) => {
    setForm((prev) => {
      const current = String(prev[rule.targetField] || '');
      const hasRule = current.includes(rule.technicalRule);
      const nextValue = hasRule
        ? current
            .split('\n')
            .filter((line) => line.trim() !== rule.technicalRule)
            .join('\n')
            .trim()
        : current.trim()
          ? `${current.trim()}\n${rule.technicalRule}`
          : rule.technicalRule;
      return {
        ...prev,
        [rule.targetField]: nextValue
      };
    });
  };

  const updateIntermediateSlice = (
    idx: number,
    patch: { title?: string; needsHumanReview?: boolean; parallel?: boolean }
  ) => {
    setForm((prev) => {
      const copy = [...prev.verticalSlices];
      const existing = copy[idx];
      if (!existing) return prev;
      const nextTitle = patch.title !== undefined ? patch.title : existing.title;
      const nextMode =
        patch.needsHumanReview !== undefined
          ? patch.needsHumanReview
            ? 'HITL'
            : 'AFK'
          : existing.mode;
      const nextParallel = patch.parallel !== undefined ? patch.parallel : existing.parallel;
      copy[idx] = {
        ...existing,
        title: nextTitle,
        mode: nextMode,
        parallel: nextParallel,
        layers: deriveTracerBulletLayers(nextTitle, prev.platform)
      };
      return {
        ...prev,
        verticalSlices: copy
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 pb-16 lg:pb-0">
      {/* ====================================================================
          TOP HEADER BAR, DESKTOP ACTIONS & NAVIGATION TABS
         ==================================================================== */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  SpecForge Studio
                </h1>
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ubuntu Desktop
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Turn plain-English ideas into foolproof AI Coding Prompts, AGENTS.md &amp; Spec Files
              </p>
            </div>
          </div>

          {/* Right Toolbar: Beginner Explanations Toggle, Presets, Blueprints, AI Key, Export */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 3-Way View Mode Selector: Simple / Intermediate / Pro */}
            <div
              role="group"
              aria-label="Workspace View Mode"
              className="inline-flex items-center rounded-lg bg-slate-900/90 border border-slate-700/80 p-0.5 gap-0.5"
            >
              {(
                [
                  {
                    id: 'simple' as const,
                    label: 'Simple',
                    title: 'No-Code Wizard'
                  },
                  {
                    id: 'intermediate' as const,
                    label: 'Intermediate',
                    title: 'Pro-Light (4 Tabs + Jargon Guide)'
                  },
                  {
                    id: 'pro' as const,
                    label: 'Pro',
                    title: 'All 14 Files & Raw Code'
                  }
                ] as const
              ).map((mode) => {
                const active = viewMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleChangeViewMode(mode.id)}
                    title={mode.title}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                      active
                        ? mode.id === 'simple'
                          ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-sm'
                          : mode.id === 'intermediate'
                            ? 'bg-indigo-500/30 text-indigo-100 border border-indigo-400/50 shadow-sm'
                            : 'bg-slate-700 text-white border border-slate-500/60 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {mode.id === 'simple' && <Lightbulb className="w-3 h-3 text-amber-400" />}
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>


            {/* Saved Projects Button */}
            <button
              onClick={() => setPresetsModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600/25 hover:bg-cyan-600/40 text-cyan-200 border border-cyan-500/50 flex items-center gap-1.5 transition"
              title="Save, load, and manage local project presets"
            >
              <Folder className="w-3.5 h-3.5 text-cyan-400" />
              <span>📂 Saved Projects</span>
            </button>

            {/* Local Blueprints Manager Button */}
            <button
              onClick={() => setCloudModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/50 flex items-center gap-1.5 transition"
              title="Save, load, import, or export project blueprints"
            >
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              <span>Blueprints ({mySavedProjects.length})</span>
            </button>

            {/* AI Key Settings Button */}
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
              title="Configure optional Gemini API key for AI Auto-Architect and /grill-me"
            >
              <KeyRound
                className={`w-3.5 h-3.5 ${
                  geminiSettings.hasKey ? 'text-emerald-400' : 'text-slate-400'
                }`}
              />
              <span className="hidden md:inline">
                {geminiSettings.hasKey ? 'AI Ready' : 'AI Key'}
              </span>
            </button>

            {/* Quick Example Presets */}
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 px-1.5">Examples:</span>
              <button
                onClick={() => applyPreset('web_nextjs')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  form.platform === 'web'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Web App
              </button>
              <button
                onClick={() => applyPreset('mobile_rn')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  form.platform === 'mobile'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Mobile App
              </button>
              <button
                onClick={() => applyPreset('desktop_tauri')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  form.platform === 'desktop'
                    ? 'bg-amber-600 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Computer App
              </button>
            </div>

            <button
              onClick={handleExportToFolder}
              disabled={isExportingFolder}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition flex items-center gap-1.5 shadow-sm disabled:opacity-60"
              title="Write all generated files directly into a project folder on disk"
            >
              <FolderUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isExportingFolder ? 'Exporting...' : 'Export to Repo'}
              </span>
            </button>

            <button
              onClick={handleDownloadAllBundle}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white transition flex items-center gap-1.5 shadow-sm"
              title="Save single combined bundle text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bundle</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/60 bg-slate-950/50">
          {(isSimpleMode
            ? [
                {
                  id: 'ideation',
                  label: '1. Describe Your App',
                  icon: Sparkles,
                  badge: 'Step 1'
                },
                {
                  id: 'guide',
                  label: '2. How to Use Your Files',
                  icon: Compass,
                  badge: 'Step 2'
                }
              ]
            : isIntermediateMode
              ? [
                  {
                    id: 'ideation',
                    label: '1. Idea & AI Setup',
                    icon: Sparkles,
                    badge: 'Step 1'
                  },
                  {
                    id: 'prompt5',
                    label: '2. Custom AI Prompt',
                    icon: Terminal,
                    badge: 'Step 2'
                  },
                  {
                    id: 'agentsmd',
                    label: '3. Project Rules',
                    icon: BookOpen,
                    badge: 'Step 3'
                  },
                  {
                    id: 'sdd',
                    label: '4. Feature Checklist',
                    icon: Layers,
                    badge: 'Step 4'
                  }
                ]
              : [
                  {
                    id: 'guide',
                    label: '0. How to Use (Dummy-Proof Guide)',
                    icon: Compass,
                    badge: 'Read First'
                  },
                  {
                    id: 'ideation',
                    label: '1. Plain-English Idea & AI Auto-Fill',
                    icon: Sparkles,
                    badge: 'Step 1'
                  },
                  {
                    id: 'prompt5',
                    label: '2. Task Prompt Builder (5 Sections)',
                    icon: Terminal,
                    badge: 'Step 2'
                  },
                  {
                    id: 'agentsmd',
                    label: '3. AGENTS.md (Project Rules)',
                    icon: BookOpen,
                    badge: 'Step 3'
                  },
                  {
                    id: 'platform_files',
                    label: '4. Copilot, Antigravity & Jules Files',
                    icon: FolderGit2,
                    badge: 'Step 4'
                  },
                  {
                    id: 'sdd',
                    label: '5. Spec & Task Slices (spec.md / tasks.md)',
                    icon: Layers,
                    badge: 'Step 5'
                  }
                ]
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobilePane('editor');
                }}
                className={`py-2.5 sm:py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive
                      ? 'bg-indigo-500/30 text-indigo-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </header>


      {/* ====================================================================
          SAVED PROJECTS PRESETS MODAL
         ==================================================================== */}
      {presetsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-base font-bold text-white">
                    Saved Project Presets
                  </h2>
                  <p className="text-xs text-slate-400">
                    Save your current configuration or quickly switch between projects.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPresetsModalOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Save Current Project
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={presetNameInput}
                  onChange={(e) => setPresetNameInput(e.target.value)}
                  placeholder="e.g., My SaaS App"
                  className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                />
                <button
                  onClick={handleSavePreset}
                  disabled={!presetNameInput.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold disabled:opacity-50"
                >
                  Save Preset
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                 <h4 className="text-xs font-semibold text-slate-300">
                   Saved Presets ({savedPresets.length})
                 </h4>
                 <button
                   onClick={handleResetToDefaultPreset}
                   className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-[11px] hover:bg-slate-700"
                 >
                   Reset to Default
                 </button>
              </div>

              {savedPresets.length === 0 ? (
                <p className="text-xs text-slate-500 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  No presets saved yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {savedPresets.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(item.updatedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex gap-2 text-[10px] text-slate-400">
                           <span className="px-1.5 py-0.5 rounded bg-slate-800">{item.platform}</span>
                           <span className="px-1.5 py-0.5 rounded bg-slate-800">{item.agent}</span>
                         </div>
                         <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => handleLoadPreset(item)}
                              className="px-3 py-1 rounded bg-emerald-600/20 text-emerald-300 text-[11px] font-medium hover:bg-emerald-600/30"
                            >
                              Load
                            </button>
                            <button
                              onClick={() => handleDeletePreset(item.id)}
                              className="px-3 py-1 rounded bg-rose-600/20 text-rose-300 text-[11px] font-medium hover:bg-rose-600/30"
                            >
                              Delete
                            </button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ====================================================================
          LOCAL BLUEPRINTS & JSON IMPORT/EXPORT MODAL
         ==================================================================== */}
      {cloudModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-5 h-5 text-indigo-400" />
                <div>
                  <h2 className="text-base font-bold text-white">
                    Local Desktop Blueprints &amp; Portable Backups
                  </h2>
                  <p className="text-xs text-slate-400">
                    Saved offline on your Ubuntu machine, with 1-click JSON export/import.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCloudModalOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            {/* Save Current Blueprint Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Save Current Project Blueprint
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g., Kanban Productivity App"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Tag / Filter Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={blueprintTag}
                    onChange={(e) => setBlueprintTag(e.target.value)}
                    placeholder="e.g., work-2026"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-cyan-200"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleSaveToCloud(false)}
                  disabled={isSavingCloud}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-400" />
                  Save Blueprint Locally
                </button>
                <button
                  onClick={() => handleSaveToCloud(true)}
                  disabled={isSavingCloud}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Save with Tag
                </button>
                {window.desktopAPI && (
                  <button
                    onClick={handleImportBlueprintJson}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Import .specforge.json
                  </button>
                )}
              </div>
              {desktopInfo && (
                <p className="text-[11px] text-slate-500 font-mono truncate">
                  Storage Folder: {desktopInfo.blueprintsDir}
                </p>
              )}
            </div>

            {/* Load Saved Projects List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* All Local Blueprints */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                  Saved on This Computer ({mySavedProjects.length})
                </h4>
                {mySavedProjects.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    No blueprints saved yet. Click &quot;Save Blueprint Locally&quot; above.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {mySavedProjects.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-500">
                            {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Saved'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleLoadFromCloud(item)}
                            className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-300 text-xs font-medium hover:bg-emerald-600/30"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleExportBlueprintJson(item)}
                            className="p-1 text-slate-400 hover:text-cyan-300"
                            title="Export .specforge.json"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCloudItem(item.id)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                            title="Delete blueprint"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tagged Blueprints */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                  Tagged Blueprints ({filteredSharedProjects.length})
                </h4>
                {filteredSharedProjects.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    No tagged blueprints match &quot;{blueprintTag || 'all'}&quot;.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {filteredSharedProjects.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold text-white truncate">
                              {item.title}
                            </p>
                            {item.tag && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                                #{item.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">
                            {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Saved'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleLoadFromCloud(item)}
                            className="px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-300 text-xs font-medium hover:bg-indigo-600/30"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteCloudItem(item.id)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          DESKTOP AI SETTINGS MODAL (GEMINI API KEY)
         ==================================================================== */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                <div>
                  <h2 className="text-base font-bold text-white">
                    Desktop AI Settings (Optional)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Powers &quot;AI Auto-Architect&quot; and live &quot;/grill-me&quot; interviews.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Status:</span>
                <span
                  className={
                    geminiSettings.hasKey
                      ? 'text-emerald-400 font-semibold'
                      : 'text-amber-300 font-semibold'
                  }
                >
                  {geminiSettings.hasKey
                    ? `Configured (${geminiSettings.source}: ${geminiSettings.maskedKey})`
                    : 'Not Configured (Offline Presets & Builders still work)'}
                </span>
              </div>
              {desktopInfo && (
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Environment:</span>
                  <span className="font-mono">
                    {desktopInfo.platform}/{desktopInfo.arch} ({desktopInfo.osRelease})
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Gemini API Key (stored locally via OS encryption when available)
              </label>
              <input
                type="password"
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                placeholder="AIza..."
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs font-mono text-white"
              />
              <p className="text-[11px] text-slate-500">
                You can also launch the app with <code>GEMINI_API_KEY</code> set in your Ubuntu shell environment.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {geminiSettings.source === 'stored' && (
                <button
                  onClick={() => handleSaveGeminiKey(true)}
                  disabled={isSavingSettings}
                  className="px-3.5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900/70 text-rose-200 border border-rose-500/40 text-xs font-semibold"
                >
                  Clear Saved Key
                </button>
              )}
              <button
                onClick={() => handleSaveGeminiKey(false)}
                disabled={isSavingSettings || !geminiKeyInput.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50"
              >
                {isSavingSettings ? 'Saving...' : 'Save API Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optional Status Toast Banner */}
      {statusMessage && (
        <div
          className={`max-w-[1600px] w-full mx-auto px-4 sm:px-6 pt-3 ${
            cloudModalOpen || settingsModalOpen ? 'fixed inset-x-0 top-0 z-[60]' : ''
          }`}
        >
          <div
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : statusMessage.type === 'warning'
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs underline opacity-75 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          MAIN SPLIT WORKSPACE: LEFT INPUT BUILDERS | RIGHT LIVE ARTIFACT DOCK
         ==================================================================== */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: STRUCTURED INPUT AREAS (7 COLS) */}
        <div
          className={`lg:col-span-7 space-y-6 ${
            mobilePane === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* ----------------------------------------------------------------
              TAB 0: DUMMY-PROOF STEP-BY-STEP GUIDE & FILE CHEAT SHEET
             ---------------------------------------------------------------- */}
          {activeTab === 'guide' && (
            <div className="space-y-5">
              {/* Hero Welcome Card */}
              <div className="bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  Zero-Jargon Quick Start Guide
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  How to Turn Any Idea into a Production App (Without the AI Breaking Your Code)
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  When you type a normal sentence like <em>"Build me an app that does X"</em> into
                  an AI coding tool, the AI has to guess 50 hidden details at once—and halfway
                  through, it forgets its own rules. This app fixes that by turning your plain idea
                  into <strong>two things</strong>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-400">
                      1. Permanent Project Rules (AGENTS.md)
                    </span>
                    <p className="text-xs text-slate-300">
                      You drop this file into your project folder <strong>once</strong>. Every time
                      Google Antigravity, GitHub Copilot, or Google Jules opens your project, it
                      automatically reads your tech stack, folder map, and test commands.
                    </p>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                    <span className="text-xs font-bold text-indigo-400">
                      2. A 5-Section Task Prompt (TASK_PROMPT.md)
                    </span>
                    <p className="text-xs text-slate-300">
                      You paste this into the AI chat box for each feature you want built. It puts
                      your most important rules at the <strong>very top</strong> and{' '}
                      <strong>very bottom</strong> where AI models pay the most attention.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('ideation')}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    <Sparkles className="w-4 h-4" />
                    Start Step 1: Type Your Plain-English Idea →
                  </button>
                  <button
                    onClick={() => setCloudModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700"
                  >
                    <Cloud className="w-4 h-4 text-indigo-400" />
                    Load or Save Across Devices
                  </button>
                </div>
              </div>

              {/* 4-Step Dummy-Proof Checklist */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-emerald-400" />
                  Follow These 4 Simple Steps:
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      step: 'Step 1',
                      title: 'Type your plain-English idea & click the purple "AI Auto-Architect" button',
                      desc: 'Don’t worry about knowing technical terms! Just describe what you want users to be able to do in Tab 1, pick whether it’s a Web, Mobile, or Computer app, and click the purple button. The AI will fill out all the technical boxes for you.',
                      actionLabel: 'Go to Tab 1 (Idea & Auto-Fill)',
                      targetTab: 'ideation'
                    },
                    {
                      step: 'Step 2',
                      title: 'Answer the 3 Multiple-Choice "/grill-me" Questions',
                      desc: 'Still in Tab 1, click "Run /grill-me Socratic Design Interview". It will ask you 3 simple multiple-choice questions (with the Recommended choice already selected!) so the AI doesn’t have to guess edge cases.',
                      actionLabel: 'Try /grill-me in Tab 1',
                      targetTab: 'ideation'
                    },
                    {
                      step: 'Step 3',
                      title: 'Save AGENTS.md into your project folder',
                      desc: 'In the right-hand preview panel (or tap "Preview & Copy Files" at the bottom on mobile), click the "AGENTS.md" pill, click Copy or Download, and save it in your main code folder.',
                      actionLabel: 'Preview AGENTS.md Now',
                      targetArtifact: 'AGENTS.md'
                    },
                    {
                      step: 'Step 4',
                      title: 'Copy TASK_PROMPT.md and paste it into your AI Coding Agent',
                      desc: 'Select "TASK_PROMPT.md" in the preview panel, click Copy File, and paste it straight into Google Antigravity, GitHub Copilot Chat, or Google Jules!',
                      actionLabel: 'Preview TASK_PROMPT.md Now',
                      targetArtifact: 'TASK_PROMPT.md'
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-xs">
                            {item.step}
                          </span>
                          <h4 className="text-xs sm:text-sm font-semibold text-white">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (item.targetTab) setActiveTab(item.targetTab);
                          if (item.targetArtifact) {
                            setSelectedArtifact(item.targetArtifact);
                            setMobilePane('preview');
                          }
                        }}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold shrink-0 self-start sm:self-center"
                      >
                        {item.actionLabel} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dedicated Card: How to Import into Google Antigravity (agy) */}
              <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      How to Import Into Google Antigravity (<code>agy</code>)
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedArtifact('bootstrap-agy.sh');
                      setMobilePane('preview');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Preview 1-Click bootstrap-agy.sh →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Option A: Import Generated Blueprints */}
                  <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                      Option A: Import Your Generated Rules &amp; Prompt Into Any agy Project
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                      <li>
                        Select <code>bootstrap-agy.sh</code> in the right-hand preview panel and
                        click <strong>Copy File</strong>.
                      </li>
                      <li>
                        Open your project folder in the <strong>Antigravity App / IDE</strong> or run{' '}
                        <code>agy</code> in your terminal.
                      </li>
                      <li>
                        Paste the copied script into the Antigravity terminal and press{' '}
                        <strong>Enter</strong>. It automatically creates <code>AGENTS.md</code>,{' '}
                        <code>.agents/rules/</code>, <code>.agents/skills/</code>,{' '}
                        <code>specs/</code>, and <code>TASK_PROMPT.md</code>!
                      </li>
                      <li>
                        In the Antigravity prompt box, type:{' '}
                        <code className="text-indigo-300">
                          /plan /grill-me Implement @TASK_PROMPT.md
                        </code>
                      </li>
                    </ol>
                  </div>

                  {/* Option B: Import SpecForge Studio App Itself */}
                  <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                      Option B: Import This SpecForge Studio Web App Itself Into agy
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                      <li>
                        In your terminal, create a Vite React app and open it in Antigravity:
                        <pre className="mt-1 p-2 rounded bg-slate-900 text-cyan-200 font-mono text-[11px] overflow-x-auto">
                          {`npm create vite@latest specforge -- --template react\ncd specforge\nnpm i lucide-react firebase tailwindcss\nagy .`}
                        </pre>
                      </li>
                      <li>
                        Copy the code of <code>SpecForgeStudio.jsx</code> from this editor into{' '}
                        <code>src/App.jsx</code>.
                      </li>
                      <li>
                        Run <code>npm run dev</code> inside <code>agy</code> (or ask{' '}
                        <code>agy</code> to deploy it to Firebase Hosting / Cloud Run so you have a
                        permanent personal URL on all your devices!).
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Visual Cheat Sheet: Where Does Each Generated File Go? */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-cyan-400" />
                    Cheat Sheet: Where Do I Put Each File?
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any file below to preview it on the right and see exactly where to paste
                    or save it.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(FILE_USAGE_GUIDE).map(([fileKey, info]) => (
                    <div
                      key={fileKey}
                      onClick={() => {
                        setSelectedArtifact(fileKey);
                        setMobilePane('preview');
                      }}
                      className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                        currentArtifactKey === fileKey
                          ? 'bg-indigo-950/40 border-indigo-500/60'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-indigo-300">
                          {fileKey}
                        </span>
                        <span className="text-[10px] text-cyan-400">Click to preview →</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">{info.whatIsIt}</p>
                      <p className="text-[11px] text-emerald-300/90">
                        <strong>Where it goes:</strong> {info.whereItGoes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 1: PLAIN-LANGUAGE IDEA, AGENT HARNESS & SOCRATIC /GRILL-ME
             ---------------------------------------------------------------- */}
          {activeTab === 'ideation' && (
            <div className="space-y-6">
              {dummyProofMode && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 flex items-start gap-3 text-xs text-amber-100">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Simple Mode Tip:</strong> Describe your idea in plain English below,
                    pick your app type and AI tool, then click{' '}
                    <strong>&quot;✨ Step 1: Turn My Idea Into AI Instructions&quot;</strong>. No
                    coding knowledge or API key required!
                  </div>
                </div>
              )}

              {/* Plain Language Brain Dump Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-indigo-400" />
                      {dummyProofMode
                        ? 'Describe What You Want to Build'
                        : 'Plain-Language App or Feature Idea ("The What & Why")'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {dummyProofMode ? (
                        <>
                          Write your idea in everyday language. Click{' '}
                          <strong className="text-indigo-300">
                            ✨ Step 1: Turn My Idea Into AI Instructions
                          </strong>{' '}
                          to update all your AI prompt and setup files automatically.
                        </>
                      ) : (
                        <>
                          Describe what you want to build in everyday language. Click{' '}
                          <strong className="text-indigo-300">AI Auto-Architect All Fields</strong>{' '}
                          to populate every prompt section, AGENTS.md, and SDD file automatically.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <label
                        htmlFor="plain-idea-input"
                        className="block text-xs font-medium text-slate-300"
                      >
                        {dummyProofMode
                          ? 'What should your app do?'
                          : 'Plain-Language Feature / Application Idea'}
                      </label>
                      <button
                        type="button"
                        disabled={expandingField === 'plainIdea'}
                        onClick={() => handleAutoExpandField('plainIdea')}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-medium text-indigo-200 disabled:opacity-50 transition"
                      >
                        {expandingField === 'plainIdea'
                          ? 'Expanding options...'
                          : '✨ Auto-Expand Options'}
                      </button>
                    </div>
                    <textarea
                      id="plain-idea-input"
                      rows={4}
                      value={form.plainIdea}
                      onChange={(e) => updateField('plainIdea', e.target.value)}
                      placeholder="e.g., Build a real-time team Kanban board where managers can drag tasks, assign reviewers, and export CSV reports with strict role permissions..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    {expandedHighlights.plainIdea && (
                      <ExpandedTextHighlight
                        fieldKey="plainIdea"
                        text={expandedHighlights.plainIdea}
                        onClear={() => clearExpandedHighlight('plainIdea')}
                      />
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="user-persona-input"
                      className="block text-xs font-medium text-slate-300 mb-1"
                    >
                      {dummyProofMode
                        ? 'Who will use this app?'
                        : 'Target Users & Problem Context'}
                    </label>
                    <input
                      id="user-persona-input"
                      type="text"
                      value={form.userPersona}
                      onChange={(e) => updateField('userPersona', e.target.value)}
                      placeholder="e.g., Project managers and software engineers working across desktop and mobile..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Target Agent, Platform & Execution Architecture Matrix */}
                {dummyProofMode ? (
                  <div className="space-y-4 pt-2">
                    {/* 1. Platform Visual Picker */}
                    <fieldset className="space-y-2">
                      <legend className="text-xs font-semibold text-slate-200">
                        What kind of app are you making?
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          {
                            value: 'web',
                            emoji: '🌐',
                            title: 'Website / Web App',
                            desc: 'Runs in a web browser like Chrome or Brave'
                          },
                          {
                            value: 'mobile',
                            emoji: '📱',
                            title: 'Phone App',
                            desc: 'Runs on iPhone and Android phones'
                          },
                          {
                            value: 'desktop',
                            emoji: '💻',
                            title: 'Computer App',
                            desc: 'Runs on Ubuntu, Windows, or Mac desktop'
                          }
                        ].map((option) => {
                          const selected = form.platform === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() =>
                                applyDomainInvariants(
                                  option.value === 'desktop' ? 'desktop_tauri' : option.value
                                )
                              }
                              className={`text-left rounded-xl p-3 border transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                                selected
                                  ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-sm'
                                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <span aria-hidden="true">{option.emoji}</span>
                                <span>{option.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">{option.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* 2. AI Tool Visual Picker */}
                    <fieldset className="space-y-2">
                      <legend className="text-xs font-semibold text-slate-200">
                        Which AI tool are you pasting this into?
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          {
                            value: 'antigravity',
                            emoji: '🚀',
                            title: 'Google Antigravity (agy)'
                          },
                          {
                            value: 'copilot',
                            emoji: '🐙',
                            title: 'GitHub Copilot'
                          },
                          {
                            value: 'jules',
                            emoji: '☁️',
                            title: 'Google Jules'
                          }
                        ].map((option) => {
                          const selected = form.agent === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => updateField('agent', option.value)}
                              className={`text-left rounded-xl p-3 border transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                                selected
                                  ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-sm'
                                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <span aria-hidden="true">{option.emoji}</span>
                                <span>{option.title}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* 3. Execution Style Visual Picker */}
                    <fieldset className="space-y-2">
                      <legend className="text-xs font-semibold text-slate-200">
                        How do you want the AI to work?
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          {
                            value: 'HITL',
                            emoji: '👀',
                            title: 'Step-by-Step with Me Watching',
                            desc: 'The AI asks before changing files'
                          },
                          {
                            value: 'AFK',
                            emoji: '🤖',
                            title: 'Build It Automatically in the Background',
                            desc: 'The AI finishes the whole task on its own'
                          }
                        ].map((option) => {
                          const selected = form.executionMode === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => updateField('executionMode', option.value)}
                              className={`text-left rounded-xl p-3 border transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                                selected
                                  ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-sm'
                                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <span aria-hidden="true">{option.emoji}</span>
                                <span>{option.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">{option.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {/* Target Agent Harness */}
                    <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                        Target Coding Agent
                      </label>
                      <select
                        value={form.agent}
                        onChange={(e) => updateField('agent', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="antigravity">Google Antigravity (App / IDE / agy CLI)</option>
                        <option value="copilot">GitHub Copilot (IDE / CLI / Cloud Agent)</option>
                        <option value="jules">Google Jules (Async Cloud VM Contractor)</option>
                      </select>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        {form.agent === 'antigravity' &&
                          'Supports /plan, /grill-me, /boost, /teamwork, 24KB .agents/rules/*.md & SKILL.md.'}
                        {form.agent === 'copilot' &&
                          'Supports 5-tier instructions, .agent.md handoffs, /plan, /fleet & #runSubagent.'}
                        {form.agent === 'jules' &&
                          'Clones repo into Ubuntu VM. Capped at 5 tasks/day (beta), 5MB initial PNG/JPEG.'}
                      </p>
                    </div>

                    {/* Target Application Domain */}
                    <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                        Target Domain Architecture
                      </label>
                      <select
                        value={form.platform}
                        onChange={(e) =>
                          applyDomainInvariants(
                            e.target.value === 'desktop' ? 'desktop_tauri' : e.target.value
                          )
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="web">Web App (Next.js 15 / React 19 / TanStack)</option>
                        <option value="mobile">Mobile App (RN TurboModules / Flutter / Native)</option>
                        <option value="desktop">Desktop App (Tauri v2 Rust / Electron)</option>
                      </select>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        Automatically primes boundary invariants for Server/Client, Native Bridges,
                        or IPC.
                      </p>
                    </div>

                    {/* Execution Mode */}
                    <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                        Slice Execution Mode
                      </label>
                      <select
                        value={form.executionMode}
                        onChange={(e) => updateField('executionMode', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="HITL">HITL (Human-in-the-Loop Co-Piloted)</option>
                        <option value="AFK">AFK (Autonomous Cloud VM / Subagent)</option>
                      </select>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        {form.executionMode === 'HITL'
                          ? 'Best for foundational architecture, auth boundaries, and UX nuances.'
                          : 'Best for well-scoped vertical slices delegated to Jules, Cloud Agent, or /fleet.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Magic Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleMagicAutoArchitect}
                    disabled={isGeneratingAll}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition"
                  >
                    {isGeneratingAll ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>
                      {isGeneratingAll
                        ? 'Building Your AI Instructions...'
                        : dummyProofMode
                        ? '✨ Step 1: Turn My Idea Into AI Instructions'
                        : 'AI Auto-Architect All Prompt & Repo Files'}
                    </span>
                  </button>

                  <button
                    onClick={handleRunGrillMe}
                    disabled={isGrilling}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/30 font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
                  >
                    {isGrilling ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                    )}
                    <span>
                      {isGrilling
                        ? 'Checking for Missing Details...'
                        : dummyProofMode
                        ? '❓ Step 2: Check My Idea for Missing Details (3 Quick Questions)'
                        : 'Run /grill-me Socratic Design Interview'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Socratic Design Interview Card (/grill-me / /speckit.clarify) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      {dummyProofMode ? (
                        'Step 2: Quick Check for Missing Details'
                      ) : (
                        <>
                          Stage 3: Socratic Design Interview (<code>/grill-me</code> &amp;{' '}
                          <code>/speckit.clarify</code>)
                        </>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {dummyProofMode
                        ? 'Answer 3 quick multiple-choice questions to catch edge cases before the AI starts building.'
                        : 'Resolve hidden edge cases, permissions, and recovery states before locking the technical plan. Recommended choices are marked first.'}
                    </p>
                  </div>
                  {grillQuestions.length === 0 && (
                    <button
                      onClick={handleRunGrillMe}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      Generate Questions <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {grillQuestions.length === 0 ? (
                  <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 text-xs text-slate-400">
                    {dummyProofMode ? (
                      <>
                        Click{' '}
                        <strong>
                          &quot;❓ Step 2: Check My Idea for Missing Details (3 Quick
                          Questions)&quot;
                        </strong>{' '}
                        above to double-check permissions, offline behavior, and error handling.
                      </>
                    ) : (
                      <>
                        Click <strong>&quot;Run /grill-me Socratic Design Interview&quot;</strong>{' '}
                        above to let the AI inspect your plain-language idea and ask targeted
                        multiple-choice edge-case questions—just like Google Antigravity&apos;s{' '}
                        <code>/grill-me</code> command.
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {grillQuestions.map((q, qIdx) => (
                      <div
                        key={q.id || qIdx}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {q.focusArea}
                          </span>
                          <span className="text-xs text-slate-500">Question {qIdx + 1}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-slate-200">{q.question}</p>
                        <div className="space-y-1.5 pt-1">
                          {(q.options || []).map((opt, oIdx) => {
                            const isSelected = grillAnswers[q.id] === opt;
                            return (
                              <label
                                key={oIdx}
                                className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                                  isSelected
                                    ? 'bg-indigo-950/50 border-indigo-500/60 text-indigo-100'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`grill-${q.id}`}
                                  checked={isSelected}
                                  onChange={() =>
                                    setGrillAnswers((prev) => ({ ...prev, [q.id]: opt }))
                                  }
                                  className="mt-0.5 accent-indigo-500"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                        {/* Custom write-in option */}
                        <div className="pt-1">
                          <input
                            type="text"
                            value={grillAnswers[q.id] || ''}
                            onChange={(e) =>
                              setGrillAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            placeholder="Or write in a custom architectural decision..."
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={applyGrillAnswersToSpec}
                      className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Fold Clarified Decisions into Prompt &amp; spec.md EARS Criteria
                    </button>
                  </div>
                )}
              </div>

              {dummyProofMode && (
                <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                  <button
                    onClick={() => handleChangeViewMode('intermediate')}
                    className="text-xs text-indigo-300 hover:text-indigo-200 underline underline-offset-4 transition"
                  >
                    Try Intermediate Mode (4 Tabs + Jargon Guide)
                  </button>
                  <button
                    onClick={() => handleChangeViewMode('pro')}
                    className="text-xs text-slate-400 hover:text-indigo-300 underline underline-offset-4 transition"
                  >
                    Switch to Pro Mode to edit 5-Section Prompts, AGENTS.md &amp; EARS Specs
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 2: 5-SECTION TASK PROMPT BUILDER (Primacy & Recency Contract)
             ---------------------------------------------------------------- */}
          {activeTab === 'prompt5' && (
            <div className="space-y-5">
              {showPlainHelpers && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 flex items-start gap-3 text-xs text-amber-100">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Why 5 Sections?</strong> AI coding models pay the most attention to the{' '}
                    <strong>very beginning (Section 1)</strong> and the{' '}
                    <strong>very end (Section 5)</strong> of a prompt. Not sure what to type in a
                    box? Click any of the <strong>Quick-Fill Chips</strong> under the inputs!
                  </div>
                </div>
              )}

              {/* Section 1: Role Persona & Primary Objective (Top-Priority Rules) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Section 1 • Top-Priority Rules (AI Attention Top Section)
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Role Persona &amp; Primary Objective
                    </h3>
                  </div>
                </div>

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="Primacy Anchor"
                    explanation="Putting your most important rules and AI role at the very top of the prompt where the AI reads them best."
                  />
                )}

                {showPlainHelpers && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">1-Click Role Chips:</span>
                    {QUICK_FILL_CHIPS.rolePersona.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => updateField('rolePersona', chip)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-indigo-200 border border-slate-700"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Senior Engineering Persona
                    </label>
                    <input
                      type="text"
                      value={form.rolePersona}
                      onChange={(e) => updateField('rolePersona', e.target.value)}
                      placeholder="e.g., Senior iOS Engineer / Senior Next.js 15 Architect"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Domain Specialization Focus
                    </label>
                    <input
                      type="text"
                      value={form.roleFocus}
                      onChange={(e) => updateField('roleFocus', e.target.value)}
                      placeholder="e.g., SwiftUI memory optimization / Rust Tauri v2 IPC"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <label className="block text-xs font-medium text-slate-300">
                        1-Sentence Feature / Fix Objective
                      </label>
                      <button
                        type="button"
                        disabled={expandingField === 'objective'}
                        onClick={() => handleAutoExpandField('objective')}
                        className="px-2 py-0.5 rounded bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-[11px] font-medium text-indigo-200 disabled:opacity-50 transition"
                      >
                        {expandingField === 'objective'
                          ? 'Expanding options...'
                          : '✨ Auto-Expand Options'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={form.objective}
                      onChange={(e) => updateField('objective', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                    {expandedHighlights.objective && (
                      <ExpandedTextHighlight
                        fieldKey="objective"
                        text={expandedHighlights.objective}
                        onClear={() => clearExpandedHighlight('objective')}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Observable User Outcome ("so that...")
                      </label>
                      <button
                        type="button"
                        disabled={expandingField === 'observableOutcome'}
                        onClick={() => handleAutoExpandField('observableOutcome')}
                        className="px-2 py-0.5 rounded bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-[11px] font-medium text-indigo-200 disabled:opacity-50 transition"
                      >
                        {expandingField === 'observableOutcome'
                          ? 'Expanding options...'
                          : '✨ Auto-Expand Options'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={form.observableOutcome}
                      onChange={(e) => updateField('observableOutcome', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                    {expandedHighlights.observableOutcome && (
                      <ExpandedTextHighlight
                        fieldKey="observableOutcome"
                        text={expandedHighlights.observableOutcome}
                        onClear={() => clearExpandedHighlight('observableOutcome')}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Target Context, Pinned Stack & File Pointers */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      Section 2 • Narrow Reasoning Boundaries
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Target Context, Pinned Stack &amp; File Pointers
                    </h3>
                  </div>

                  {/* Pointer Syntax Switcher */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => updateField('pointerStyle', '@path')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                        form.pointerStyle === '@path'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      @path/to/file (Antigravity / CLI)
                    </button>
                    <button
                      onClick={() => updateField('pointerStyle', '#file')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                        form.pointerStyle === '#file'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      #file:path (VS Code Copilot)
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Target Files to Modify
                    </label>
                    <input
                      type="text"
                      value={form.targetFilesModify}
                      onChange={(e) => updateField('targetFilesModify', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm font-mono text-cyan-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Reference Files &amp; Interfaces (Read-Only Context)
                    </label>
                    <input
                      type="text"
                      value={form.targetFilesRef}
                      onChange={(e) => updateField('targetFilesRef', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Pinned Stack &amp; Exact SDK Versions
                      </label>
                      <textarea
                        rows={2}
                        value={form.pinnedStack}
                        onChange={(e) => updateField('pinnedStack', e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      {showPlainHelpers && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {QUICK_FILL_CHIPS.pinnedStack.map((stackChip, idx) => (
                            <button
                              key={idx}
                              onClick={() => updateField('pinnedStack', stackChip)}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-slate-700 truncate max-w-[220px]"
                            >
                              Use: {stackChip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Unapproved Libraries &amp; Deprecated Patterns to Reject
                      </label>
                      <textarea
                        rows={2}
                        value={form.unapprovedLibs}
                        onChange={(e) => updateField('unapprovedLibs', e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Visual Mockup / GitHub Issue Context
                    </label>
                    <input
                      type="text"
                      value={form.visualContext}
                      onChange={(e) => updateField('visualContext', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Architectural Invariants, Runtime & Security Constraints */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Section 3 • Non-Negotiable Boundaries
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Architectural Invariants, Runtime &amp; Security Constraints
                    </h3>
                  </div>

                  {/* Quick Domain Boundary Injectors */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Inject Rules:</span>
                    <button
                      onClick={() => applyDomainInvariants('web')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-indigo-300 border border-slate-700"
                    >
                      + Next.js 15 / React 19
                    </button>
                    <button
                      onClick={() => applyDomainInvariants('mobile')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-300 border border-slate-700"
                    >
                      + Mobile TurboModules
                    </button>
                    <button
                      onClick={() => applyDomainInvariants('desktop_tauri')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-amber-300 border border-slate-700"
                    >
                      + Tauri v2 (6 Rules)
                    </button>
                    <button
                      onClick={() => applyDomainInvariants('desktop_electron')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-rose-300 border border-slate-700"
                    >
                      + Electron (3 Security Laws)
                    </button>
                  </div>
                </div>

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="State Invariants & TurboModules"
                    explanation="Invariants are 'never-break' data & security laws (like keeping secrets out of the browser). TurboModules are high-speed bridges used when React Native apps talk to native phone hardware."
                  />
                )}

                <div className="space-y-3">
                  {isIntermediateMode ? (
                    <div className="space-y-2.5">
                      <p className="text-xs font-medium text-slate-300">
                        Plain-English Engineering Rules (check the rules you want enforced):
                      </p>
                      <div className="space-y-2">
                        {INTERMEDIATE_RULE_PRESETS.map((rule) => {
                          const checked = String(form[rule.targetField] || '').includes(
                            rule.technicalRule
                          );
                          return (
                            <label
                              key={rule.id}
                              className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition ${
                                checked
                                  ? 'bg-indigo-500/15 border-indigo-400/50 text-white'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleToggleIntermediateRule(rule)}
                                className="mt-0.5 accent-indigo-500 rounded"
                              />
                              <div className="space-y-0.5">
                                <span className="block text-xs font-semibold">{rule.label}</span>
                                <span className="block text-[11px] text-slate-400">
                                  {rule.helper}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      <details className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2 text-[11px] text-slate-400">
                        <summary className="cursor-pointer font-medium text-slate-300 select-none">
                          View generated technical rules added to your prompt
                        </summary>
                        <div className="mt-2 space-y-2 font-mono text-[11px] text-slate-300 whitespace-pre-wrap">
                          <div>
                            <span className="text-indigo-300 font-semibold">
                              State &amp; Data Rules:
                            </span>
                            {'\n'}
                            {form.stateAndDataRules}
                          </div>
                          <div>
                            <span className="text-amber-300 font-semibold">
                              Runtime &amp; Security Limits:
                            </span>
                            {'\n'}
                            {form.runtimeAndSecurityLimits}
                          </div>
                        </div>
                      </details>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          State Placement &amp; Architectural Boundary Rules (Direct Imperatives)
                        </label>
                        <textarea
                          rows={4}
                          value={form.stateAndDataRules}
                          onChange={(e) => updateField('stateAndDataRules', e.target.value)}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Runtime, Threading, Accessibility &amp; Security Constraints
                        </label>
                        <textarea
                          rows={3}
                          value={form.runtimeAndSecurityLimits}
                          onChange={(e) => updateField('runtimeAndSecurityLimits', e.target.value)}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Restricted / Generated Files (Forbidden to Edit by Hand)
                    </label>
                    <input
                      type="text"
                      value={form.restrictedFiles}
                      onChange={(e) => updateField('restrictedFiles', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-rose-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Scoped Vertical-Slice Task Steps & Concrete Examples */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      Section 4 • Sequential Sub-Steps &amp; State Matrix
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Scoped Vertical-Slice Steps &amp; Concrete Examples
                    </h3>
                  </div>
                  <button
                    onClick={addStep}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-1 hover:bg-emerald-600/30"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Step
                  </button>
                </div>

                {/* Ordered Steps */}
                <div className="space-y-2">
                  {form.taskSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => editStep(idx, e.target.value)}
                        className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => removeStep(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                        title="Remove step"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 6 UI States Matrix */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Explicit UI &amp; Domain State Transitions (Loading, Empty, Error, Offline, Disabled, Success)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(form.uiStates).map(([stateKey, desc]) => (
                      <div
                        key={stateKey}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-2.5"
                      >
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-1">
                          {stateKey} State
                        </span>
                        <input
                          type="text"
                          value={String(desc ?? '')}
                          onChange={(e) => updateUiState(stateKey, e.target.value)}
                          className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example Input / Output */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Concrete Example Input Payload
                    </label>
                    <input
                      type="text"
                      value={form.exampleInput}
                      onChange={(e) => updateField('exampleInput', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Expected Output / Sorting Contract
                    </label>
                    <input
                      type="text"
                      value={form.exampleOutput}
                      onChange={(e) => updateField('exampleOutput', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Verification Loop & Output Contract (Final Instructions) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                      Section 5 • Final Instructions (AI Attention Bottom Section)
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Verification Loop &amp; Output Contract
                    </h3>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.planFirstGate}
                      onChange={(e) => updateField('planFirstGate', e.target.checked)}
                      className="accent-indigo-500 rounded"
                    />
                    <span>Require Plan-First Approval Gate</span>
                  </label>
                </div>

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="Recency Anchor"
                    explanation="Putting exact test and verification commands at the very bottom of the prompt so the AI runs checks right before finishing."
                  />
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Exact Verification Shell Commands (Typecheck, Lint, Scoped Tests)
                    </label>
                    <input
                      type="text"
                      value={form.verificationCommands}
                      onChange={(e) => updateField('verificationCommands', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-purple-200 focus:outline-none focus:border-indigo-500"
                    />
                    {showPlainHelpers && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <span className="text-[10px] text-slate-400">1-Click Test Commands:</span>
                        {QUICK_FILL_CHIPS.verificationCommands.map((cmd, idx) => (
                          <button
                            key={idx}
                            onClick={() => updateField('verificationCommands', cmd)}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-200 font-mono border border-slate-700"
                          >
                            {cmd}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Required Deliverable Format &amp; Summary Contract
                    </label>
                    <textarea
                      rows={2}
                      value={form.deliverableFormat}
                      onChange={(e) => updateField('deliverableFormat', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 3: AGENTS.MD (10-SECTION STANDARD) & MONOREPO LAYERING
             ---------------------------------------------------------------- */}
          {activeTab === 'agentsmd' && (
            <div className="space-y-5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      Root <code>AGENTS.md</code> Builder (10-Section Open Standard)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Natively discovered by Google Jules, GitHub Copilot, and Google Antigravity.
                      Separates durable repository context from transient task prompts.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedArtifact('AGENTS.md')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium"
                  >
                    Preview AGENTS.md →
                  </button>
                </div>

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="10-Section AGENTS.md"
                    explanation="A standardized README written specifically for AI coding agents so Antigravity, Copilot, and Jules automatically follow your project's build and testing rules."
                  />
                )}

                {/* All 10 Standard Sections */}
                <div className="space-y-4">
                  {[
                    {
                      num: '1',
                      heading: '## Product',
                      key: 'agentsProduct',
                      rows: 2,
                      hint: 'Include: 1-2 sentence description of what the app does and who uses it. Exclude: Marketing prose or temporary feature specs.'
                    },
                    {
                      num: '2',
                      heading: '## Stack',
                      key: 'agentsStack',
                      rows: 2,
                      hint: 'Include: Pinned frameworks, languages, DB engines, ORMs, styling tools, test runners. Exclude: Uninstalled technologies.'
                    },
                    {
                      num: '3',
                      heading: '## Repository Structure',
                      key: 'agentsRepoStructure',
                      rows: 4,
                      hint: 'Include: Directory-to-responsibility mapping (app/, features/, services/, lib/). Exclude: Exhaustive file-by-file listings.'
                    },
                    {
                      num: '4',
                      heading: '## Commands',
                      key: 'agentsCommands',
                      rows: 5,
                      hint: 'Include: Exact, verified CLI commands for install, dev, unit test, single-file test filter, typecheck, lint, E2E, build.'
                    },
                    {
                      num: '5',
                      heading: '## Architecture',
                      key: 'agentsArchitecture',
                      rows: 4,
                      hint: 'Include: Project-specific boundaries the model cannot infer on its own. Exclude: Generic platitudes like "Use clean architecture".'
                    },
                    {
                      num: '6',
                      heading: '## Coding Conventions',
                      key: 'agentsConventions',
                      rows: 3,
                      hint: 'Include: Conventions not enforced by linters (named exports, error classes, state rules). Exclude: Copy-pasting Prettier/ESLint rules.'
                    },
                    {
                      num: '7',
                      heading: '## Testing',
                      key: 'agentsTesting',
                      rows: 3,
                      hint: 'Include: Behavior-first assertions over internal state, deterministic fixtures, running affected tests first.'
                    },
                    {
                      num: '8',
                      heading: '## Security',
                      key: 'agentsSecurity',
                      rows: 3,
                      hint: 'Include: Server-side resource ownership checks, untrusted client inputs (roles, prices, IDs), secret redaction.'
                    },
                    {
                      num: '9',
                      heading: '## Database',
                      key: 'agentsDatabase',
                      rows: 2,
                      hint: 'Include: Rules prohibiting destructive migrations without approval, backfill plans, forbidding edits to applied migrations.'
                    },
                    {
                      num: '10',
                      heading: '## Generated Files',
                      key: 'agentsGenerated',
                      rows: 3,
                      hint: 'Include: Explicit paths the agent must never edit by hand (src/generated/, lockfiles) + regeneration commands.'
                    }
                  ].map((sec) => (
                    <div
                      key={sec.key}
                      className="rounded-xl bg-slate-950/90 border border-slate-800/90 p-3.5 space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-xs font-bold font-mono text-indigo-300">
                          Section {sec.num}: {sec.heading}
                        </span>
                        <span className="text-[11px] text-slate-400">{sec.hint}</span>
                      </div>
                      <textarea
                        rows={sec.rows}
                        value={form[sec.key]}
                        onChange={(e) => updateField(sec.key, e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Monorepo Nested AGENTS.md Builder */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Monorepo Layering: Nested Subproject <code>AGENTS.md</code>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Agents walk the directory tree and give precedence to the nearest{' '}
                      <code>AGENTS.md</code> file. Keep subproject files slim with local command
                      overrides only.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedArtifact(`${form.nestedSubprojectPath}/AGENTS.md`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs hover:bg-slate-700"
                  >
                    Preview Nested File →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Subproject Folder Path
                    </label>
                    <input
                      type="text"
                      value={form.nestedSubprojectPath}
                      onChange={(e) => updateField('nestedSubprojectPath', e.target.value)}
                      placeholder="apps/mobile or services/payments"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Local Package Command Overrides
                    </label>
                    <input
                      type="text"
                      value={form.nestedCommandOverrides}
                      onChange={(e) => updateField('nestedCommandOverrides', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Service / App-Specific Constraints (Without Duplicating Root AGENTS.md)
                  </label>
                  <textarea
                    rows={2}
                    value={form.nestedLocalConstraints}
                    onChange={(e) => updateField('nestedLocalConstraints', e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 4: PLATFORM INSTRUCTIONAL & CONFIG FILES SUITE
             ---------------------------------------------------------------- */}
          {activeTab === 'platform_files' && (
            <div className="space-y-5">
              {/* 1. Google Antigravity Rules & Skills */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Google Antigravity • .agents/rules/*.md &amp; .agents/skills/*/SKILL.md
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Modular Rules &amp; Agent Skills Configurator
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        diagnostics.isRuleSizeSafe
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      🟢 Rule Size: {diagnostics.ruleSizeMessage}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Rule File Name (<code>.agents/rules/</code>)
                    </label>
                    <input
                      type="text"
                      value={form.agyRuleName}
                      onChange={(e) =>
                        updateField('agyRuleName', e.target.value.replace(/\//g, '-'))
                      }
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Slashes are automatically turned into hyphens so Antigravity always finds your
                      rule file.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      When Should Antigravity Load This Rule?
                    </label>
                    <select
                      value={form.agyTrigger}
                      onChange={(e) => updateField('agyTrigger', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    >
                      <option value="always_on">always_on (Loaded in every chat)</option>
                      <option value="model_decision">
                        model_decision (AI loads it automatically when relevant)
                      </option>
                      <option value="glob">glob (Loaded when editing matching files)</option>
                      <option value="manual">manual (Loaded only when you @-mention it)</option>
                    </select>
                    <p className="text-[11px] text-amber-300/80 mt-1">
                      Uses standard underscore names so Antigravity loads your rule reliably every
                      time.
                    </p>
                  </div>
                </div>

                {form.agyTrigger === 'glob' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      File Match Pattern (Automatically quoted for safe formatting)
                    </label>
                    <input
                      type="text"
                      value={form.agyGlobs}
                      onChange={(e) => updateField('agyGlobs', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-cyan-200"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Agent Skill Bundle Name (<code>.agents/skills/&lt;name&gt;/SKILL.md</code>)
                    </label>
                    <input
                      type="text"
                      value={form.agySkillName}
                      onChange={(e) => updateField('agySkillName', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Skill Summary (What it does &amp; when the AI should use it)
                    </label>
                    <input
                      type="text"
                      value={form.agySkillDescription}
                      onChange={(e) => updateField('agySkillDescription', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedArtifact(`.agents/rules/${form.agyRuleName}.md`)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs"
                  >
                    Preview .agents/rules/{form.agyRuleName}.md →
                  </button>
                  <button
                    onClick={() =>
                      setSelectedArtifact(`.agents/skills/${form.agySkillName}/SKILL.md`)
                    }
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs"
                  >
                    Preview .agents/skills/{form.agySkillName}/SKILL.md →
                  </button>
                </div>
              </div>

              {/* 2. GitHub Copilot 5-Tier Instructions & Custom Agent Handoffs */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      GitHub Copilot • .github/instructions/*.instructions.md &amp; .agent.md
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Path-Scoped Instructions &amp; Specialist Agent Pipeline
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    🟢 Agent File Size: {diagnostics.copilotSizeMessage}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Instruction Name
                    </label>
                    <input
                      type="text"
                      value={form.copilotInstructionName}
                      onChange={(e) => updateField('copilotInstructionName', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      YAML <code>applyTo</code> Glob Pattern
                    </label>
                    <input
                      type="text"
                      value={form.copilotApplyTo}
                      onChange={(e) => updateField('copilotApplyTo', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Optional <code>excludeAgent</code> Filter
                    </label>
                    <select
                      value={form.copilotExcludeAgent}
                      onChange={(e) => updateField('copilotExcludeAgent', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    >
                      <option value="none">Active for All Copilot Agents</option>
                      <option value="code-review">excludeAgent: "code-review"</option>
                      <option value="cloud-agent">excludeAgent: "cloud-agent"</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Custom Agent Profile (<code>.github/agents/&lt;name&gt;.agent.md</code>)
                    </label>
                    <input
                      type="text"
                      value={form.copilotAgentName}
                      onChange={(e) => updateField('copilotAgentName', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Tool Restriction &amp; Handoff Mode
                    </label>
                    <select
                      value={form.copilotAgentRole}
                      onChange={(e) => updateField('copilotAgentRole', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    >
                      <option value="planner">
                        Planner / Reviewer (Restricted tools: ["read", "search"] + Handoff)
                      </option>
                      <option value="implementer">
                        Implementer (Full tools: ["read", "search", "edit", "execute", "playwright/*"])
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedArtifact('.github/copilot-instructions.md')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs"
                  >
                    Preview .github/copilot-instructions.md →
                  </button>
                  <button
                    onClick={() =>
                      setSelectedArtifact(
                        `.github/instructions/${form.copilotInstructionName}.instructions.md`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs"
                  >
                    Preview .instructions.md →
                  </button>
                  <button
                    onClick={() =>
                      setSelectedArtifact(`.github/agents/${form.copilotAgentName}.agent.md`)
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs"
                  >
                    Preview .agent.md →
                  </button>
                  <button
                    onClick={() =>
                      setSelectedArtifact('.github/workflows/copilot-setup-steps.yml')
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs"
                  >
                    Preview copilot-setup-steps.yml →
                  </button>
                </div>
              </div>

              {/* 3. Google Jules Cloud VM Snapshot & API Config */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Google Jules • Ubuntu VM Snapshot &amp; API Contract
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Jules Initial Setup (Run and Snapshot) &amp; Plan Steering
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedArtifact('jules-setup.sh')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/30 text-xs"
                  >
                    Preview jules-setup.sh →
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Generates the exact initialization script for{' '}
                  <strong>Codebases → Configuration → Initial Setup</strong> (including{' '}
                  <code>. /opt/environment_summary.sh</code>) plus the Jules v1alpha API payload with{' '}
                  <code>"requirePlanApproval": true</code> so API sessions do not auto-approve
                  complex architectural plans without human review.
                </p>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 5: SPEC-DRIVEN DEVELOPMENT (SDD) PIPELINE BUILDER
             ---------------------------------------------------------------- */}
          {activeTab === 'sdd' && (
            <div className="space-y-5">
              {/* Stage 1: Project Constitution */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Stage 1 • Core Project Laws (.specify/memory/constitution.md)
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Immutable Engineering Principles
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedArtifact('.specify/memory/constitution.md')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs"
                  >
                    Preview constitution.md →
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={form.constitutionRules}
                  onChange={(e) => updateField('constitutionRules', e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Stage 2: Step-by-Step Goal Checks (When/Then Rules) (spec.md) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      Stage 2 • Feature Goals &amp; When/Then Rules (No Tech-Stack Bias)
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Step-by-Step Goal Checks (When/Then Rules) (<code>spec.md</code>)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pair concrete trigger conditions (<strong>WHEN</strong>) with explicit
                      observable system reactions (<strong>THE SYSTEM SHALL</strong>).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={addEars}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Goal Check
                    </button>
                    <button
                      onClick={() => setSelectedArtifact('specs/001-feature/spec.md')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs"
                    >
                      Preview spec.md →
                    </button>
                  </div>
                </div>

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="EARS Notation"
                    explanation="A simple 'WHEN [trigger] -> THE SYSTEM SHALL [result]' format that removes ambiguity so your AI writes exact behavior and tests."
                  />
                )}

                <div className="space-y-3">
                  {form.earsSpecs.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-300">
                          Goal Check #{idx + 1} (When / Then)
                        </span>
                        <button
                          onClick={() => removeEars(idx)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                            WHEN (Trigger Condition)
                          </span>
                          <input
                            type="text"
                            value={item.when}
                            onChange={(e) => editEars(idx, 'when', e.target.value)}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                            THE SYSTEM SHALL (Observable Reaction)
                          </span>
                          <input
                            type="text"
                            value={item.shall}
                            onChange={(e) => editEars(idx, 'shall', e.target.value)}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage 3: Step-by-Step Task Breakdown (tasks.md) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      Stage 3 • Full-Feature Task Breakdown &amp; Parallel Execution
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Step-by-Step Task Breakdown (Full Features, Not Horizontal Layers) (
                      <code>tasks.md</code>)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Build one complete feature slice at a time across data, service, boundary,
                      UI, and tests. Tag <code>[HITL]</code> (Human Review) vs <code>[AFK]</code>{' '}
                      (Automatic) and <code>[P]</code> for parallel execution.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={addSlice}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Feature Task
                    </button>
                    <button
                      onClick={() => setSelectedArtifact('specs/001-feature/tasks.md')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs"
                    >
                      Preview tasks.md →
                    </button>
                  </div>
                </div>

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="Vertical Slices"
                    explanation="Building one complete working mini-feature end-to-end (data, UI, and tests) at a time instead of unfinished horizontal layers."
                  />
                )}

                <div className="space-y-3">
                  {form.verticalSlices.map((slice, idx) =>
                    isIntermediateMode ? (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-indigo-300">
                              {slice.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                                slice.mode === 'HITL'
                                  ? 'bg-amber-500/15 text-amber-200 border-amber-500/40'
                                  : 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'
                              }`}
                            >
                              {slice.mode === 'HITL'
                                ? '[HITL] Human Review'
                                : '[AFK] Runs Automatically'}
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove task ${slice.id}`}
                            onClick={() => removeSlice(idx)}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            What does this checklist item build?
                          </label>
                          <input
                            type="text"
                            aria-label={`Task ${idx + 1} title`}
                            value={slice.title}
                            onChange={(e) =>
                              updateIntermediateSlice(idx, { title: e.target.value })
                            }
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={slice.mode === 'HITL'}
                              onChange={(e) =>
                                updateIntermediateSlice(idx, {
                                  needsHumanReview: e.target.checked
                                })
                              }
                              className="accent-amber-500 rounded"
                            />
                            <span>
                              Needs human review (<code>[HITL]</code>) — uncheck to run
                              automatically (<code>[AFK]</code>)
                            </span>
                          </label>

                          <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={slice.parallel}
                              onChange={(e) =>
                                updateIntermediateSlice(idx, { parallel: e.target.checked })
                              }
                              className="accent-emerald-500 rounded"
                            />
                            <span>Can run in parallel</span>
                          </label>
                        </div>

                        <p className="text-[11px] text-emerald-300/90 bg-emerald-950/30 border border-emerald-500/20 rounded-lg px-2.5 py-1.5">
                          Auto-generated tracer bullet layers:{' '}
                          <span className="font-mono text-emerald-200">{slice.layers}</span>
                        </p>
                      </div>
                    ) : (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={slice.id}
                              onChange={(e) => editSlice(idx, 'id', e.target.value)}
                              className="w-16 rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs font-mono font-bold text-indigo-300"
                            />
                            <select
                              value={slice.mode}
                              onChange={(e) => editSlice(idx, 'mode', e.target.value)}
                              className="rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white"
                            >
                              <option value="HITL">[HITL] Co-Piloted</option>
                              <option value="AFK">[AFK] Autonomous</option>
                            </select>
                            <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={slice.parallel}
                                onChange={(e) => editSlice(idx, 'parallel', e.target.checked)}
                                className="accent-emerald-500"
                              />
                              <span>[P] Parallelizable</span>
                            </label>
                          </div>
                          <button
                            onClick={() => removeSlice(idx)}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                              Slice Title
                            </span>
                            <input
                              type="text"
                              value={slice.title}
                              onChange={(e) => editSlice(idx, 'title', e.target.value)}
                              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                              End-to-End Integration Layers Included
                            </span>
                            <input
                              type="text"
                              value={slice.layers}
                              onChange={(e) => editSlice(idx, 'layers', e.target.value)}
                              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-mono text-emerald-200"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ====================================================================
            RIGHT COLUMN: LIVE MULTI-FILE ARTIFACT INSPECTOR & EXPORT DOCK (5 COLS)
           ==================================================================== */}
        <div
          className={`lg:col-span-5 ${
            mobilePane === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="sticky top-28 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-8.5rem)]">
            {dummyProofMode && (
              <div className="p-4 border-b border-indigo-500/30 bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-900 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                    Ready to Build? Choose Your Next Step
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="rounded-xl bg-slate-950/80 border border-indigo-500/40 p-3 space-y-2">
                    <div className="text-xs font-semibold text-white">
                      Option A — Easiest (No Folders Needed)
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(artifacts['TASK_PROMPT.md'].content, 'NEXT_STEP_PROMPT')
                      }
                      className="w-full py-2.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
                    >
                      {copiedKey === 'NEXT_STEP_PROMPT' ? (
                        <>
                          <Check className="w-4 h-4 shrink-0" />
                          <span>Copied! Now paste this into Antigravity or Copilot Chat</span>
                        </>
                      ) : (
                        <span>📋 Copy Prompt to Paste into AI Chat</span>
                      )}
                    </button>
                  </div>

                  <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-2">
                    <div className="text-xs font-semibold text-slate-200">
                      Option B — Full Project Setup (1-Click Folder Save)
                    </div>
                    <button
                      type="button"
                      onClick={handleExportToFolder}
                      disabled={isExportingFolder}
                      className="w-full py-2 px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
                    >
                      <span>
                        {isExportingFolder
                          ? 'Putting Files Into Your Folder...'
                          : '📁 Put All Files Into My Project Folder'}
                      </span>
                    </button>
                    <p className="text-[11px] text-slate-400">
                      Pick an empty folder on your computer and we will put all the rule files in
                      the right places automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Artifact Dock Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">
                    Live Generated Artifact &amp; File Suite
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(currentArtifact.content, currentArtifactKey)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
                  >
                    {copiedKey === currentArtifactKey ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy File
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadFile(currentArtifactKey, currentArtifact.content)
                    }
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title="Save current file to disk"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleExportToFolder}
                    disabled={isExportingFolder}
                    className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 disabled:opacity-50"
                    title="Export all generated files directly to a repository folder"
                  >
                    <FolderUp className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* File Selector Pills */}
              <div
                className={`flex flex-wrap items-center gap-1.5 overflow-y-auto pr-1 ${
                  isDockFiltered && isIntermediateMode ? 'max-h-48' : 'max-h-28'
                }`}
              >
                {isDockFiltered && isSimpleMode
                  ? SIMPLE_ESSENTIAL_FILES.map(({ key: fileKey, label }) => {
                      const active = fileKey === currentArtifactKey;
                      return (
                        <button
                          key={fileKey}
                          onClick={() => setSelectedArtifact(fileKey)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 border ${
                            active
                              ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400/60 font-semibold'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800/70'
                          }`}
                        >
                          <span>{label}</span>
                        </button>
                      );
                    })
                  : isDockFiltered && isIntermediateMode
                    ? INTERMEDIATE_CORE_FILES.map(({ key: fileKey, label, subtitle }) => {
                        const active = fileKey === currentArtifactKey;
                        return (
                          <button
                            key={fileKey}
                            onClick={() => setSelectedArtifact(fileKey)}
                            title={subtitle}
                            className={`px-2.5 py-1.5 rounded-lg text-left transition flex flex-col gap-0.5 border ${
                              active
                                ? 'bg-indigo-500/25 text-indigo-100 border-indigo-400/60'
                                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800/70'
                            }`}
                          >
                            <span className="text-[11px] font-mono font-semibold">{label}</span>
                            <span className="text-[10px] text-slate-400 leading-tight">
                              {subtitle}
                            </span>
                          </button>
                        );
                      })
                    : Object.entries(artifacts).map(([fileKey, item]) => {
                        const active = fileKey === currentArtifactKey;
                        const tooltip =
                          FILE_USAGE_GUIDE[fileKey]?.whatIsIt || item.title || fileKey;
                        return (
                          <button
                            key={fileKey}
                            onClick={() => setSelectedArtifact(fileKey)}
                            title={tooltip}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition flex items-center gap-1.5 border ${
                              active
                                ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400/60 font-semibold'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/70'
                            }`}
                          >
                            <span>{fileKey}</span>
                          </button>
                        );
                      })}
                {!isProMode && (
                  <button
                    type="button"
                    onClick={() => setShowAllSimpleFiles((prev) => !prev)}
                    className="px-2 py-1 text-[11px] font-medium text-indigo-300 hover:text-indigo-200 underline underline-offset-2 transition"
                  >
                    {showAllSimpleFiles
                      ? isSimpleMode
                        ? 'Show 3 essential files only'
                        : 'Show 6 core files only'
                      : 'Show all 14 advanced files'}
                  </button>
                )}
              </div>

              {/* Live Prompt Health & AI Memory Bar (Intermediate & Pro Modes) */}
              {!isSimpleMode && (
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div
                      title="Top/Bottom Focus: Top-Priority Rules and Final Instructions are active, and rule files are within safe limits"
                      className="rounded-lg bg-slate-900/90 border border-slate-800 px-2.5 py-2 space-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-emerald-300">🟢 Rule Size</span>
                        <span className="text-[10px] text-slate-400">Top/Bottom Focus: Ready</span>
                      </div>
                      <p className="text-slate-300 leading-snug">{diagnostics.ruleSizeMessage}</p>
                    </div>
                    <div
                      title="Prompt size health check for fast, accurate AI responses"
                      className="rounded-lg bg-slate-900/90 border border-slate-800 px-2.5 py-2 space-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-cyan-300">🔵 Prompt Length</span>
                      </div>
                      <p className="text-slate-300 leading-snug">
                        {diagnostics.promptLengthMessage}
                      </p>
                    </div>
                    <div
                      title="AI Memory Limits check so the AI never forgets your instructions"
                      className="rounded-lg bg-slate-900/90 border border-slate-800 px-2.5 py-2 space-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-purple-300">🟣 Memory Safety</span>
                        <span className="text-[10px] text-slate-400">AI Memory Limits: OK</span>
                      </div>
                      <p className="text-slate-300 leading-snug">
                        {diagnostics.memorySafetyMessage}
                      </p>
                    </div>
                  </div>
                  {(diagnostics.isPromptLong ||
                    !diagnostics.isRuleSizeSafe ||
                    !diagnostics.isCopilotSizeSafe) && (
                    <div className="rounded-lg bg-amber-500/15 border border-amber-400/40 px-3 py-2 text-amber-100 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        Your prompt is getting a bit long; consider starting a fresh AI chat or
                        trimming extra notes so the AI stays focused.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Active File Path Subbar */}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-indigo-300 truncate">{currentArtifact.title}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold uppercase">
                {currentArtifact.badge}
              </span>
            </div>

            {/* Plain-Language "Where Does This File Go?" Banner */}
            {showPlainHelpers && (
              <div className="px-4 py-2.5 bg-indigo-950/40 border-b border-indigo-500/30 space-y-1 text-xs">
                <p className="text-indigo-200 font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{currentFileGuide.whatIsIt}</span>
                </p>
                <p className="text-emerald-300 text-[11px]">
                  <strong>Where to put it:</strong> {currentFileGuide.whereItGoes}
                </p>
              </div>
            )}

            {/* Code / Markdown Viewer */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs leading-relaxed text-slate-200 select-all">
              <pre className="whitespace-pre-wrap break-words">{currentArtifact.content}</pre>
            </div>

            {/* Quick-Start Operational Checklist Footer */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>
                Tip: Trigger <code>/handoff</code> before 120k tokens to prevent persona drift.
              </span>
              <button
                onClick={() => handleCopy(currentArtifact.content, currentArtifactKey)}
                className="text-indigo-300 hover:underline font-medium"
              >
                Copy {currentArtifactKey}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ====================================================================
          MOBILE BOTTOM BAR (SWITCH BETWEEN INPUTS & LIVE PREVIEW ON PHONES)
         ==================================================================== */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around gap-2">
        <button
          onClick={() => setMobilePane('editor')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            mobilePane === 'editor'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>1. Fill Details &amp; Guide</span>
        </button>
        <button
          onClick={() => setMobilePane('preview')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            mobilePane === 'preview'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>2. Preview &amp; Copy Files</span>
        </button>
      </div>
    </div>
  );
}