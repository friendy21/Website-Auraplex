import { Heading, Section, Text, Hr } from '@react-email/components';
import { EmailShell } from './_layout';

const PAL = {
  ink: '#181b20',
  mute: '#8d949d',
  border: '#e7eaee',
} as const;

export default function NewLeadInternal({
  kind,
  data,
  leadId,
}: {
  kind: string;
  data: Record<string, unknown>;
  leadId: string;
}) {
  return (
    <EmailShell preview={`[${kind}] new lead — ${data.company ?? data.name ?? leadId}`}>
      <Heading style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: PAL.ink, marginTop: 32, marginBottom: 8 }}>
        New {kind} lead
      </Heading>
      <Text style={{ fontFamily: 'Berkeley Mono, monospace', fontSize: 11, color: PAL.mute, letterSpacing: 2, textTransform: 'uppercase' }}>
        {leadId}
      </Text>
      <Hr style={{ borderColor: PAL.border, margin: '20px 0' }} />
      <Section>
        {Object.entries(data).map(([k, v]) => (
          <Text key={k} style={{ fontSize: 14, margin: '6px 0', color: PAL.ink }}>
            <strong style={{ display: 'inline-block', minWidth: 100, fontFamily: 'Berkeley Mono, monospace', fontSize: 11, textTransform: 'uppercase', color: PAL.mute }}>
              {k}
            </strong>
            {typeof v === 'object' ? JSON.stringify(v) : String(v)}
          </Text>
        ))}
      </Section>
    </EmailShell>
  );
}
