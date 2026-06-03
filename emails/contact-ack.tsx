import { Heading, Text } from '@react-email/components';
import { EmailShell } from './_layout';

const PAL = {
  ink: '#181b20',
  body: '#3e444d',
} as const;

export default function ContactAck({ name = 'there' }: { name?: string }) {
  return (
    <EmailShell preview="Auraplex received your message.">
      <Heading style={{ fontFamily: 'Georgia, serif', fontSize: 32, lineHeight: 1.1, color: PAL.ink, marginTop: 32, marginBottom: 16 }}>
        Thanks, {name}.
      </Heading>
      <Text style={{ color: PAL.body, lineHeight: 1.7, fontSize: 16 }}>
        We received your message and will reply within one business day. For anything urgent, WhatsApp is fastest.
      </Text>
    </EmailShell>
  );
}
