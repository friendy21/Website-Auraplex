import { Heading, Section, Text, Hr } from '@react-email/components';
import { EmailShell } from './_layout';

const PAL = {
  ink: '#181b20',
  body: '#3e444d',       // neutral-700
  mute: '#8d949d',       // neutral-400
  border: '#e7eaee',     // neutral-100
  signal: '#2796df',
} as const;

export default function QuoteAck({
  name = 'there',
  productName,
  monthlyPrice,
}: {
  name?: string;
  productName?: string;
  monthlyPrice?: number;
}) {
  return (
    <EmailShell preview="Auraplex received your quote request — engineer reply within one business day.">
      <Heading style={{ fontFamily: 'Georgia, serif', fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em', color: PAL.ink, marginTop: 32, marginBottom: 16 }}>
        Thanks, {name}. We have it.
      </Heading>
      <Text style={{ color: PAL.body, lineHeight: 1.7, fontSize: 16 }}>
        An Auraplex engineer will reply within one business day with a detailed proposal, payment terms, and installation timeline.
      </Text>
      {productName && (
        <>
          <Hr style={{ borderColor: PAL.border, margin: '24px 0' }} />
          <Section>
            <Text style={{ fontFamily: 'Berkeley Mono, monospace', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: PAL.mute, margin: 0 }}>
              Requested machine
            </Text>
            <Text style={{ fontSize: 18, color: PAL.ink, margin: '4px 0 0' }}>{productName}</Text>
            {monthlyPrice && (
              <Text style={{ fontFamily: 'Berkeley Mono, monospace', color: PAL.signal, fontSize: 14 }}>
                From RM {monthlyPrice.toLocaleString()}/month · MIDA financing
              </Text>
            )}
          </Section>
        </>
      )}
      <Hr style={{ borderColor: PAL.border, margin: '24px 0' }} />
      <Text style={{ fontSize: 14, color: PAL.body }}>
        For urgent questions, WhatsApp us at +60 12-345-6789 — that&apos;s the fastest line.
      </Text>
    </EmailShell>
  );
}
