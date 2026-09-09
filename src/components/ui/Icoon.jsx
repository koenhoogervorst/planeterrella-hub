/** Alle iconen als inline SVG — geen externe bibliotheek nodig.
 *  Gebaseerd op een 24×24 raster met lijnen van 1.8px. */

const PADEN = {
  dashboard: 'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z',
  kalender: 'M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  taken: 'M4 6h2l1.5 1.5L10 5M4 12h2l1.5 1.5L10 11M4 18h2l1.5 1.5L10 17M13 6h7M13 12h7M13 18h7',
  team: 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM20 20v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 5.2a3.25 3.25 0 0 1 0 6.1',
  bronnen: 'M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2 2 2 0 0 1 2-2h4.5A1.5 1.5 0 0 1 20 5.5v12a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 0 0-2 2 2 2 0 0 0-2-2H5.5A1.5 1.5 0 0 1 4 17.5v-12ZM12 6v14',
  onderzoek: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5.2-1.8L21 21M11 8v6M8 11h6',
  onderdelen: 'M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Zm0 0v18M4 7.5l8 4.5 8-4.5',
  eisen: 'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1ZM8 6H6.5A1.5 1.5 0 0 0 5 7.5v12A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 6H16M9 12l1.5 1.5L13.5 10M9 17h6',
  documentatie: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h3.7a1.5 1.5 0 0 1 1.2.6l1 1.4h7.1A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Z',
  beslissingen: 'M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M3 12h2m14 0h2M5.6 18.4 7 17m10-10 1.4-1.4M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z',
  risicos: 'M12 4.5 21 19.5H3L12 4.5Zm0 5v5m0 3v.01',
  voortgang: 'M4 20V10m5 10V4m5 16v-7m5 7V7',
  zoeken: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5.2-1.8L21 21',
  instellingen:
    'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm8-3.2a8 8 0 0 0-.13-1.4l2-1.55-2-3.46-2.36.95a8 8 0 0 0-2.42-1.4L14.7 2h-4l-.38 2.54a8 8 0 0 0-2.42 1.4L5.54 5 3.5 8.46l2 1.55A8 8 0 0 0 5.37 12c0 .48.05.94.13 1.4l-2 1.55 2 3.46 2.36-.95a8 8 0 0 0 2.42 1.4L10.7 22h4l.38-2.54a8 8 0 0 0 2.42-1.4l2.36.95 2-3.46-2-1.55c.08-.46.13-.92.13-1.4Z',
  plus: 'M12 5v14M5 12h14',
  potlood: 'M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3ZM15 6l3 3',
  prullenbak: 'M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m3 0v12.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5V7M10 11v6m4-6v6',
  kruis: 'M6 6l12 12M18 6 6 18',
  chevron: 'm9 6 6 6-6 6',
  chevronOmlaag: 'm6 9 6 6 6-6',
  chevronLinks: 'm15 6-6 6 6 6',
  filter: 'M4 5h16l-6 7v6l-4 2v-8L4 5Z',
  download: 'M12 4v11m0 0 4-4m-4 4-4-4M4 19h16',
  upload: 'M12 20V9m0 0 4 4M12 9 8 13M4 5h16',
  menu: 'M4 7h16M4 12h16M4 17h16',
  klok: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2',
  link: 'M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-1.2 1.2M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l1.2-1.2',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-9v5m0-8.5v.01',
  waarschuwing: 'M12 4.5 21 19.5H3L12 4.5Zm0 5v5m0 3v.01',
  vink: 'm5 12.5 4.5 4.5L19 7',
  ster: 'm12 4 2.4 5.1 5.6.8-4 4 .9 5.6-4.9-2.7-4.9 2.7.9-5.6-4-4 5.6-.8L12 4Z',
  blok: 'M6 6h5v5H6V6Zm7 0h5v5h-5V6ZM6 13h5v5H6v-5Zm7 0h5v5h-5v-5Z',
  lijst: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  slot: 'M7 11V8a5 5 0 0 1 10 0v3M6.5 11h11a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-6A1.5 1.5 0 0 1 6.5 11Z',
  bestand: 'M13 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V8l-5-5Zm0 0v5h5',
  pijlRechts: 'M5 12h14m0 0-5-5m5 5-5 5',
  vlag: 'M6 21V4m0 0h11l-2 4 2 4H6',
  vraag: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.2-11a2.2 2.2 0 1 1 3 2.05c-.5.2-.8.7-.8 1.25v.7m0 3v.01',
};

export function Icoon({ naam, grootte = 16, className = '', ...rest }) {
  const d = PADEN[naam];
  if (!d) return null;
  return (
    <svg
      width={grootte}
      height={grootte}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}

export default Icoon;
