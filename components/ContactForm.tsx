'use client';

import { type FormEvent } from 'react';
import { CONTACT } from '@/lib/content';

/**
 * There is no form backend on a static site. Submitting composes an email to
 * the founder in the visitor's mail app with the fields pre-filled, so nothing
 * typed here is ever lost to a dead end.
 */
export default function ContactForm() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const subject = `Enquiry from ${name || 'the PIZA website'}`;
    const body = `${message}\n\n${name}\n${email}`;
    window.location.href =
      `mailto:${CONTACT.founder}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="pz-form" onSubmit={onSubmit}>
      <label className="pz-label">
        <span className="pz-label-text">Name</span>
        <input type="text" name="name" required className="pz-input" autoComplete="name" />
      </label>

      <label className="pz-label">
        <span className="pz-label-text">Email</span>
        <input type="email" name="email" required className="pz-input" autoComplete="email" />
      </label>

      <label className="pz-label">
        <span className="pz-label-text">What are you building</span>
        <textarea name="message" rows={3} required className="pz-textarea" />
      </label>

      <button type="submit" className="pz-submit">
        Send enquiry
      </button>
      <span className="pz-form-note">Opens in your mail app</span>
    </form>
  );
}
