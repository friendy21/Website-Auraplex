import { Button, Heading, Hr, Section, Text } from '@react-email/components';
import { EmailShell } from './_layout';

const PAL = {
  ink: '#181b20',
  body: '#3e444d',
  border: '#e7eaee',
  signal: '#2796df',
  paper: '#ffffff',
} as const;

export default function SpecSheet({
  name = 'there',
  productName,
  pdfUrl = '#',
}: {
  name?: string;
  productName: string;
  pdfUrl: string;
}) {
  return (
    <EmailShell preview={`Your ${productName} spec sheet is attached.`}>
      <Heading style={{ fontFamily: 'Georgia, serif', fontSize: 30, lineHeight: 1.1, color: PAL.ink, marginTop: 32, marginBottom: 12 }}>
        {productName} — spec sheet.
      </Heading>
      <Text style={{ color: PAL.body, lineHeight: 1.7, fontSize: 16 }}>
        {name === 'there' ? 'Hi.' : `Hi ${name},`} Here&apos;s the full spec sheet you requested.
      </Text>
      <Section style={{ margin: '24px 0' }}>
        <Button
          href={pdfUrl}
          style={{
            background: PAL.signal,
            color: PAL.paper,
            padding: '14px 28px',
            fontFamily: 'Berkeley Mono, monospace',
            fontSize: 13,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Download spec sheet →
        </Button>
      </Section>
      <Hr style={{ borderColor: PAL.border, margin: '24px 0' }} />
      <Text style={{ fontSize: 14, color: PAL.body, lineHeight: 1.7 }}>
        Want to talk through dimensions, throughput, or financing? Reply to this email or WhatsApp us at +60 12-345-6789.
      </Text>
    </EmailShell>
  );
}
