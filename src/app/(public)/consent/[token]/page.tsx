'use client'

import { use, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Shield,
  Lock,
  CheckCircle,
  FileSignature,
  AlertCircle,
  Loader2,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type FieldType = 'signature' | 'checkbox' | 'date' | 'text'

interface SignField {
  type: FieldType
  label: string
  required: boolean
}

interface SignRequest {
  id: number
  title: string
  recipientName: string
  senderName: string
  fields: SignField[]
  status: string
  expiresAt: string | null
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CONSENT_ENGINE_BASE = 'https://consent-engine-nustack-digital-ventures-llc.vercel.app'
const PRACTICE_PHONE = '(702) 935-4395'
const PRACTICE_PHONE_HREF = 'tel:+17029354395'
const PRACTICE_ADDRESS = '7480 West Sahara Avenue, Las Vegas, NV 89117'

// ─── Sub-components ──────────────────────────────────────────────────────────

function PageHeader({ title, senderName: _senderName }: { title: string; senderName: string }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-9 w-28 flex-shrink-0">
            <Image
              src="/ak-logo-header.png"
              alt="AK Ultimate Dental"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="hidden sm:block w-px h-6 bg-slate-200" />
          <div className="hidden sm:block min-w-0">
            <p className="text-xs text-slate-500 leading-none">Consent Form</p>
            <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-cyan-50 border border-cyan-200 rounded-full px-3 py-1.5">
            <Shield className="h-3.5 w-3.5 text-cyan-600" />
            <span className="text-xs font-medium text-cyan-700 whitespace-nowrap">HIPAA-Aware</span>
          </div>
        </div>
      </div>
    </header>
  )
}

function TrustBanner() {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-300">Legally binding electronic consent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-300">Secured by Consent Engine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileSignature className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-300">Signature valid under E-SIGN Act</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100)
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-slate-500">
          {current === total && total > 0 ? 'All fields complete' : `${current} of ${total} required field${total !== 1 ? 's' : ''} complete`}
        </span>
        <span className="text-xs font-semibold text-cyan-700">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-cyan-500 to-blue-600"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── State screens ────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative h-10 w-36 mb-2">
        <Image src="/ak-logo-header.png" alt="AK Ultimate Dental" fill className="object-contain" />
      </div>
      <Loader2 className="h-7 w-7 animate-spin text-cyan-600" />
      <p className="text-sm text-slate-500">Loading your consent form…</p>
    </div>
  )
}

function AlreadySignedScreen({ signedAt, signedBy }: { signedAt?: string | null; signedBy?: string | null }) {
  return (
    <FullPageCard
      iconBg="bg-emerald-100"
      icon={<CheckCircle className="h-10 w-10 text-emerald-600" />}
      title="Already Signed"
      body={
        <>
          <p className="text-slate-600">
            This consent form was already signed
            {signedBy && <> by <strong className="font-semibold text-slate-800">{signedBy}</strong></>}
            {signedAt && (
              <> on{' '}
                <strong className="font-semibold text-slate-800">
                  {new Date(signedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </strong>
              </>
            )}
            .
          </p>
          <p className="text-sm text-slate-500 mt-2">
            If you have questions, please contact our office.
          </p>
        </>
      }
    />
  )
}

function ExpiredScreen() {
  return (
    <FullPageCard
      iconBg="bg-amber-100"
      icon={<Clock className="h-10 w-10 text-amber-500" />}
      title="Link Expired"
      body={
        <p className="text-slate-600">
          This consent form link has expired. Please contact{' '}
          <strong className="font-semibold">AK Ultimate Dental</strong> to receive a new link.
        </p>
      }
    />
  )
}

function NotFoundScreen() {
  return (
    <FullPageCard
      iconBg="bg-slate-100"
      icon={<AlertCircle className="h-10 w-10 text-slate-400" />}
      title="Form Not Found"
      body={
        <p className="text-slate-600">
          We could not find a consent form at this link. It may have been revoked or the link is
          incorrect. Please contact us for assistance.
        </p>
      }
    />
  )
}

function SuccessScreen({ recipientName }: { recipientName: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-sm w-full">
        <div className="relative h-10 w-36 mx-auto mb-8">
          <Image src="/ak-logo-header.png" alt="AK Ultimate Dental" fill className="object-contain" />
        </div>

        {/* Animated check */}
        <div className="relative mx-auto mb-6 h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Consent Recorded</h1>
        <p className="text-slate-600 mb-6">
          Thank you, {recipientName.split(' ')[0]}. Your signed consent has been securely submitted.
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-left">
            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="text-slate-700">AK Ultimate Dental has been notified</span>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-left">
            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="text-slate-700">Your signature is on record</span>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-left">
            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="text-slate-700">A copy will be available in your patient portal</span>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-2">You may safely close this window.</p>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4">
          <Phone className="h-3 w-3" />
          <a href={PRACTICE_PHONE_HREF} className="hover:text-cyan-600 transition-colors">
            {PRACTICE_PHONE}
          </a>
        </div>
      </div>
    </div>
  )
}

function FullPageCard({
  iconBg,
  icon,
  title,
  body,
}: {
  iconBg: string
  icon: React.ReactNode
  title: string
  body: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full">
        <div className="relative h-10 w-36 mx-auto mb-8">
          <Image src="/ak-logo-header.png" alt="AK Ultimate Dental" fill className="object-contain" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className={`${iconBg} rounded-full p-4 w-fit mx-auto mb-5`}>{icon}</div>
          <h1 className="text-xl font-bold text-slate-900 mb-3">{title}</h1>
          <div className="text-sm leading-relaxed">{body}</div>
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-1 text-xs text-slate-400">
            <div className="flex items-center justify-center gap-1.5">
              <Phone className="h-3 w-3" />
              <a href={PRACTICE_PHONE_HREF} className="hover:text-cyan-600 transition-colors">
                {PRACTICE_PHONE}
              </a>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <MapPin className="h-3 w-3" />
              <span>{PRACTICE_ADDRESS}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Field renderers ──────────────────────────────────────────────────────────

function SignatureField({
  label,
  required,
  value,
  onChange,
}: {
  label: string
  required: boolean
  value: string
  onChange: (v: string) => void
}) {
  const filled = value.trim().length >= 2
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <FileSignature className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
        <label className="text-sm font-semibold text-slate-800">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      </div>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your full legal name"
          className={`w-full rounded-xl border-2 px-5 py-4 font-serif text-xl italic text-slate-900 placeholder:text-slate-300 placeholder:not-italic focus:outline-none transition-all ${
            filled
              ? 'border-cyan-400 bg-cyan-50/40 focus:ring-2 focus:ring-cyan-300'
              : 'border-slate-200 bg-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200'
          }`}
          required={required}
        />
        {filled && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
        )}
      </div>
      {/* Signature underline visual */}
      <div className="relative">
        <div className="h-px bg-slate-300" />
        <div
          className="absolute left-0 top-0 h-px bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
          style={{ width: filled ? '100%' : '0%' }}
        />
      </div>
      <p className="text-xs text-slate-400 flex items-center gap-1.5">
        <Lock className="h-3 w-3" />
        Typing your name constitutes your legal electronic signature
      </p>
    </div>
  )
}

function CheckboxField({
  label,
  required,
  value,
  onChange,
}: {
  label: string
  required: boolean
  value: string
  onChange: (v: string) => void
}) {
  const checked = value === 'checked'
  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked ? 'checked' : '')}
          required={required}
        />
        <div
          className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            checked
              ? 'border-emerald-500 bg-emerald-500'
              : 'border-slate-300 bg-white group-hover:border-cyan-400'
          }`}
        >
          {checked && (
            <svg className="h-4 w-4 text-white" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8l4 4 6-6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span
        className={`text-sm leading-relaxed transition-colors ${
          checked ? 'text-slate-800 font-medium' : 'text-slate-600'
        }`}
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
    </label>
  )
}

function DateField({
  label,
  required,
  value,
  onChange,
}: {
  label: string
  required: boolean
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition-all"
      />
    </div>
  )
}

function TextField({
  label,
  required,
  value,
  onChange,
}: {
  label: string
  required: boolean
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your response…"
        required={required}
        maxLength={200}
        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition-all"
      />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ConsentSignPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)

  const [request, setRequest] = useState<SignRequest | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'already_signed' | 'expired' | 'not_found'>('loading')
  const [alreadySignedMeta, setAlreadySignedMeta] = useState<{ at?: string | null; by?: string | null }>({})
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    fetch(`${CONSENT_ENGINE_BASE}/api/consent/sign/${token}`)
      .then(async (res) => {
        const data = await res.json() as Record<string, unknown>
        if (res.status === 410) {
          if ((data.status as string) === 'signed') {
            setAlreadySignedMeta({ at: data.signed_at as string | undefined, by: data.signed_by as string | undefined })
            setLoadState('already_signed')
          } else {
            setLoadState('expired')
          }
        } else if (!res.ok) {
          setLoadState('not_found')
        } else {
          const req = data as unknown as SignRequest
          setRequest(req)
          const initial: Record<string, string> = {}
          req.fields.forEach((f, i) => {
            if (f.type === 'date') initial[String(i)] = new Date().toISOString().split('T')[0] ?? ''
            if (f.type === 'checkbox') initial[String(i)] = ''
          })
          setResponses(initial)
          setLoadState('ready')
        }
      })
      .catch(() => setLoadState('not_found'))
  }, [token])

  function setField(i: number, v: string) {
    setResponses((prev) => ({ ...prev, [String(i)]: v }))
  }

  // Progress calculation — count required fields that are filled
  const requiredFields = request?.fields.filter((f) => f.required) ?? []
  const filledRequired = requiredFields.filter((f) => {
    const idx = request?.fields.indexOf(f) ?? -1
    const val = responses[String(idx)] ?? ''
    return val.trim().length > 0 && val !== ''
  }).length

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!request) return
    setSubmitError(null)

    // Validate required fields
    for (let i = 0; i < request.fields.length; i++) {
      const f = request.fields[i]!
      if (!f.required) continue
      const val = responses[String(i)] ?? ''
      if (f.type === 'checkbox' && val !== 'checked') {
        setSubmitError(`Please check the required box: "${f.label}"`)
        return
      }
      if (f.type !== 'checkbox' && val.trim().length === 0) {
        setSubmitError(`Please complete the required field: "${f.label}"`)
        return
      }
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${CONSENT_ENGINE_BASE}/api/consent/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldResponses: responses }),
      })
      const data = await res.json() as Record<string, unknown>
      if (!res.ok) throw new Error((data.error as string) || 'Submission failed')
      setDone(true)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── State gates ──
  if (loadState === 'loading') return <LoadingScreen />
  if (done && request) return <SuccessScreen recipientName={request.recipientName} />
  if (loadState === 'already_signed') return <AlreadySignedScreen signedAt={alreadySignedMeta.at} signedBy={alreadySignedMeta.by} />
  if (loadState === 'expired') return <ExpiredScreen />
  if (loadState === 'not_found' || !request) return <NotFoundScreen />

  const firstName = request.recipientName.split(' ')[0] ?? request.recipientName

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title={request.title} senderName={request.senderName} />
      <TrustBanner />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Greeting */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-medium text-cyan-700">From {request.senderName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{request.title}</h1>
          <p className="text-base text-slate-500">
            Hi <span className="font-semibold text-slate-800">{firstName}</span>, please review and sign below.
          </p>
        </div>

        {/* Progress */}
        <ProgressBar current={filledRequired} total={requiredFields.length} />

        {/* Important notice */}
        <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>Important:</strong> Please read this document carefully. By completing the
            fields below and submitting, you confirm your informed consent.
          </p>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {request.fields.map((field, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border-2 p-5 sm:p-6 shadow-sm transition-all duration-200 ${
                (() => {
                  const val = responses[String(i)] ?? ''
                  const filled = field.type === 'checkbox' ? val === 'checked' : val.trim().length > 0
                  return filled ? 'border-cyan-200 bg-cyan-50/20' : 'border-slate-200 hover:border-slate-300'
                })()
              }`}
            >
              {field.type === 'signature' && (
                <SignatureField
                  label={field.label}
                  required={field.required}
                  value={responses[String(i)] ?? ''}
                  onChange={(v) => setField(i, v)}
                />
              )}
              {field.type === 'checkbox' && (
                <CheckboxField
                  label={field.label}
                  required={field.required}
                  value={responses[String(i)] ?? ''}
                  onChange={(v) => setField(i, v)}
                />
              )}
              {field.type === 'date' && (
                <DateField
                  label={field.label}
                  required={field.required}
                  value={responses[String(i)] ?? ''}
                  onChange={(v) => setField(i, v)}
                />
              )}
              {field.type === 'text' && (
                <TextField
                  label={field.label}
                  required={field.required}
                  value={responses[String(i)] ?? ''}
                  onChange={(v) => setField(i, v)}
                />
              )}
            </div>
          ))}

          {/* Legal notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              By submitting this form, I confirm that I have read, understood, and voluntarily
              consent to the treatment described above.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              This electronic signature is legally binding under the Electronic Signatures in
              Global and National Commerce Act (E-SIGN Act). Your timestamp and IP address will
              be recorded.
            </p>
          </div>

          {/* Error */}
          {submitError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed px-8 py-4 text-white font-bold text-base shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <FileSignature className="h-5 w-5" />
                Submit Signed Consent Form
              </>
            )}
          </button>
        </form>

        {/* Contact footer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">AK Ultimate Dental</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={PRACTICE_PHONE_HREF}
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-cyan-600 transition-colors"
            >
              <Phone className="h-4 w-4 text-cyan-600" />
              {PRACTICE_PHONE}
            </a>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
              {PRACTICE_ADDRESS}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 pb-4">
          Secured by Consent Engine · NuStack Digital Ventures
          {request.expiresAt && (
            <> · Expires {new Date(request.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
          )}
        </p>
      </main>
    </div>
  )
}
