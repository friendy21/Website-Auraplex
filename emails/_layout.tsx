import { Body, Container, Head, Html, Preview, Section, Tailwind, Text } from '@react-email/components';
import type { ReactNode } from 'react';

// Email-safe palette literals (clients ignore CSS variables, so we inline).
const PAL = {
  paper: '#f4f6f8',
  surface: '#ffffff',
  border: '#e7eaee',     // neutral-100
  mute: '#8d949d',       // neutral-400
} as const;

export function EmailShell({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body style={{ backgroundColor: PAL.paper, fontFamily: 'Inter, sans-serif', padding: '32px 0' }}>
          <Container style={{ maxWidth: 560, margin: '0 auto', background: PAL.surface, padding: 40, border: `1px solid ${PAL.border}` }}>
            <Section>
              <Text style={{ fontFamily: 'Berkeley Mono, monospace', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: PAL.mute, margin: 0 }}>
                ▪ Auraplex · Made in Malaysia
              </Text>
            </Section>
            {children}
            <Section style={{ borderTop: `1px solid ${PAL.border}`, marginTop: 40, paddingTop: 24 }}>
              <Text style={{ fontSize: 11, color: PAL.mute, fontFamily: 'Berkeley Mono, monospace', margin: 0 }}>
                Auraplex SDN BHD · Shah Alam · Selangor · +60-3-0000-0000 · hello@auraplex.my
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
