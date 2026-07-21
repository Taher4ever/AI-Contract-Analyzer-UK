-- Seed the blog with 3 real articles so the repo ships with content.
-- author_id is left null (portable across environments — we don't know
-- which profile id will exist when this migration runs elsewhere).

insert into public.blog_posts (slug, title, excerpt, content, published, created_at)
values
(
  '10-red-flags-in-uk-tenancy-agreements',
  '10 Red Flags in UK Tenancy Agreements',
  'Before you sign an assured shorthold tenancy, check for these ten clauses that tenants regularly get caught out by.',
  $md$Signing a tenancy agreement is one of those moments where excitement about a new home can make it easy to skim past the paperwork. Most UK assured shorthold tenancies (ASTs) are standard, but a few clauses show up again and again that are worth reading twice. None of these are automatically illegal — but each one shifts risk onto you, the tenant, and is worth understanding before you sign.

## 1. Unreasonable cleaning or redecoration clauses

Clauses requiring "professional cleaning" at the end of the tenancy, regardless of the property's actual condition, are a common source of deposit disputes. You're only required to return the property in the condition recorded at check-in, allowing for fair wear and tear.

## 2. Vague "fair wear and tear" definitions

Some agreements try to redefine wear and tear so narrowly that almost any mark on a wall counts as damage. If the clause reads more like a list of exclusions than a definition, treat it as a flag to negotiate or document thoroughly with photos.

## 3. Restrictions that go beyond the property

Clauses banning visitors overnight, controlling how many nights you can be away, or requiring permission to have a partner stay are usually unenforceable but still appear. They're worth questioning before you sign rather than testing later.

## 4. Blanket bans with no process for permission

A flat "no pets, ever" clause is different from one that says pets require written consent, which cannot be unreasonably withheld (the position most tenancies are moving toward under recent guidance). The second is fairer and worth asking a landlord to adopt if the first is offered.

## 5. Rent review clauses with no formula

If the agreement allows the landlord to raise rent "at their discretion" at any point, rather than through the standard Section 13 process or a clearly defined annual increase, that's a clause to query. Look for a specific percentage, index (like CPI), or reference to statutory procedure.

## 6. Repair obligations shifted onto the tenant

Landlords are legally responsible for the structure, exterior, and installations for water, gas, electricity, heating and sanitation. A clause that tries to make you responsible for a boiler service or roof repair is very likely unenforceable, but it signals a landlord worth asking more questions of.

## 7. Break clauses that are one-sided

Some agreements give the landlord the right to end the tenancy early with short notice but give the tenant no equivalent right, or only after a long minimum term. Check whether a break clause exists at all, and whether it's mutual.

## 8. Excessive or non-refundable fees

Since the Tenant Fees Act 2019, landlords and agents in England can only charge a holding deposit, security deposit (capped at five or six weeks' rent depending on annual rent), and a few other specific items. Any clause charging admin fees, "reference check fees," or non-refundable deposits should be checked against the Act.

## 9. Automatic deposit forfeiture clauses

A clause stating the deposit is automatically forfeited for specific minor issues, rather than assessed fairly at the end of the tenancy through the deposit protection scheme's dispute process, tries to bypass a legal protection you're entitled to.

## 10. Ambiguous joint liability wording

In a shared tenancy, "joint and several liability" means each tenant can be held responsible for the whole rent, not just their share, if a housemate stops paying. This is standard, but it's worth knowing it's there rather than discovering it later.

## The takeaway

Most of these clauses won't apply to you, and most landlords aren't trying to catch you out. But a five-minute read before you sign, ideally clause by clause, is the cheapest insurance you'll ever buy on a tenancy. If a clause reads oddly, ask — a reasonable landlord will explain it or remove it.$md$,
  true,
  now() - interval '2 days'
),
(
  'what-is-a-notice-period-plain-english-guide',
  'What Is a Notice Period? A Plain-English Guide',
  'Notice periods decide when you can leave a job, a tenancy or a contract — and getting them wrong can be expensive. Here''s how they actually work.',
  $md$A notice period is simply the amount of warning either side of a contract has to give before ending it. It shows up in employment contracts, tenancy agreements, freelance contracts and subscriptions alike, and it's one of the most commonly misunderstood terms in any document — mostly because people assume it works the same way everywhere. It doesn't.

## The basic idea

A notice period exists to give both parties time to adjust: an employer time to find cover, a landlord time to re-let a property, a client time to find a new supplier. Ending a contract "with immediate effect" is the exception, not the rule, and usually only applies in cases of serious breach.

## Notice periods in employment

In UK employment law, statutory minimum notice (from the employer) is one week for each complete year of service, up to a maximum of 12 weeks, once you've worked there for a month or more. Many contracts specify longer notice than the statutory minimum, especially for senior roles — three to six months isn't unusual.

Notice you must give as an employee is often shorter and fixed in the contract itself (commonly one month), regardless of how long you've worked there, unless the contract says otherwise. Always check both directions separately — they're often not symmetrical.

## Notice periods in tenancies

For assured shorthold tenancies, a landlord must give at least two months' notice using the correct legal form (a Section 21 or Section 8 notice, depending on the reason) — and this can only take effect after any fixed term has ended, subject to ongoing reforms tightening these rules further. A tenant leaving during a fixed term generally needs a break clause to do so early; after the fixed term becomes a periodic tenancy, one month's notice (for monthly rent) is typical, but check what your specific agreement says.

## Notice periods in freelance and service contracts

These are the most variable, because they're negotiated rather than set by statute. A freelance contract might specify 30 days' notice to terminate, or it might allow immediate termination for non-payment. If nothing is specified, ending the relationship can become a genuine grey area — which is exactly why a clear notice clause protects both sides.

## What to check in any contract

1. **Is the notice period the same in both directions?** It's common for a company or landlord to require less notice from themselves than they require from you.
2. **When does the clock start?** Some contracts require notice to be in writing and received (not just sent) before the countdown begins.
3. **Does it renew automatically?** A missed notice deadline can sometimes roll the contract into another full term — this overlaps heavily with auto-renewal clauses, covered in our other guide.
4. **Are there exceptions?** Serious breach, non-payment, or specific "cause" events can sometimes allow either side to skip the notice period entirely.

## Why this matters more than it seems

Getting a notice period wrong is rarely dramatic, but it's rarely cheap either: a month of rent you didn't expect to pay, a job offer you can't start on time because your current employer holds you to three months, or a service contract that renews for another year because you missed a 60-day cancellation window. Reading this one clause carefully, in every contract you sign, is a small habit with an outsized payoff.$md$,
  true,
  now() - interval '6 days'
),
(
  'auto-renewal-clauses-how-to-avoid-getting-trapped',
  'Auto-Renewal Clauses: How to Avoid Getting Trapped',
  'Auto-renewal clauses quietly extend contracts you meant to end. Here''s how to spot them and cancel on time.',
  $md$An auto-renewal clause automatically extends a contract for another term unless you actively cancel before a deadline. They're common in gym memberships, software subscriptions, business services, tenancies and even some employment contracts. They're not inherently unfair — but they're specifically designed to benefit from inertia, and that's exactly why they deserve a closer read.

## How auto-renewal actually works

The mechanism is almost always the same: the contract renews for a further fixed term (often identical in length to the original) unless you give notice by a specific cut-off date, which is usually defined relative to the renewal date, not the date you signed. A one-year contract with a "60 days before expiry" cancellation window means you might need to cancel in month 10 of a 12-month term — long before most people are thinking about it.

## Why they catch people out

Three things make auto-renewal clauses genuinely risky rather than just mildly annoying:

- **The cancellation window is early.** By the time a renewal notice or invoice arrives, it's frequently already too late to cancel for that cycle.
- **The renewal term can be long.** Some business contracts auto-renew into a further 12-month term, not a rolling monthly one, so a missed deadline is costly.
- **Notice requirements are specific.** A clause might require written notice by post or a named contact, and simply not paying an invoice, or verbally telling someone you're leaving, won't count as valid cancellation.

## What UK law says

For consumer contracts, the Consumer Rights Act 2015 and related guidance push providers toward reasonable, transparent renewal terms, and some sectors (like certain insurance products) now have specific rules requiring clearer renewal notices. But plenty of B2B contracts and lower-profile consumer services still rely on old-fashioned notice-period clauses with no special protection — so the responsibility to track the date still sits with you.

## How to protect yourself

1. **Find the exact clause before you sign.** Search the document for "renew," "automatically," or "continue" rather than assuming there's a simple end date.
2. **Note two dates, not one.** Record both the contract's actual end date and the cancellation deadline that precedes it — then set a reminder for the earlier one.
3. **Check the required method of cancellation.** Some contracts specify email, some require signed post, some require a specific portal. Using the wrong method can mean your cancellation doesn't count.
4. **Get confirmation.** Always ask for written confirmation that your cancellation was received and processed — a verbal "that's fine" from a call centre is not proof if the renewal charge appears anyway.
5. **Ask what happens if you do nothing.** If a provider can't clearly explain what your contract term becomes after renewal, that's worth pushing on before you sign in the first place.

## The takeaway

Auto-renewal clauses aren't a trick on their own — they're a standard commercial tool. The trap is entirely in the timing: cancellation windows that close well before the contract you're thinking about actually ends. Reading this clause once, at the start, and setting a calendar reminder for the real deadline is the difference between a contract that serves you and one that quietly renews itself at your expense.$md$,
  true,
  now() - interval '10 days'
);
