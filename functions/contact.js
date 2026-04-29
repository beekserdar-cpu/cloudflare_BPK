import { EmailMessage } from "cloudflare:email";

const RECIPIENT = "drrahim@live.be";
const SENDER = "contact@beekpsychokliniek.com";

const cleanHeader = (value) => String(value || "").replace(/[\r\n]+/g, " ").trim();
const cleanBody = (value) => String(value || "").replace(/\r\n/g, "\n").trim();

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const redirectTo = (request, path) => Response.redirect(new URL(path, request.url), 303);

export async function onRequestPost({ request, env }) {
  const formData = await request.formData();

  if (formData.get("bot-field")) {
    return redirectTo(request, "/bedankt.html");
  }

  const firstName = cleanBody(formData.get("voornaam-client"));
  const lastName = cleanBody(formData.get("naam-client"));
  const email = cleanHeader(formData.get("email"));
  const phone = cleanBody(formData.get("telefoon"));
  const message = cleanBody(formData.get("bericht"));
  const languages = formData.getAll("talen-client").map(cleanBody).filter(Boolean);
  const consent = formData.get("privacy-akkoord");

  if (!firstName || !lastName || !email || !message || !consent || languages.length === 0) {
    return new Response("Niet alle verplichte velden zijn ingevuld.", { status: 400 });
  }

  const body = [
    "Nieuwe contactaanvraag via beekpsychokliniek.com",
    "",
    `Voornaam client: ${firstName}`,
    `Naam client: ${lastName}`,
    `E-mail: ${email}`,
    `Telefoon: ${phone || "Niet ingevuld"}`,
    `Gewenste taal/talen client: ${languages.join(", ")}`,
    "",
    "Bericht:",
    message,
  ].join("\n");

  const subject = cleanHeader(`Nieuwe contactaanvraag - ${firstName} ${lastName}`);
  const rawEmail = [
    `From: "Beek Psychokliniek website" <${SENDER}>`,
    `To: ${RECIPIENT}`,
    `Reply-To: ${email}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ].join("\r\n");

  try {
    const emailMessage = new EmailMessage(SENDER, RECIPIENT, rawEmail);
    await env.CONTACT_EMAIL.send(emailMessage);
  } catch (error) {
    return new Response(`E-mail kon niet worden verzonden: ${escapeHtml(error.message)}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=UTF-8" },
    });
  }

  return redirectTo(request, "/bedankt.html");
}

export function onRequestGet({ request }) {
  return redirectTo(request, "/");
}
