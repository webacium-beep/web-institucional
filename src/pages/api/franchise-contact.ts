import type { APIRoute } from 'astro';

import { getFranchiseContactByCountryCode } from '../../data/franchise-contacts';

const TEXT_INPUT_REGEX = /^[0-9A-Za-zÀ-ÿ.,@ ]+$/;
const PHONE_INPUT_REGEX = /^[0-9]+$/;

interface FranchiseContactPayload {
  countryCode: string;
  country: string;
  name: string;
  city: string;
  email: string;
  phone: string;
}

function sanitizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidTextInput(value: string) {
  return TEXT_INPUT_REGEX.test(value);
}

function isValidPhoneInput(value: string) {
  return PHONE_INPUT_REGEX.test(value);
}

export const POST: APIRoute = async ({ request }) => {
  const resendApiKey = import.meta.env.RESEND_API_KEY;
  const resendFromEmail = import.meta.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

  if (!resendApiKey) {
    return new Response(JSON.stringify({ error: 'Missing RESEND_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: FranchiseContactPayload;

  try {
    payload = (await request.json()) as FranchiseContactPayload;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const countryCode = sanitizeText(payload.countryCode).toUpperCase();
  const country = sanitizeText(payload.country);
  const name = sanitizeText(payload.name);
  const city = sanitizeText(payload.city);
  const email = sanitizeText(payload.email);
  const phone = sanitizeText(payload.phone);

  if (!countryCode || !country || !name || !city || !email || !phone) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!isValidTextInput(country) || !isValidTextInput(name) || !isValidTextInput(city) || !isValidTextInput(email)) {
    return new Response(JSON.stringify({ error: 'Invalid characters in text inputs' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!isValidPhoneInput(phone)) {
    return new Response(JSON.stringify({ error: 'Phone must contain only numbers' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const contactRow = getFranchiseContactByCountryCode(countryCode);

  if (!contactRow) {
    return new Response(JSON.stringify({ error: 'Country not supported' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [contactRow.email],
      reply_to: email,
      subject: `Nuevo lead de franquicia - ${country}`,
      html: `
        <h1>Nuevo lead de franquicia</h1>
        <p><strong>País seleccionado:</strong> ${country}</p>
        <p><strong>Código de país:</strong> ${countryCode}</p>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Ciudad:</strong> ${city}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Celular:</strong> ${contactRow.dialCode} ${phone}</p>
      `,
    }),
  });

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text();

    return new Response(JSON.stringify({ error: 'Failed to send email', details: resendError }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, recipient: contactRow.email }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
