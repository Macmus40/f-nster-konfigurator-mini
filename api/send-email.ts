import nodemailer from "nodemailer";

const EMAIL_TRANSLATIONS: Record<string, any> = {
  sv: {
    title: "OFFERTFÖRFRÅGAN",
    from: "från",
    kund: "Kund",
    epost: "E-post",
    telefon: "Telefon",
    adress: "Adress",
    meddelande: "Meddelande",
    valda_produkter: "Valda produkter",
    position: "Position",
    produkt: "Produkt",
    profil: "Profil",
    dimensioner: "Dimensioner",
    antal: "Antal",
    glas: "Glas",
    ventilation: "Ventilation",
    handtag: "Handtag",
    farg_ut: "Färg (ut)",
    farg_in: "Färg (in)",
    footer: "Skickat från Fonsterfaktor.se",
    thanks: "Tack för din förfrågan!",
    hi: "Hej",
    received: "Vi har tagit emot din offertförfrågan. Vårt team kommer att analysera de inskickade uppgifterna och kontakta dig så snart som möjligt.",
    copy: "Nedan hittar du en kopia av din förfrågan.",
    confirmation_subject: "BEKRÄFTELSE: Offertförfrågan - Fonsterfaktor",
  },
  da: {
    title: "TILBUDSANMODNING",
    from: "fra",
    kund: "Kunde",
    epost: "E-mail",
    telefon: "Telefon",
    adress: "Adresse",
    meddelande: "Besked",
    valda_produkter: "Valgte produkter",
    position: "Position",
    produkt: "Produkt",
    profil: "Profil",
    dimensioner: "Dimensioner",
    antal: "Antal",
    glas: "Glas",
    ventilation: "Ventilation",
    handtag: "Håndtag",
    farg_ut: "Farve (ud)",
    farg_in: "Farve (ind)",
    footer: "Sendt fra Fonsterfaktor.se",
    thanks: "Tak for din anmodning!",
    hi: "Hej",
    received: "Vi har modtaget din tilbudsanmodning. Vores team vil analysere de indsendte oplysninger og kontakte dig hurtigst muligt.",
    copy: "Nedenfor finder du en kopi af din anmodning.",
    confirmation_subject: "BEKRÆFTELSE: Tilbudsanmodning - Fonsterfaktor",
  },
  de: {
    title: "ANGEBOTSANFRAGE",
    from: "von",
    kund: "Kunde",
    epost: "E-Mail",
    telefon: "Telefon",
    adress: "Adresse",
    meddelande: "Nachricht",
    valda_produkter: "Ausgewählte Produkte",
    position: "Position",
    produkt: "Produkt",
    profil: "Profil",
    dimensioner: "Maße",
    antal: "Anzahl",
    glas: "Glas",
    ventilation: "Belüftung",
    handtag: "Griff",
    farg_ut: "Farbe (außen)",
    farg_in: "Farbe (innen)",
    footer: "Gesendet von Fonsterfaktor.se",
    thanks: "Vielen Dank für Ihre Anfrage!",
    hi: "Hallo",
    received: "Wir haben Ihre Angebotsanfrage erhalten. Unser Team wird die eingereichten Informationen analysieren und sich so schnell wie möglich mit Ihnen in Verbindung setzen.",
    copy: "Unten finden Sie eine Kopie Ihrer Anfrage.",
    confirmation_subject: "BESTÄTIGUNG: Angebotsanfrage - Fonsterfaktor",
  },
  en: {
    title: "QUOTE REQUEST",
    from: "from",
    kund: "Customer",
    epost: "Email",
    telefon: "Phone",
    adress: "Address",
    meddelande: "Message",
    valda_produkter: "Selected products",
    position: "Position",
    produkt: "Product",
    profil: "Profile",
    dimensioner: "Dimensions",
    antal: "Quantity",
    glas: "Glass",
    ventilation: "Ventilation",
    handtag: "Handle",
    farg_ut: "Color (out)",
    farg_in: "Color (in)",
    footer: "Sent from Fonsterfaktor.se",
    thanks: "Thank you for your inquiry!",
    hi: "Hi",
    received: "We have received your quote request. Our team will analyze the submitted information and contact you as soon as possible.",
    copy: "Below you will find a copy of your inquiry.",
    confirmation_subject: "CONFIRMATION: Quote Request - Fonsterfaktor",
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fName, lName, email, phone, address, message, entries, language = 'sv' } = req.body;
  const t = EMAIL_TRANSLATIONS[language] || EMAIL_TRANSLATIONS['sv'];

  try {
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; color: #333;">
        <h1 style="color: #333; border-bottom: 2px solid #f27d26; padding-bottom: 10px; font-size: 24px; margin-top: 0;">${t.title} ${t.from}: ${fName} ${lName}</h1>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>${t.kund}:</strong> ${fName} ${lName}</p>
          <p style="margin: 5px 0;"><strong>${t.epost}:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>${t.telefon}:</strong> ${phone}</p>
          <p style="margin: 5px 0;"><strong>${t.adress}:</strong> ${address}</p>
          <p style="margin: 5px 0;"><strong>${t.meddelande}:</strong> ${message}</p>
        </div>
        
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">${t.valda_produkter}:</h2>
        ${entries.map((entry: any) => `
          <div style="border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: white;">
            <h3 style="margin-top: 0; color: #f27d26; font-size: 16px; margin-bottom: 15px;">${t.position} ${entry.position}</h3>
            <div style="margin-bottom: 15px;">
              <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                    <p style="margin: 0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">${t.produkt}:</p>
                    <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 14px;">${entry.product}</p>
                    ${entry.productImage ? `<img src="${entry.productImage}" alt="${entry.product}" width="120" style="width: 120px; height: auto; border-radius: 4px; border: 1px solid #eee; display: block; outline: none; text-decoration: none;" referrerPolicy="no-referrer" />` : ''}
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                    <p style="margin: 0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">${t.profil}:</p>
                    <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 14px;">${entry.profile}</p>
                    ${entry.profileImage ? `<img src="${entry.profileImage}" alt="${entry.profile}" width="120" style="width: 120px; height: auto; border-radius: 4px; border: 1px solid #eee; display: block; outline: none; text-decoration: none;" referrerPolicy="no-referrer" />` : ''}
                  </td>
                </tr>
              </table>
            </div>
            <div style="display: block; font-size: 13px; line-height: 1.6; color: #444; background: #fafafa; padding: 15px; border-radius: 4px; border: 1px solid #f0f0f0;">
              <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tr>
                  <td style="padding-bottom: 5px;"><strong>${t.dimensioner}:</strong> ${entry.dimensions}</td>
                  <td style="padding-bottom: 5px;"><strong>${t.antal}:</strong> ${entry.quantity} st</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 5px;"><strong>${t.glas}:</strong> ${entry.glass}</td>
                  <td style="padding-bottom: 5px;"><strong>${t.ventilation}:</strong> ${entry.ventilation}</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 5px;"><strong>${t.handtag}:</strong> ${entry.handle}</td>
                  <td style="padding-bottom: 5px;"><strong>${t.farg_ut}:</strong> ${entry.colorOut}</td>
                </tr>
                <tr>
                  <td colspan="2"><strong>${t.farg_in}:</strong> ${entry.colorIn}</td>
                </tr>
              </table>
            </div>
          </div>
        `).join('')}
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
          ${t.footer}
        </div>
      </div>
    `;

    // Send to admin
    await transporter.sendMail({
      from: `"Fonsterfaktor Zapytania" <${process.env.GMAIL_USER}>`,
      to: 'macmus40@gmail.com',
      subject: `${t.title} ${t.from}: ${fName} ${lName}`,
      html: emailHtml,
    });

    // Send copy to client
    await transporter.sendMail({
      from: `"Fonsterfaktor" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: t.confirmation_subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h1 style="color: #f27d26;">${t.thanks}</h1>
          <p>${t.hi} ${fName},</p>
          <p>${t.received}</p>
          <p>${t.copy}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          ${emailHtml}
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error("Email error details:", {
      message: error.message,
      stack: error.stack,
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailPass: !!process.env.GMAIL_APP_PASSWORD
    });
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
}
