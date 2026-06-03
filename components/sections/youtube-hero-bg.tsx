'use client';

type Props = {
  /** YouTube video ID (the 11-char value from youtu.be/<ID> URLs). */
  id: string;
  /** Optional caption for assistive tech — defaults to "Background video". */
  title?: string;
};

/**
 * YouTube hero background.
 *
 * Embeds a YouTube video as a full-bleed background layer using the privacy-
 * enhanced youtube-nocookie.com domain. Configured to autoplay muted (the
 * only autoplay browsers allow), loop seamlessly, and disable every YouTube
 * affordance that would intrude on the editorial feel (controls, branding,
 * keyboard, fullscreen, related videos, annotations).
 *
 * The iframe is sized via CSS `max(vh, vw)` math to behave like `object-fit:
 * cover` — at any container aspect ratio it scales up to overflow rather
 * than letterbox. Center-anchored so cropping is symmetrical.
 *
 *   width  = max(177.78vh, 100vw)   // 16:9 of viewport height, never less than full width
 *   height = max(100vh, 56.25vw)    // full height, never less than 9:16 of width
 *
 * Pointer events disabled so the user never accidentally pauses by clicking
 * through the hero text or CTAs.
 *
 * Drop the real YouTube ID at the call site. To use a different video later,
 * change one constant in hero-cinematic.tsx — no other code edits.
 */
export function YoutubeHeroBg({ id, title = 'Background video' }: Props) {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: id, // loop=1 requires playlist param matching the video id
    controls: '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    iv_load_policy: '3', // hide annotations
    disablekb: '1',
    fs: '0',
    playsinline: '1',
    cc_load_policy: '0',
  });
  const src = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <iframe
        title={title}
        src={src}
        // Allow flags: autoplay + encrypted-media are needed for the embed to
        // start automatically; no others granted.
        allow="autoplay; encrypted-media; picture-in-picture"
        // No referrerpolicy header so YouTube can validate the embed origin.
        loading="eager"
        className="absolute left-1/2 top-1/2 border-0"
        style={{
          // object-fit: cover equivalent — keep iframe at 16:9 while ensuring
          // it always overflows the container.
          width: 'max(177.78vh, 100vw)',
          height: 'max(100vh, 56.25vw)',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
