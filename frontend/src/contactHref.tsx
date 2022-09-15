const subject = 'Hello, Bryant!';
const body = '(Optional: If unsure how to start this email, please break the ice by describing your dream pizza.)';

export const contactHref = `mailto:hello@bryantcodes.art?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
