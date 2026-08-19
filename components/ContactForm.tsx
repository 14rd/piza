'use client';

import { useState, type FormEvent } from 'react';

/**
 * Client-side only: submitting flips the button label. There is no endpoint
 * yet — wire this to a form service or a mailto handler before launch.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <form className="pz-form" onSubmit={onSubmit}>
      <label className="pz-label">
        <span className="pz-label-text">Name</span>
        <input type="text" name="name" required className="pz-input" />
      </label>

      <label className="pz-label">
        <span className="pz-label-text">Email</span>
        <input type="email" name="email" required className="pz-input" />
      </label>

      <label className="pz-label">
        <span className="pz-label-text">What are you building</span>
        <textarea name="message" rows={3} required className="pz-textarea" />
      </label>

      <button type="submit" className="pz-submit">
        {sent ? 'Sent — we’ll be in touch' : 'Send enquiry'}
      </button>
    </form>
  );
}
